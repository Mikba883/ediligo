# Ediligo

Servizi per chi vende casa da privato a Milano: quotazione con dati OMI, controllo documenti, annuncio e foto con l'AI, professionisti a prezzo fisso.

## Cosa c'è

| Percorso | Contenuto |
|---|---|
| `/` | Landing page: apertura con quotazione rapida e "fascicolo" di esempio, problemi, come funziona, prezzi con calcolo del risparmio, network, domande, modulo contatti |
| `/quotazione` | Prototipo di quotazione: stima con fasce di zona e correttivi spiegati voce per voce |
| `/brand` | Studio grafico (logo, colori, caratteri, semaforo dei documenti) |
| `/privacy` | Bozza di informativa, da validare con un legale |
| `docs/studio-grafico.md` | Studio completo, con benchmark dei concorrenti diretti e indiretti (`docs/benchmark/`) |
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
