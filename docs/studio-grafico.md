# Ediligo — Studio grafico e di marca

Versione 1 · novembre 2026 · base per landing page e prototipo di quotazione

## 1. Cosa stiamo progettando

- **Prodotto:** un'app che accompagna il privato che vende casa a Milano senza agenzia. L'AI fa quotazione, annuncio, foto e primo controllo dei documenti; un network di professionisti (geometri, certificatori APE, avvocati) interviene a prezzo fisso dove serve una firma.
- **Pubblico:** proprietari 35–70 anni, quasi sempre alla prima o seconda vendita della vita. Non sono esperti: hanno paura di sbagliare prezzo, di avere documenti non in regola e di perdere tempo con visite inutili.
- **Compito della pagina:** far provare subito la quotazione gratuita e far lasciare un contatto (o un acconto) per i pacchetti.

## 2. Benchmark: concorrenti diretti

Screenshot in `docs/benchmark/`.

| Sito | Cosa fa vedere | Cosa impariamo |
|---|---|---|
| **Dove.it** (`doveit.jpg`) | Magenta saturo, bottone verde acqua, titolo centrato e urlato: «ZERO COMMISSIONI». Tutto maiuscolo nel menu. | Linguaggio da promozione. Funziona per il prezzo, ma comunica "offerta", non "fiducia". |
| **Casavo** (`casavo.jpg`) | Arancione pieno, carattere Inter, un solo campo indirizzo e un bottone nero. | Il campo indirizzo come primo gesto è efficace e ormai atteso. |
| **RockAgent** (`rockagent.jpg`) | Foto stock di agenti in giacca e cravatta, rosso, badge Trustpilot e premi. | Messaggio: "ci pensiamo noi". È l'opposto del nostro: da noi il protagonista è il proprietario. |
| **RealAdvisor** (`realadvisor.jpg`) | Bianco/crema, testo azzurro sfumato, foto di famiglia felice, riga di numeri grandi. | Il kit SaaS generico. Pulito ma intercambiabile. |
| **Immobiliare.it, Idealista** | Bloccano l'accesso automatico. | — |

**Schema comune del settore:** campo "valuta la tua casa" in apertura + colore saturo + foto stock di persone + badge recensioni + "miglior prezzo". Nessuno mostra *la casa come documento*, che è proprio il punto dove il privato ha più paura.

## 3. Benchmark: servizi B2C che guidano l'utente in un processo

