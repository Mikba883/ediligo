// Verifica del cellulare con codice via SMS.
// In produzione usa Twilio Verify (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_VERIFY_SERVICE_SID).
// Senza queste variabili, e solo con OTP_DEMO=1 oppure in sviluppo, entra in "modalità prova":
// nessun SMS viene inviato e il codice valido è 123456. In produzione senza Twilio la verifica è disattivata.

export const DEMO_CODE = "123456";

export function otpMode(): "twilio" | "demo" | "off" {
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_VERIFY_SERVICE_SID) {
    return "twilio";
  }
  if (process.env.OTP_DEMO === "1" || process.env.NODE_ENV !== "production") return "demo";
  return "off";
}

// Accetta cellulari italiani: 3xx xxx xxxx, con o senza +39 / 0039.
export function normalizeItalianMobile(raw: string): string | null {
  const digits = raw.replace(/[\s.\-()]/g, "").replace(/^(\+39|0039)/, "");
  if (!/^3\d{8,9}$/.test(digits)) return null;
  return `+39${digits}`;
}

function twilioAuth() {
  const id = process.env.TWILIO_ACCOUNT_SID!;
  const token = process.env.TWILIO_AUTH_TOKEN!;
  return "Basic " + Buffer.from(`${id}:${token}`).toString("base64");
}

export async function sendCode(phone: string): Promise<{ ok: boolean; error?: string }> {
  const mode = otpMode();
  if (mode === "off") return { ok: false, error: "La verifica via SMS non è ancora attiva." };
  if (mode === "demo") return { ok: true };
  const sid = process.env.TWILIO_VERIFY_SERVICE_SID!;
  const res = await fetch(`https://verify.twilio.com/v2/Services/${sid}/Verifications`, {
    method: "POST",
    headers: { Authorization: twilioAuth(), "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ To: phone, Channel: "sms", Locale: "it" }),
  });
  if (!res.ok) return { ok: false, error: "Non riusciamo a inviare l'SMS. Controlla il numero e riprova." };
  return { ok: true };
}

export async function checkCode(phone: string, code: string): Promise<boolean> {
  const mode = otpMode();
  if (mode === "off") return false;
  if (mode === "demo") return code === DEMO_CODE;
  const sid = process.env.TWILIO_VERIFY_SERVICE_SID!;
  const res = await fetch(`https://verify.twilio.com/v2/Services/${sid}/VerificationCheck`, {
    method: "POST",
    headers: { Authorization: twilioAuth(), "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ To: phone, Code: code }),
  });
  if (!res.ok) return false;
  const json = (await res.json()) as { status?: string };
  return json.status === "approved";
}

// Limite semplice in memoria: massimo 3 invii ogni 10 minuti per numero e 10 per indirizzo IP.
const sends = new Map<string, number[]>();
export function allowSend(key: string, max: number) {
  const now = Date.now();
  const recent = (sends.get(key) ?? []).filter((t) => now - t < 10 * 60 * 1000);
  if (recent.length >= max) return false;
  recent.push(now);
  sends.set(key, recent);
  return true;
}
