import { NextResponse } from "next/server";

// Ricerca di un indirizzo nel Comune di Milano con OpenStreetMap (Nominatim).
// Regole d'uso di Nominatim: al massimo 1 richiesta al secondo, niente autocompletamento,
// User-Agent identificativo, attribuzione "© OpenStreetMap". Per la produzione va sostituito
// con un servizio a pagamento (Google, Mapbox) o con un'istanza propria.

type Hit = {
  label: string;
  street: string;
  houseNumber: string | null;
  quarter: string | null;
  postcode: string | null;
  lat: number;
  lng: number;
};

const cache = new Map<string, Hit | null>();
let lastCall = 0;

// Rettangolo che contiene il Comune di Milano
const VIEWBOX = "9.04,45.54,9.28,45.38";

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q")?.trim() ?? "";
  if (q.length < 4 || q.length > 160) {
    return NextResponse.json({ error: "Scrivi via e numero civico." }, { status: 400 });
  }
  const key = q.toLowerCase();
  if (cache.has(key)) return respond(cache.get(key)!);

  const wait = lastCall + 1100 - Date.now();
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastCall = Date.now();

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.search = new URLSearchParams({
    q: /milano/i.test(q) ? q : `${q}, Milano`,
    format: "jsonv2",
    addressdetails: "1",
    limit: "1",
    countrycodes: "it",
    viewbox: VIEWBOX,
    bounded: "1",
    "accept-language": "it",
  }).toString();

  let res: Response;
  try {
    res = await fetch(url, { headers: { "User-Agent": "Ediligo-prototipo/0.1 (valutazione immobili Milano)" } });
  } catch {
    return NextResponse.json({ error: "Servizio indirizzi non raggiungibile. Riprova tra poco." }, { status: 502 });
  }
  if (!res.ok) {
    return NextResponse.json({ error: "Servizio indirizzi non disponibile. Riprova tra poco." }, { status: 502 });
  }

  const data = (await res.json()) as Array<{
    lat: string;
    lon: string;
    address?: Record<string, string>;
  }>;
  const first = data[0];
  const a = first?.address ?? {};
  const inMilano = first && (a.city === "Milano" || a.town === "Milano" || a.village === "Milano");

  const hit: Hit | null =
    first && inMilano && a.road
      ? {
          label: [a.road, a.house_number].filter(Boolean).join(", ") + `, ${a.postcode ? a.postcode + " " : ""}Milano`,
          street: a.road,
          houseNumber: a.house_number ?? null,
          quarter: a.quarter ?? a.neighbourhood ?? a.suburb ?? null,
          postcode: a.postcode ?? null,
          lat: Number(first.lat),
          lng: Number(first.lon),
        }
      : null;

  cache.set(key, hit);
  return respond(hit);
}

function respond(hit: Hit | null) {
  if (!hit) {
    return NextResponse.json(
      { error: "Non troviamo questo indirizzo nel Comune di Milano. Controlla via e civico." },
      { status: 404 },
    );
  }
  return NextResponse.json(hit);
}
