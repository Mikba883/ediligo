import { NextResponse } from "next/server";
import { checkCode, normalizeItalianMobile } from "@/lib/otp";

// Verifica il codice e, se è giusto, salva il contatto con il numero verificato.
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    phone?: string;
    code?: string;
    name?: string;
    need?: string;
    zone?: string;
    payload?: unknown;
    privacyConsent?: boolean;
    marketingConsent?: boolean;
  };
  const phone = normalizeItalianMobile(body.phone ?? "");
  const code = (body.code ?? "").replace(/\D/g, "");
  if (!phone || code.length !== 6) {
    return NextResponse.json({ error: "Inserisci il codice di 6 cifre che ti abbiamo mandato." }, { status: 400 });
  }
  if (body.privacyConsent !== true) {
    return NextResponse.json({ error: "Serve il consenso privacy." }, { status: 400 });
  }
  if (!(await checkCode(phone, code))) {
    return NextResponse.json({ error: "Codice non valido o scaduto. Controlla l'SMS o richiedine uno nuovo." }, { status: 400 });
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  let saved = false;
  if (url && key) {
    const res = await fetch(`${url}/rest/v1/leads`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        name: (body.name ?? "").trim().slice(0, 120) || "Senza nome",
        phone,
        phone_verified: true,
        zone: body.zone?.slice(0, 80) ?? null,
        need: (body.need ?? "Valutazione").slice(0, 80),
        valuation: body.payload ?? null,
        privacy_consent: true,
        marketing_consent: body.marketingConsent === true,
        source_page: "valuta",
      }),
    });
    saved = res.ok;
  }
  return NextResponse.json({ ok: true, saved });
}
