import zoneData from "@/data/zone-milano.json";

export type Zone = {
  id: string;
  name: string;
  areas: string;
  min: number; // OMI stato normale
  max: number;
  ottimoMin?: number | null; // OMI stato ottimo
  ottimoMax?: number | null;
  lat?: number;
  lng?: number;
  history?: { p: string; mid: number }[];
};

export const zones: Zone[] = zoneData.zones as Zone[];
export const zoneSource = {
  isSample: zoneData.source === "esempio",
  label: zoneData.source === "esempio" ? "Dati di esempio" : `Dati OMI ${zoneData.period ?? ""}`.trim(),
};

// Assegna un punto alla zona con il centro più vicino. È un'approssimazione per il prototipo:
// con i dati OMI reali si usano i confini ufficiali delle zone (file KML dell'Agenzia delle Entrate).
export function zoneForPoint(lat: number, lng: number): Zone | null {
  let best: Zone | null = null;
  let bestD = Infinity;
  const kx = Math.cos((lat * Math.PI) / 180);
  for (const z of zones) {
    if (z.lat === undefined || z.lng === undefined) continue;
    const d = ((z.lng - lng) * kx) ** 2 + (z.lat - lat) ** 2;
    if (d < bestD) {
      bestD = d;
      best = z;
    }
  }
  return best;
}

// Andamento dei prezzi OMI della zona (centro della forchetta) negli ultimi N anni.
export function zoneTrend(zone: Zone, years: number): { pct: number; from: string; to: string } | null {
  const h = zone.history;
  if (!h || h.length < years * 2 + 1) return null;
  const last = h[h.length - 1];
  const first = h[h.length - 1 - years * 2];
  return { pct: last.mid / first.mid - 1, from: first.p, to: last.p };
}

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
  baseLabel: string;
  baseMin: number;
  baseMax: number;
  low: number;
  high: number;
  sqmLow: number;
  sqmHigh: number;
  listingPrice: number;
  adjustments: Adjustment[];
};

// Lo stato della casa sceglie la fascia OMI: "normale" o "ottimo".
// Da ristrutturare: metà bassa della fascia normale, con un ulteriore -10% sul minimo.
// Ristrutturata: a metà tra normale e ottimo. Nuova: fascia ottimo.
const conditionLabel: Record<Condition, string> = {
  "da-ristrutturare": "Da ristrutturare: metà bassa della fascia OMI normale",
  buono: "In buono stato: fascia OMI normale",
  ristrutturato: "Ristrutturata: tra fascia OMI normale e ottimo",
  nuovo: "Nuova: fascia OMI ottimo",
};

function baseRange(zone: Zone, condition: Condition): [number, number] {
  const nMin = zone.min;
  const nMax = zone.max;
  const oMin = zone.ottimoMin ?? nMax;
  const oMax = zone.ottimoMax ?? nMax * 1.15;
  switch (condition) {
    case "da-ristrutturare":
      return [nMin * 0.9, (nMin + nMax) / 2];
    case "buono":
      return [nMin, nMax];
    case "ristrutturato":
      return [(nMin + oMin) / 2, (nMax + oMax) / 2];
    case "nuovo":
      return [oMin, oMax];
  }
}

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

  const [baseMin, baseMax] = baseRange(zone, input.condition);
  const adjustments = [
    floorAdj(input.floor, input.lift),
    ...input.extras.map((e) => extraAdj[e]),
    energyAdj[input.energy],
  ].filter((a): a is Adjustment => a !== null);

  const factor = adjustments.reduce((f, a) => f * (1 + a.pct), 1);
  const sqmLow = baseMin * factor;
  const sqmHigh = baseMax * factor;
  const low = round5k(sqmLow * input.sqm);
  const high = round5k(sqmHigh * input.sqm);

  return {
    zone,
    baseLabel: conditionLabel[input.condition],
    baseMin: Math.round(baseMin / 10) * 10,
    baseMax: Math.round(baseMax / 10) * 10,
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
