// Calcola un centro approssimativo per ogni zona OMI di Milano cercando su OpenStreetMap
// i luoghi elencati nella descrizione della zona (es. "PIOLA, ARGONNE, CORSICA") e facendone la media.
// Serve finché non abbiamo i confini ufficiali delle zone (file KML dell'Agenzia delle Entrate).
//
// Uso:  node scripts/geocode-zones.mjs data/omi-raw/OMI_Milano_2004-2026.csv
// Rispetta le regole di Nominatim: 1 richiesta al secondo, User-Agent identificativo.

import { readFileSync, writeFileSync } from "node:fs";

const [csvPath = "data/omi-raw/OMI_Milano_2004-2026.csv"] = process.argv.slice(2);
const lines = readFileSync(csvPath, "utf8").split(/\r?\n/).filter((l) => l.trim());
const header = lines[0].split(";");
const rows = lines.slice(1).map((l) => Object.fromEntries(header.map((h, i) => [h, l.split(";")[i]])));
const latest = Math.max(...rows.map((r) => Number(r.Anno) * 10 + Number(r.Semestre)));
const zones = new Map(
  rows.filter((r) => Number(r.Anno) * 10 + Number(r.Semestre) === latest).map((r) => [r.Zona, r.Zona_Descr]),
);

// Rettangolo del Comune di Milano
const BOX = { w: 9.04, s: 45.38, e: 9.28, n: 45.54 };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const fix = {
  "P.TA": "Porta",
  "P.": "Parco",
  "Q.": "Quartiere",
  "B.": "Borromeo",
  "SANBABILA": "San Babila",
  "UNIVERSITA STATALE": "Università Statale",
  "SANT`AMBROGIO": "Sant'Ambrogio",
  "VIA DANTE": "Via Dante",
};

function places(descr) {
  return descr
    .replace(/CENTRO STORICO\s*-\s*/i, "")
    .split(/,|\s-\s/)
    .map((p) => p.trim())
    .filter((p) => p && !/^microzona/i.test(p))
    .map((p) => {
      let s = p;
      for (const [a, b] of Object.entries(fix)) s = s.replace(a, b);
      return s;
    });
}

async function lookup(q) {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.search = new URLSearchParams({
    q: `${q}, Milano`,
    format: "jsonv2",
    limit: "1",
    countrycodes: "it",
    viewbox: `${BOX.w},${BOX.n},${BOX.e},${BOX.s}`,
    bounded: "1",
  }).toString();
  const res = await fetch(url, { headers: { "User-Agent": "Ediligo-prototipo/0.1 (zone OMI Milano)" } });
  await sleep(1100);
  if (!res.ok) return null;
  const [hit] = await res.json();
  return hit ? { lat: Number(hit.lat), lng: Number(hit.lon) } : null;
}

// Zone dove la ricerca automatica sbaglia per omonimie: coordinate fissate a mano.
const MANUAL = {
  B13: { lat: 45.459, lng: 9.188, from: ["Università Statale, San Lorenzo (corretta a mano)"] },
  C13: { lat: 45.478, lng: 9.156, from: ["City Life (corretta a mano)"] },
  C15: { lat: 45.49, lng: 9.198, from: ["Stazione Centrale, Viale Stelvio (corretta a mano)"] },
  C19: { lat: 45.45, lng: 9.194, from: ["Tabacchi, Sarfatti, Crema (corretta a mano)"] },
};

const out = {};
for (const [id, descr] of zones) {
  if (MANUAL[id]) {
    out[id] = MANUAL[id];
    continue;
  }
  const pts = [];
  for (const p of places(descr)) {
    const hit = await lookup(p);
    if (hit) pts.push({ ...hit, p });
  }
  if (!pts.length) {
    console.log(`${id}: nessun luogo trovato (${descr})`);
    continue;
  }
  // Scarta i punti lontani più di 3 km dalla mediana (omonimie)
  const med = (a) => a.slice().sort((x, y) => x - y)[Math.floor(a.length / 2)];
  const mLat = med(pts.map((x) => x.lat));
  const mLng = med(pts.map((x) => x.lng));
  const near = pts.filter((x) => Math.hypot((x.lat - mLat) * 111, (x.lng - mLng) * 78) < 3);
  const use = near.length ? near : pts;
  out[id] = {
    lat: +(use.reduce((s, x) => s + x.lat, 0) / use.length).toFixed(5),
    lng: +(use.reduce((s, x) => s + x.lng, 0) / use.length).toFixed(5),
    from: use.map((x) => x.p),
  };
  console.log(`${id}: ${out[id].lat}, ${out[id].lng}  (${out[id].from.join(", ")})`);
}
writeFileSync("data/omi-zone-coords.json", JSON.stringify(out, null, 2) + "\n");