| Servizio | Idea chiave da prendere | Note |
|---|---|---|
| **Airbnb, pagina "diventa host"** (`indiretti-airbnb_host.jpg`) | Il risultato è il protagonista: «Potresti guadagnare X» con un cursore. Tre promesse semplici: è semplice, ne vale la pena, ti proteggiamo. «Iniziare è gratuito». | È il caso più vicino al nostro: un privato che mette online *casa sua* con l'aiuto di una piattaforma. |
| **Purplebricks / Strike** (UK) (`indiretti-purplebricks.jpg`) | Prezzo fisso in apertura («vendi da £999, niente in anticipo»), elenco puntato di cosa è incluso, **calcolatore del risparmio rispetto all'agenzia**. | Modello più simile al nostro in Europa. Strike ha acquisito Purplebricks: il prezzo fisso è diventato lo standard nel Regno Unito. |
| **Fiscozen** (`indiretti-fiscozen.jpg`) | Burocrazia resa semplice; volti dei professionisti; passi numerati («apertura partita IVA in 72 ore»). | Il nostro "documenti e conformità" è la stessa paura della burocrazia fiscale. |
| **Taxfix** (`indiretti-taxfix.jpg`) | In apertura l'esito concreto sul telefono: «hai diritto a un rimborso di 205,43 €». | Mostrare il risultato, non la promessa. |
| **Satispay** (`indiretti-satispay.jpg`) | Un colore, tono sicuro e breve («You don't need a bank.»). | Il coraggio del messaggio: noi possiamo dire che non serve un'agenzia. |
| **Uber** (`indiretti-uber.jpg`) | Il primo elemento è l'azione stessa (partenza/destinazione), non una frase. | Il modulo di quotazione deve stare in apertura, non in fondo. |

### Lezioni che applichiamo

1. **Azione in apertura** (Uber, Casavo): la quotazione si inizia dal primo schermo.
2. **Risultato visibile** (Airbnb, Taxfix): accanto al titolo mostriamo una scheda-esempio con stima, documenti e stato.
3. **Prezzo fisso e risparmio calcolato** (Purplebricks): confronto onesto con il 3% + IVA dell'agenzia.
4. **Processo a passi reali** (Fiscozen): i passi sono una vera sequenza, quindi qui la numerazione ha senso.
5. **Cosa è incluso, in chiaro** (Purplebricks): niente asterischi.
6. **Niente foto stock** di agenti o famiglie: tutti le usano e nessuno ci crede.

## 4. Idea di marca: «il fascicolo della casa»

Chi vende da solo non ha paura dell'annuncio: ha paura delle carte. Ediligo mette in ordine il **fascicolo** della casa — planimetria, APE, conformità, prezzo — e lo rende leggibile. Il linguaggio visivo nasce da lì:

- la **planimetria catastale** disegnata a linea, con quote e annotazioni, è l'immagine di marca;
- il **semaforo** del controllo documenti (verde / giallo / rosso) diventa sistema di stato in tutto il prodotto;
- i colori vengono da **Milano costruita**: il giallo Maria Teresa delle facciate neoclassiche, il verde delle persiane, il grigio del ceppo e dell'intonaco.

Tono di voce: diretto, concreto, dalla parte del proprietario. «Tu vendi, noi mettiamo in ordine.» Mai urlato, mai maiuscolo, nessun "miglior prezzo garantito".

## 5. Sistema visivo

### Colori

| Nome | Hex | Uso |
|---|---|---|
| Verde persiana | `#1D4A3A` | Colore principale: sezioni scure, titoli, logo |
| Inchiostro | `#17302A` | Testo |
| Giallo Maria Teresa | `#E6B54A` | Accento firma: bottone principale (con testo verde scuro), evidenze sulla planimetria |
| Intonaco | `#ECEAE4` | Sfondi alternati, linee leggere |
| Bianco | `#FFFFFF` | Sfondo principale |
| Rosso mattone | `#B5432F` | Solo stato "da sistemare" nel semaforo ed errori |

Stati del semaforo: **verde** = verde persiana chiaro `#3E7D5F`, **giallo** = giallo Maria Teresa, **rosso** = rosso mattone. Il colore non è mai l'unico segnale: c'è sempre anche l'etichetta testuale.

Contrasti calcolati (WCAG): inchiostro su bianco 14,1:1; verde persiana su giallo 5,3:1; bianco su verde persiana 10,0:1; rosso mattone su bianco 5,5:1. Tutti oltre la soglia AA (4,5:1) per il testo normale.

### Caratteri

- **Archivo** (Google Fonts, variabile su peso *e larghezza*). Una sola famiglia usata in due registri:
  - titoli in **Archivo Expanded** (larghezza 112–125, peso 700): ricorda le scritte delle tavole tecniche e delle insegne milanesi del dopoguerra;
  - testo in **Archivo normale** (larghezza 100, peso 400/500);
  - annotazioni della planimetria in **Archivo Condensed** (larghezza 75): le quote dei disegni tecnici.
- I concorrenti usano Inter, Roboto, Montserrat: Archivo ci distingue senza essere eccentrico.

Scala tipografica (rapporto 1,25, base 18 px): 14 · 18 · 22,5 · 28 · 35 · 44 · 55 · 69. Righe di testo sotto i 70 caratteri, interlinea 1,55 per il testo e 1,05 per i titoli.

### Logo

Simbolo: **l'arco di apertura della porta**, il segno con cui le planimetrie disegnano una porta (un segmento + un quarto di cerchio). Significa "apri la tua casa al mercato, con le chiavi in mano tua". Accanto la parola *ediligo* in Archivo Expanded minuscolo. Funziona in un colore solo e a 16 px.

### Impaginazione

- Allineamento a sinistra, griglia a 12 colonne, larghezza massima 1200 px.
- Apertura asimmetrica: a sinistra titolo e quotazione rapida, a destra la planimetria annotata (l'unico elemento "forte" della pagina).
- Il resto è sobrio: elenchi, tabelle e linee sottili al posto di card tutte uguali. Raggio degli angoli: 4 px sui campi, 999 px solo sui bottoni.
- Movimento: una sola animazione, il disegno della planimetria all'apertura (rispetta "riduci movimento").

```
┌──────────────────────────────────────────────────────────┐
│ ◜ ediligo        Come funziona  Prezzi  Quotazione  [Calcola] │
├───────────────────────────────┬──────────────────────────┤
│ Vendi casa da privato.        │   ┌──────────┬─────┐     │
│ Il fascicolo lo mettiamo      │   │  soggiorno│ cam │ 72 m²│
│ in ordine noi.                │   │     ◜    ├─────┤     │
│ [zona ▾] [m² ] [Calcola]      │   └──────────┴─────┘     │
│ Gratis · 2 minuti             │   stima 395–430 mila     │
│                               │   APE ● da fare          │
└───────────────────────────────┴──────────────────────────┘
  Cosa blocca chi vende da solo  (elenco a 4 righe + risposta)
  Come funziona                  (5 passi reali, numerati)
  Prezzi + calcolo risparmio     (tabella 3 colonne + cursore)
  Il network                     (ruoli, prezzo fisso)
  Domande                        (è un'agenzia? chi paga?)
  Contatto                       (modulo con consensi separati)
```

## 6. Verifica rispetto ai "default" da evitare

- Crema + serif + terracotta → **no**: sfondo bianco, sans espansa, giallo/verde milanesi.
- Card identiche con ombra → **no**: righe e tabelle, una sola superficie in evidenza (la planimetria).
- Etichette maiuscole sopra i titoli, frecce nei bottoni, monospace per i dati → **no**.
- Foto stock di persone → **no**: la "foto" è la planimetria.

## 7. Prossimi passi grafici

- Logo definitivo in vettoriale e favicon (bozza già nel codice).
- Set di icone a linea coerente con la planimetria (porta, finestra, quota, timbro).
- Template per pubblicità Meta "clicca per WhatsApp" e per il kit annuncio.
- Test della pagina con 5 utenti reali (venditori privati) prima della pubblicità.
