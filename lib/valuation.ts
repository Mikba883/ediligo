import zoneData from "@/data/zone-milano.json";

export type Zone = { id: string; name: string; areas: string; min: number; max: number };

export const zones: Zone[] = zoneData.zones;
export const zoneSource = {
  isSample: zoneData.source === "esempio",
  label: zoneData.source === "esempio" ? "valori di esempio, non ancora OMI" : `OMI ${zoneData.period ?? ""}`.trim(),
  note: zoneData.note,
};

export type Condition = "da-ristrutturare" | "buono" | "ristrutturato" | "nuovo";
export type Outdoor = "nessuno" | "balcone" | "terrazzo";
export type Energy = "non-so" | "alta" | "media" | "bassa";

export type ValuationInput = {
  zoneId: string;
  sqm: number;
  condition: Condition;
  floor: number; // 0 = piano terra
  lift: boolean;
  outdoor: Outdoor;
  garage: boolean;
  energy: Energy;
};

export type Adjustment = { label: string; pct: number };

export type ValuationResult = {
  zone: Zone;
  low: number;
  high: number;
  sqmLow: number;
  sqmHigh: number;
  listingPrice: number; // prezzo d'annuncio suggerito
  adjustments: Adjustment[];
};

// Coefficienti correttivi semplici e dichiarati. Sono ipotesi di prodotto:
// vanno tarati sui rogiti reali (banca dati dei valori dichiarati dell'Agenzia Entrate).
const conditionPct: Record<Condition, [string, number]> = {
  "da-ristrutturare": ["Da ristrutturare", -0.15],
  buono: ["In buono stato", 0],
  ristrutturato: ["Ristrutturato da poco", 0.08],
  nuovo: ["Nuovo o mai abitato", 0.15],
};

const energyPct: Record<Energy, [string, number] | null> = {
  "non-so": null,
  alta: ["Classe energetica A o B", 0.05],
  media: ["Classe energetica C o D", 0],
  bassa: ["Classe energetica E, F o G", -0.04],
};

// Margine medio di trattativa a Milano (circa 6%): l'annuncio parte un po' sopra la stima.
const NEGOTIATION_MARGIN = 0.06;

function floorAdjustment(floor: number, lift: boolean): Adjustment | null {
  if (floor === 0) return { label: "Piano terra", pct: -0.08 };
  if (floor >= 3 && !lift) return { label: `Piano ${floor} senza ascensore`, pct: -0.1 };
  if (floor >= 4 && lift) return { label: `Piano ${floor} con ascensore`, pct: 0.04 };
  return null;
}

const round5k = (n: number) => Math.round(n / 5000) * 5000;

export function estimate(input: ValuationInput): ValuationResult | null {
  const zone = zones.find((z) => z.id === input.zoneId);
  if (!zone || !Number.isFinite(input.sqm) || input.sqm < 15 || input.sqm > 1000) return null;

  const adjustments: Adjustment[] = [];
  const [condLabel, condPct] = conditionPct[input.condition];
  if (condPct !== 0) adjustments.push({ label: condLabel, pct: condPct });

  const floorAdj = floorAdjustment(input.floor, input.lift);
  if (floorAdj) adjustments.push(floorAdj);

  if (input.outdoor === "balcone") adjustments.push({ label: "Balcone", pct: 0.02 });
  if (input.outdoor === "terrazzo") adjustments.push({ label: "Terrazzo", pct: 0.06 });
  if (input.garage) adjustments.push({ label: "Box o posto auto", pct: 0.04 });

  const energy = energyPct[input.energy];
  if (energy && energy[1] !== 0) adjustments.push({ label: energy[0], pct: energy[1] });

  const factor = adjustments.reduce((f, a) => f * (1 + a.pct), 1);
  const sqmLow = zone.min * factor;
  const sqmHigh = zone.max * factor;
  const low = round5k(sqmLow * input.sqm);
  const high = round5k(sqmHigh * input.sqm);

  return {
    zone,
    low,
    high,
    sqmLow: Math.round(sqmLow / 10) * 10,
    sqmHigh: Math.round(sqmHigh / 10) * 10,
    listingPrice: round5k(((low + high) / 2) * (1 + NEGOTIATION_MARGIN)),
    adjustments,
  };
}
