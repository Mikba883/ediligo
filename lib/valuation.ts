import zoneData from "@/data/zone-milano.json";

export type Zone = { id: string; name: string; areas: string; min: number; max: number };

export const zones: Zone[] = zoneData.zones;
export const zoneSource = {
  isSample: zoneData.source === "esempio",
  label: zoneData.source === "esempio" ? "Dati di esempio" : `Dati OMI ${zoneData.period ?? ""}`.trim(),
};

export type Condition = "da-ristrutturare" | "buono" | "ristrutturato" | "nuovo";
export type Extra = "balcone" | "terrazzo" | "giardino" | "box" | "cantina";
export type Energy = "non-so" | "alta" | "media" | "bassa";

export type ValuationInput = {
  zoneId: string;
  sqm: number;
  condition: Condition;
  floor: number; // 0 = piano terra
  lift: boolean;
  extras: Extra[];
  energy: Energy;
};

export type Adjustment = { label: string; pct: number };

export type ValuationResult = {
  zone: Zone;
  low: number;
  high: number;
  sqmLow: number;
  sqmHigh: number;
  listingPrice: number;
  adjustments: Adjustment[];
};

// Coefficienti semplici e dichiarati: ipotesi di prodotto da tarare sulle compravendite reali.
const conditionAdj: Record<Condition, Adjustment | null> = {
  "da-ristrutturare": { label: "Da ristrutturare", pct: -0.15 },
  buono: null,
  ristrutturato: { label: "Ristrutturata da poco", pct: 0.08 },
  nuovo: { label: "Nuova o mai abitata", pct: 0.15 },
};

const extraAdj: Record<Extra, Adjustment> = {
  balcone: { label: "Balcone", pct: 0.02 },
  terrazzo: { label: "Terrazzo", pct: 0.06 },
  giardino: { label: "Giardino privato", pct: 0.05 },
  box: { label: "Box o posto auto", pct: 0.04 },
  cantina: { label: "Cantina", pct: 0.01 },
};

const energyAdj: Record<Energy, Adjustment | null> = {
  "non-so": null,
  alta: { label: "Classe energetica A o B", pct: 0.05 },
  media: null,
  bassa: { label: "Classe energetica E, F o G", pct: -0.04 },
};

// Sconto medio in trattativa a Milano intorno al 6%: l'annuncio parte un po' sopra la stima.
const NEGOTIATION_MARGIN = 0.06;

function floorAdj(floor: number, lift: boolean): Adjustment | null {
  if (floor === 0) return { label: "Piano terra", pct: -0.08 };
  if (floor >= 3 && !lift) return { label: `${floor}° piano senza ascensore`, pct: -0.1 };
  if (floor >= 4 && lift) return { label: `${floor}° piano con ascensore`, pct: 0.04 };
  return null;
}

const round5k = (n: number) => Math.round(n / 5000) * 5000;

export function estimate(input: ValuationInput): ValuationResult | null {
  const zone = zones.find((z) => z.id === input.zoneId);
  if (!zone || !Number.isFinite(input.sqm) || input.sqm < 15 || input.sqm > 1000) return null;

  const adjustments = [
    conditionAdj[input.condition],
    floorAdj(input.floor, input.lift),
    ...input.extras.map((e) => extraAdj[e]),
    energyAdj[input.energy],
  ].filter((a): a is Adjustment => a !== null);

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

const LISTING_HOSTS = ["immobiliare.it", "idealista.it", "casa.it", "subito.it", "wikicasa.it"];

export function parseListingUrl(raw: string): { ok: true; host: string; url: string } | { ok: false; error: string } {
  const value = raw.trim();
  if (!value) return { ok: false, error: "Incolla il link del tuo annuncio." };
  let url: URL;
  try {
    url = new URL(value.startsWith("http") ? value : `https://${value}`);
  } catch {
    return { ok: false, error: "Questo non sembra un link. Copialo dalla barra del browser o dal pulsante Condividi." };
  }
  const host = url.hostname.replace(/^www\.|^m\./, "");
  const match = LISTING_HOSTS.find((h) => host === h || host.endsWith(`.${h}`));
  if (!match) {
    return { ok: false, error: "Per ora leggiamo annunci di Immobiliare.it, Idealista, Casa.it, Subito e Wikicasa." };
  }
  return { ok: true, host: match, url: url.toString() };
}
