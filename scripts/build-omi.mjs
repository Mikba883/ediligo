// Converte l'export OMI di Milano (tutti i semestri) nel file usato dalla valutazione.
//
// Uso:  npm run build-omi -- data/omi-raw/OMI_Milano_2004-2026.csv
//
// Il CSV ha le colonne: Anno;Semestre;Fascia;Zona;Zona_Descr;LinkZona;Cod_Tip;Descr_Tipologia;Stato;
// Compr_min;Compr_max;Sup_NL_compr;Loc_min;Loc_max;Sup_NL_loc;Comune_descrizione;Prov;Regione
//
// Per ogni zona del semestre più recente prende le "Abitazioni civili" in stato NORMALE e OTTIMO,
// e la serie storica (centro della forchetta NORMALE) per calcolare l'andamento dei prezzi.
// Le coordinate approssimative delle zone vengono da data/omi-zone-coords.json (scripts/geocode-zones.mjs).

import { existsSync, readFileSync, writeFileSync } from "node:fs";

const [csvPath = "data/omi-raw/OMI_Milano_2004-2026.csv"] = process.argv.slice(2);

const lines = readFileSync(csvPath, "utf8").split(/\r?\n/).filter((l) => l.trim());
const header = lines[0].split(";");
const rows = lines.slice(1).map((l) => {
  const c = l.split(";");
  return Object.fromEntries(header.map((h, i) => [h.trim(), (c[i] ?? "").trim()]));
});

const num = (s) => Number(String(s).replace(",", "."));
const key = (r) => Number(r.Anno) * 10 + Number(r.Semestre);
const latest = Math.max(...rows.map(key));
const period = `${Math.floor(latest / 10)}/${latest % 10}`;

const civili = rows.filter((r) => r.Descr_Tipologia === "Abitazioni civili" && r.Comune_descrizione === "MILANO");

const FASCE = { B: "Centrale", C: "Semicentrale", D: "Periferica", E: "Suburbana", R: "Extraurbana" };

const titleCase = (s) =>
  s
    .toLowerCase()
    .replace(/`/g, "'")
    .replace(/\s*-\s*microzona\s*\d+/i, "")
    .replace(/\s*,\s*,/g, ",")
    .replace(/\s+/g, " ")
    .replace(/\s*-\s*/g, " - ")
    .replace(/(^|[\s'(\-,.])([a-zàèéìòù])/g, (_, p, c) => p + c.toUpperCase())
    .trim();

const coordsPath = "data/omi-zone-coords.json";
const coords = existsSync(coordsPath) ? JSON.parse(readFileSync(coordsPath, "utf8")) : {};

const zoneIds = [...new Set(civili.filter((r) => key(r) === latest).map((r) => r.Zona))];

const zones = zoneIds
  .map((id) => {
    const now = civili.filter((r) => r.Zona === id && key(r) === latest);
    const normale = now.find((r) => r.Stato === "NORMALE");
    const ottimo = now.find((r) => r.Stato === "OTTIMO");
    const base = normale ?? ottimo; // City Life e Cascina Merlata hanno solo OTTIMO (costruzioni nuove)
    const descr = base.Zona_Descr;
    const history = [
      ...new Map(
        civili
          .filter((r) => r.Zona === id && r.Stato === (normale ? "NORMALE" : "OTTIMO"))
          .sort((a, b) => key(a) - key(b))
          .map((r) => [key(r), Math.round((num(r.Compr_min) + num(r.Compr_max)) / 2)]),
      ),
    ].map(([k, mid]) => ({ p: `${Math.floor(k / 10)}/${k % 10}`, mid }));
    const c = coords[id];
    return {
      id,
      name: titleCase(descr),
      areas: `Zona OMI ${id}, fascia ${FASCE[base.Fascia] ?? base.Fascia}`,
      fascia: base.Fascia,
      linkZona: base.LinkZona,
      min: num(base.Compr_min),
      max: num(base.Compr_max),
      ottimoMin: ottimo ? num(ottimo.Compr_min) : null,
      ottimoMax: ottimo ? num(ottimo.Compr_max) : null,
      onlyOttimo: !normale,
      ...(c ? { lat: c.lat, lng: c.lng } : {}),
      history,
    };
  })
  .sort((a, b) => a.fascia.localeCompare(b.fascia) || a.id.localeCompare(b.id, "it", { numeric: true }));

const out = {
  source: "omi",
  note: "Quotazioni OMI dell'Agenzia delle Entrate, Comune di Milano, abitazioni civili. min/max = stato normale, ottimoMin/ottimoMax = stato ottimo. history = centro della forchetta per semestre.",
  period,
  unit: "euro/m² di superficie lorda",
  zones,
};
writeFileSync("data/zone-milano.json", JSON.stringify(out) + "\n");
const missing = zones.filter((z) => z.lat === undefined).map((z) => z.id);
console.log(`Semestre ${period}: ${zones.length} zone.${missing.length ? ` Senza coordinate: ${missing.join(", ")}` : ""}`);
