# Appendice A — Convenzioni di Naming

> Guida completa alle convenzioni di nomenclatura adottate nel sistema GiVi Beauty.
> Ogni componente del sistema segue regole specifiche per garantire coerenza e leggibilità.

---

## Sommario

1. [Tag Keap](#1-tag-keap)
2. [Custom Field Keap](#2-custom-field-keap)
3. [Slot Appuntamento](#3-slot-appuntamento)
4. [Cloudflare Workers](#4-cloudflare-workers)
5. [Script Airtable](#5-script-airtable)
6. [Tabelle Airtable](#6-tabelle-airtable)
7. [Route API](#7-route-api)
8. [Variabili d'Ambiente](#8-variabili-dambiente)
9. [Oggetti CONFIG nel Codice](#9-oggetti-config-nel-codice)
10. [Tabella Riassuntiva](#10-tabella-riassuntiva)

---

## 1. Tag Keap

I tag Keap seguono un sistema a prefissi che ne identifica la funzione. [Confermato da codice]

| Prefisso | Significato | Uso | Esempio |
|----------|-------------|-----|---------|
| `AT–` | Automation Trigger | Attiva un'automazione Keap quando applicato a un contatto | `AT–Apertura Scheda`, `AT–Rinvio` |
| `S–` | Status | Indica lo stato corrente del contatto nel ciclo di vita | `S–Attivo`, `S–Annullato` |
| `A–` | Action / Attribute | Descrive un'azione eseguita o un attributo del contatto | `A–NoShow`, `A–Referral` |
| `NMV–` | No Mas Vello (prodotti) | Identifica prodotti o trattamenti specifici NMV | `NMV–Epilazione`, `NMV–Viso` |

### Regole per i tag

- Il separatore dopo il prefisso è un trattino lungo (`–`), non un trattino breve (`-`). [Confermato da codice]
- Il testo dopo il prefisso usa Title Case con spazi. [Inferito da contesto]
- I tag `AT–` sono pensati per essere applicati tramite worker e rimossi dall'automazione stessa dopo l'esecuzione. [Inferito da contesto]
- I tag `S–` sono mutuamente esclusivi per gruppo logico (es. un contatto non dovrebbe avere sia `S–Attivo` sia `S–Annullato`). [Inferito da contesto]

---

## 2. Custom Field Keap

I custom field seguono la notazione **CamelCase senza spazi**. [Confermato da codice]

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| `cleanPhone` | Testo | Numero di telefono normalizzato (formato internazionale) |
| `NoShow` | Numero/Booleano | Conteggio o flag di mancata presentazione |
| `NextAppointmentDate` | Data | Data del prossimo appuntamento sincronizzato |
| `centro` | Testo | Centro di appartenenza del contatto (custom field ID 41) |

### Regole per i custom field

- **Nessuno spazio** nel nome del campo. [Confermato da codice]
- La prima lettera può essere minuscola (`cleanPhone`) o maiuscola (`NoShow`), purché il resto segua CamelCase. [Confermato da codice]
- Il campo `centro` è un'eccezione: tutto minuscolo. [Inferito da contesto]
- I custom field sono referenziati nel codice tramite ID numerico (es. `custom_fields[41]`), non per nome. [Confermato da codice]

---

## 3. Slot Appuntamento

Il sistema di slot usa il prefisso `A` seguito da un numero (1-5) e un nome descrittivo. [Confermato da codice]

| Slot | Nome Completo | Contenuto |
|------|---------------|-----------|
| `A1` | `A1Trattamenti` | Tipo di trattamento prenotato |
| `A2` | `A2Data` | Data dell'appuntamento |
| `A3` | `A3Ora` | Orario dell'appuntamento |
| `A4` | `A4Durata` | Durata prevista |
| `A5` | `A5Note` | Note aggiuntive |

### Regole per gli slot

- Il prefisso è sempre `A` + numero, senza separatore. [Confermato da codice]
- Il suffisso è in italiano, PascalCase. [Confermato da codice]
- Gli slot sono usati come nomi di campo sia in Airtable che in Keap. [Inferito da contesto]
- Il sistema supporta fino a 5 slot per appuntamento. [Confermato da codice]

---

## 4. Cloudflare Workers

I nomi dei worker seguono la notazione **kebab-case**. [Confermato da codice]

| Worker | Pattern |
|--------|---------|
| `apertura-scheda` | nome-azione |
| `keap-utility` | servizio-provider |
| `lead-handler` | entità-azione |
| `sendapp-monitor` | servizio-ruolo |
| `apt-monitor` | abbreviazione-ruolo |
| `applytags` | verbo (singola parola, eccezione) |
| `find-contact-id` | verbo-entità-attributo |
| `getcontactinfo` | verbo+entità (eccezione, senza trattini) |
| `linkforreferral` | sostantivo+preposizione+sostantivo (eccezione) |
| `prebooking` | sostantivo (singola parola) |
| `leadgen` | abbreviazione (singola parola) |

### Regole per i worker

- Formato preferito: **kebab-case** (parole separate da trattino). [Confermato da codice]
- Eccezioni storiche esistono (`applytags`, `getcontactinfo`, `linkforreferral`) dove il nome è una singola stringa senza separatori. [Confermato da codice]
- Il dominio di deploy è `*.notifichegielvi.workers.dev`. [Confermato da codice]
- L'URL completo è `https://{nome-worker}.notifichegielvi.workers.dev`. [Confermato da codice]

---

## 5. Script Airtable

Gli script Airtable usano **snake_case** con estensione `.js`. [Confermato da codice]

| Script | Pattern |
|--------|---------|
| `apertura_scheda.js` | azione_entità |
| `chiusura_scheda.js` | azione_entità |
| `rinvio_appuntamento.js` | azione_entità |
| `annullamento.js` | azione |
| `referral_check.js` | entità_azione |
| `sync_next_appointment.js` | azione_entità_attributo |

### Regole per gli script

- Tutte le parole in minuscolo. [Confermato da codice]
- Separatore: underscore (`_`). [Confermato da codice]
- Estensione: `.js`. [Confermato da codice]
- Il nome descrive l'operazione principale dello script. [Inferito da contesto]

---

## 6. Tabelle Airtable

Le tabelle Airtable usano **Title Case in italiano**. [Confermato da codice]

| Tabella | Descrizione |
|---------|-------------|
| `Clienti` | Anagrafica clienti |
| `Appuntamenti` | Storico e dettaglio appuntamenti |
| `Prebooking` | Appuntamenti in fase di prenotazione |
| `Lead` | Lead in ingresso da Facebook/altre fonti |
| `Referral` | Gestione programma referral |
| `Impostazioni` | Configurazione per base/centro |

### Regole per le tabelle

- Nomi in italiano. [Confermato da codice]
- Title Case (prima lettera maiuscola). [Confermato da codice]
- Singolare o plurale secondo convenzione italiana naturale. [Inferito da contesto]
- I nomi delle tabelle sono consistenti tra le 4 basi (una per centro). [Inferito da contesto]

---

## 7. Route API

Le route API usano **kebab-case** nei percorsi. [Confermato da codice]

| Esempio di Route | Pattern |
|------------------|---------|
| `/api/prebooking/sync-next-appointment` | /api/{dominio}/{verbo-entità} |
| `/api/contact/apply-tags` | /api/{entità}/{verbo-sostantivo} |
| `/webhook/facebook/lead` | /webhook/{sorgente}/{entità} |

### Regole per le route

- Le parole nel path sono separate da trattini (`-`). [Confermato da codice]
- I segmenti del path rappresentano gerarchie logiche (dominio → azione). [Inferito da contesto]
- I parametri dinamici usano la sintassi `:param` o sono passati nel body/query. [Da verificare]

---

## 8. Variabili d'Ambiente

Le variabili d'ambiente seguono **SCREAMING_SNAKE_CASE**. [Confermato da codice]

| Variabile | Esempio |
|-----------|---------|
| Chiavi API | `KEAP_API_KEY`, `AIRTABLE_API_KEY` |
| Credenziali OAuth | `KEAP_CLIENT_ID`, `KEAP_CLIENT_SECRET` |
| Token | `KEAP_ACCESS_TOKEN`, `PUSHOVER_TOKEN` |
| URL | `SENDAPP_URL` |
| Identificatori | `AUTH_BASE_ID`, `AUTH_RECORD_ID` |

### Regole per le variabili d'ambiente

- Tutte le lettere maiuscole. [Confermato da codice]
- Separatore: underscore (`_`). [Confermato da codice]
- Prefisso indicante il servizio: `KEAP_`, `AIRTABLE_`, `PUSHOVER_`, `SENDAPP_`. [Confermato da codice]
- Le variabili sensibili (secret) sono gestite tramite Cloudflare Secrets, non nel codice. [Inferito da contesto]

---

## 9. Oggetti CONFIG nel Codice

Gli oggetti di configurazione hardcoded usano **SCREAMING_SNAKE_CASE** per le chiavi. [Confermato da codice]

```javascript
// Esempio di struttura CONFIG
const CONFIG = {
  INFO_RECORD_ID: "recZqxq5Uji0ZTO5z",
  WORKER_URL: "https://apertura-scheda.notifichegielvi.workers.dev",
  TAG_ENDPOINT_BASE: "https://applytags.notifichegielvi.workers.dev",
  // ...
};
```

### Regole per le chiavi CONFIG

- Stesse regole delle variabili d'ambiente. [Confermato da codice]
- Le chiavi descrivono il contenuto: `_ID` per identificatori, `_URL` per URL, `_BASE` per URL base. [Confermato da codice]
- I valori possono essere stringhe, numeri o ID Airtable (formato `rec...`). [Confermato da codice]

---

## 10. Tabella Riassuntiva

| Contesto | Convenzione | Esempio | Stato |
|----------|-------------|---------|-------|
| Tag Keap | `PREFISSO–Nome Descrittivo` | `AT–Apertura Scheda` | [Confermato da codice] |
| Custom Field Keap | CamelCase | `cleanPhone` | [Confermato da codice] |
| Slot Appuntamento | `A{N}NomeDescrittivo` | `A2Data` | [Confermato da codice] |
| Worker Cloudflare | kebab-case | `apertura-scheda` | [Confermato da codice] |
| Script Airtable | snake_case.js | `apertura_scheda.js` | [Confermato da codice] |
| Tabelle Airtable | Title Case IT | `Appuntamenti` | [Confermato da codice] |
| Route API | /kebab-case/path | `/api/prebooking/sync-next-appointment` | [Confermato da codice] |
| Variabili Ambiente | SCREAMING_SNAKE_CASE | `KEAP_API_KEY` | [Confermato da codice] |
| Chiavi CONFIG | SCREAMING_SNAKE_CASE | `INFO_RECORD_ID` | [Confermato da codice] |

---

> **Nota**: Le eccezioni storiche nei nomi dei worker (`applytags`, `getcontactinfo`, `linkforreferral`) sono mantenute per retrocompatibilità. Nuovi worker dovrebbero seguire rigorosamente il formato kebab-case. [Inferito da contesto]
