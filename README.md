# Ediligo

Servizi per chi vende casa da privato a Milano: quotazione con dati OMI, controllo documenti, annuncio e foto con l'AI, professionisti a prezzo fisso.

## Cosa c'è

| Percorso | Contenuto |
|---|---|
| `/` | Landing page: "Vendi casa da privato. Senza stress.", campo indirizzo come CTA principale, telefono con l'app, griglia dei servizi, calcolatore della provvigione (venditore e acquirente), tre passi, prezzi, domande, barra CTA fissa su telefono |
| `/valuta` | "Scopri quanto vale casa tua": indirizzo (o link dell'annuncio) → analisi dell'indirizzo → domande, una per schermata → nome e cellulare → codice SMS → valutazione. Si può aprire già con l'indirizzo: `/valuta?indirizzo=Via...` |
| `/brand` | Studio grafico v2 (logo, colori, tinte dei servizi, caratteri) |
| `/privacy` | Bozza di informativa, da validare con un legale |
| `docs/studio-cliente.md` | Studio v2 dal punto di vista del cliente: paure, messaggio, direzione visiva, percorso |
| `docs/studio-grafico.md` | Studio v1 (superato) con il benchmark dei concorrenti diretti e indiretti (`docs/benchmark/`) |
| `docs/anteprima/` | Screenshot delle pagine |

## Avvio

```bash
npm install
npm run dev
```

Poi apri http://localhost:3000.

## Dati di zona

`data/zone-milano.json` contiene **valori di esempio, non OMI**. Il sito lo dichiara nella pagina di quotazione. Per usare i dati ufficiali:

1. Scarica dal sito dell'Agenzia delle Entrate (Forniture dati OMI, accesso con SPID) i file `..._VALORI.csv` e `..._ZONE.csv` del semestre più recente per la provincia di Milano.
2. Copiali in `data/omi-raw/` (esclusa da git).
3. Esegui:

```bash
npm run import-omi -- data/omi-raw/NOMEFILE_VALORI.csv data/omi-raw/NOMEFILE_ZONE.csv 2025/2
```

I correttivi (stato, piano, esterni, box, classe energetica) sono in `lib/valuation.ts` e vanno tarati sulle compravendite reali.

## Configurazione

Copia `.env.example` in `.env.local`:

- `NEXT_PUBLIC_WHATSAPP_NUMBER`: mostra il pulsante WhatsApp nel modulo.
- `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`: salvano i contatti nella tabella creata da `supabase/migrations/0001_leads.sql`. Senza queste variabili il modulo risponde che non è ancora collegato e non salva nulla.

Prezzi dei pacchetti e acconto: `lib/site.ts`.

## Indirizzi e verifica del cellulare

- **Indirizzi:** `/api/geocode` cerca l'indirizzo nel Comune di Milano con OpenStreetMap (Nominatim) e assegna la zona più vicina. Nominatim va bene per il prototipo (max 1 richiesta al secondo, niente autocompletamento); per la produzione serve Google Places o Mapbox, e con i dati OMI reali i confini ufficiali delle zone.
- **Codice SMS:** `/api/otp/send` e `/api/otp/verify` usano Twilio Verify (`TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_VERIFY_SERVICE_SID`). Senza Twilio, con `OTP_DEMO=1` (o in sviluppo) la verifica è in modalità prova: nessun SMS, codice `123456`, e la pagina lo dice. In produzione senza Twilio e senza `OTP_DEMO` la verifica è disattivata.
- Dopo la verifica il contatto viene salvato su Supabase con `phone_verified = true` (migrazione `0002_phone_verified.sql`).
