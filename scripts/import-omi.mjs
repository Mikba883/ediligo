// Converte i file OMI dell'Agenzia delle Entrate nel formato usato dalla quotazione.
//
// 1. Scarica dal sito dell'Agenzia delle Entrate (area "Forniture dati OMI", accesso con SPID)
//    le quotazioni del semestre più recente per la provincia di Milano. Ottieni due CSV:
//    ..._VALORI.csv e ..._ZONE.csv
// 2. Copiali in data/omi-raw/ (cartella esclusa da git)
// 3. Esegui:  npm run import-omi -- data/omi-raw/XXX_VALORI.csv data/omi-raw/XXX_ZONE.csv 2025/2
//
// Il risultato sostituisce data/zone-milano.json con una zona per ogni zona OMI del Comune di Milano
// (abitazioni civili, stato conservativo normale).

import { readFileSync, writeFileSync } from "node:fs";

const [valoriPath, zonePath, period] = process.argv.slice(2);
if (!valoriPath || !zonePath) {
  console.error("Uso: npm run import-omi -- <VALORI.csv> <ZONE.csv> [periodo es. 2025/2]");
  process.exit(1);
}

function readCsv(path, mustContain) {
  const lines = readFileSync(path, "latin1").split(/\r?\n/).filter((l) => l.trim());
  const headerIdx = lines.findIndex((l) => l.includes(mustContain));
  if (headerIdx === -1) throw new Error(`Intestazione con "${mustContain}" non trovata in ${path}`);
  const header = lines[headerIdx].split(";").map((h) => h.trim());
  return lines.slice(headerIdx + 1).map((line) => {
    const cells = line.split(";");
    return Object.fromEntries(header.map((h, i) => [h, (cells[i] ?? "").trim()]));
  });
}

const num = (s) => Number(String(s).replace(/\./g, "").replace(",", "."));
const isMilano = (r) => (r.Comune_descrizione ?? r.Comune_amm ?? "").toUpperCase() === "MILANO";

const valori = readCsv(valoriPath, "Compr_min").filter(
  (r) => isMilano(r) && /abitazioni civili/i.test(r.Descr_Tipologia) && /normale/i.test(r.Stato),
);
const zoneRows = readCsv(zonePath, "Zona_Descr").filter(isMilano);

const zoneNames = new Map(zoneRows.map((z) => [z.Zona, z.Zona_Descr]));

const titleCase = (s) =>
  s.toLowerCase().replace(/(^|[\s'(\-/])([a-zàèéìòù])/g, (_, p, c) => p + c.toUpperCase());

const zones = valori
  .map((r) => {
    const descr = (zoneNames.get(r.Zona) ?? r.Zona).replace(/^'|'$/g, "");
    return {
      id: r.Zona,
      name: titleCase(descr.split(",")[0] ?? descr),
      areas: titleCase(descr),
      min: num(r.Compr_min),
      max: num(r.Compr_max),
    };
  })
  .filter((z) => z.min > 0 && z.max >= z.min)
  .sort((a, b) => a.name.localeCompare(b.name, "it"));

if (zones.length === 0) {
  console.error("Nessuna zona trovata: controlla che i file siano quelli della provincia di Milano.");
  process.exit(1);
}

const out = {
  source: "omi",
  note: "Quotazioni OMI dell'Agenzia delle Entrate, abitazioni civili in stato normale, Comune di Milano.",
  period: period ?? null,
  unit: "euro/m² per abitazioni civili in stato normale",
  zones,
};
writeFileSync("data/zone-milano.json", JSON.stringify(out, null, 2) + "\n");
console.log(`Importate ${zones.length} zone OMI del Comune di Milano in data/zone-milano.json`);
