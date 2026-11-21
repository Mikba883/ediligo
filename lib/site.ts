// Configurazione centrale: prezzi dei pacchetti, contatti, testi ripetuti.
// I prezzi sono ipotesi da validare con i primi clienti (vedi piano MVP).

export const site = {
  name: "Ediligo",
  city: "Milano",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
};

export type Package = {
  id: "gratis" | "base" | "completo";
  name: string;
  price: number; // euro, IVA inclusa
  summary: string;
  includes: string[];
  cta: string;
};

export const packages: Package[] = [
  {
    id: "gratis",
    name: "Quotazione",
    price: 0,
    summary: "Per capire quanto vale la casa e se i documenti sono in ordine.",
    includes: [
      "Stima del valore con i dati OMI della tua zona",
      "Controllo documenti con AI: verde, giallo o rosso",
      "Lista di cosa ti manca per il rogito",
    ],
    cta: "Calcola il valore",
  },
  {
    id: "base",
    name: "Annuncio",
    price: 290,
    summary: "Per pubblicare un annuncio che si fa notare, dal tuo account.",
    includes: [
      "Tutto quello della quotazione",
      "Annuncio scritto per Immobiliare.it, Idealista e Casa.it",
      "Foto migliorate e arredamento virtuale, dichiarato",
      "APE con un certificatore del network",
      "Pubblicazione guidata dal tuo account privato",
    ],
    cta: "Scegli Annuncio",
  },
  {
    id: "completo",
    name: "Completo",
    price: 990,
    summary: "Per arrivare alle visite con il fascicolo già verificato.",
    includes: [
      "Tutto quello del pacchetto Annuncio",
      "Verifica di conformità urbanistica e catastale di un geometra",
      "Accesso agli atti in Comune e relazione scritta",
      "Un referente Ediligo fino alla proposta d'acquisto",
    ],
    cta: "Scegli Completo",
  },
];

// Acconto rimborsabile per prenotare un pacchetto (test di disponibilità a pagare).
export const depositEuro = 39;

// Provvigione tipica di un'agenzia a carico del venditore a Milano.
export const agencyRate = 0.03;
export const vatRate = 0.22;

export const euro = (n: number) =>
  new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
    // In italiano i numeri a 4 cifre non vengono raggruppati di default: li raggruppiamo sempre per coerenza.
    useGrouping: "always" as unknown as boolean,
  }).format(n);

export function whatsappHref(text: string) {
  if (!site.whatsappNumber) return null;
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(text)}`;
}
