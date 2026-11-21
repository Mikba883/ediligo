import { NextResponse } from "next/server";
import { allowSend, normalizeItalianMobile, otpMode, sendCode } from "@/lib/otp";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { phone?: string; privacyConsent?: boolean };
  const phone = normalizeItalianMobile(body.phone ?? "");
  if (!phone) {
    return NextResponse.json({ error: "Inserisci un cellulare italiano valido, ad esempio 347 123 4567." }, { status: 400 });
  }
  if (body.privacyConsent !== true) {
    return NextResponse.json({ error: "Serve il consenso privacy per inviarti il codice." }, { status: 400 });
  }
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (!allowSend(`p:${phone}`, 3) || !allowSend(`ip:${ip}`, 10)) {
    return NextResponse.json({ error: "Troppi tentativi. Riprova tra 10 minuti." }, { status: 429 });
  }
  const sent = await sendCode(phone);
  if (!sent.ok) return NextResponse.json({ error: sent.error }, { status: 503 });
  return NextResponse.json({ ok: true, phone, demo: otpMode() === "demo" });
}
