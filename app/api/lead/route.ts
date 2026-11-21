import { NextResponse } from "next/server";

type LeadBody = {
  name?: string;
  contact?: string;
  zone?: string;
  need?: string;
  packageId?: string;
  valuation?: unknown;
  privacyConsent?: boolean;
  marketingConsent?: boolean;
  sourcePage?: string;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^\+?[\d\s]{8,16}$/;

export async function POST(req: Request) {
  let body: LeadBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Richiesta non valida." }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const contact = body.contact?.trim() ?? "";
  const need = body.need?.trim() ?? "";

  if (!name || !need) {
    return NextResponse.json({ error: "Inserisci nome e cosa ti serve." }, { status: 400 });
  }
  const isEmail = EMAIL.test(contact);
  const isPhone = PHONE.test(contact);
  if (!isEmail && !isPhone) {
    return NextResponse.json({ error: "Inserisci un'email o un numero di telefono valido." }, { status: 400 });
  }
  if (body.privacyConsent !== true) {
    return NextResponse.json({ error: "Serve il consenso al trattamento dei dati per ricontattarti." }, { status: 400 });
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    // Nessun archivio collegato: non fingiamo di aver salvato il contatto.
    return NextResponse.json(
      { error: "Il modulo non è ancora collegato: riprova tra qualche giorno." },
      { status: 503 },
    );
  }

  const res = await fetch(`${url}/rest/v1/leads`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      name: name.slice(0, 120),
      email: isEmail ? contact.slice(0, 200) : null,
      phone: isPhone ? contact.replace(/\s/g, "") : null,
      zone: body.zone?.slice(0, 80) ?? null,
      need: need.slice(0, 80),
      package_id: body.packageId?.slice(0, 20) ?? null,
      valuation: body.valuation ?? null,
      privacy_consent: true,
      marketing_consent: body.marketingConsent === true,
      source_page: body.sourcePage?.slice(0, 80) ?? null,
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Non siamo riusciti a salvare la richiesta. Riprova tra poco." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
