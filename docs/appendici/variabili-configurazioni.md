# Appendice B — Catalogo Variabili e Configurazioni

> Catalogo completo di tutte le variabili d'ambiente, binding, namespace KV/D1 e oggetti CONFIG
> utilizzati dai componenti del sistema GiVi Beauty.

---

## Sommario

1. [Panoramica per Worker](#1-panoramica-per-worker)
2. [Dettaglio: apertura-scheda](#2-dettaglio-apertura-scheda)
3. [Dettaglio: keap-utility](#3-dettaglio-keap-utility)
4. [Dettaglio: lead-handler](#4-dettaglio-lead-handler)
5. [Dettaglio: sendapp-monitor](#5-dettaglio-sendapp-monitor)
6. [Dettaglio: apt-monitor](#6-dettaglio-apt-monitor)
7. [Dettaglio: applytags](#7-dettaglio-applytags)
8. [Dettaglio: find-contact-id](#8-dettaglio-find-contact-id)
9. [Dettaglio: getcontactinfo](#9-dettaglio-getcontactinfo)
10. [Dettaglio: linkforreferral](#10-dettaglio-linkforreferral)
11. [Dettaglio: leadgen](#11-dettaglio-leadgen)
12. [Dettaglio: prebooking](#12-dettaglio-prebooking)
13. [Oggetti CONFIG negli Script Airtable](#13-oggetti-config-negli-script-airtable)
14. [Mappa delle Dipendenze tra Variabili](#14-mappa-delle-dipendenze-tra-variabili)

---

## 1. Panoramica per Worker

| Worker | Secrets | KV Namespace | D1 Database | Service Binding | Totale |
|--------|---------|-------------|-------------|-----------------|--------|
| `apertura-scheda` | 5 | 2 | — | — | 7 |
| `keap-utility` | 1 | — | — | — | 1 |
| `lead-handler` | 5 | — | — | 1 | 6 |
| `sendapp-monitor` | 2 | — | 1 | — | 3 |
| `apt-monitor` | 4 | — | 1 | 1 | 6 |
| `applytags` | 1 | — | — | — | 1 |
| `find-contact-id` | 1 | — | — | — | 1 |
| `getcontactinfo` | 1 | — | — | — | 1 |
| `linkforreferral` | — | — | — | 1 | 1 |
| `leadgen` | 5 | — | — | — | 5 |
| `prebooking` | 2 | — | — | 1 | 3 |

---

## 2. Dettaglio: apertura-scheda

### Namespace KV

| Nome Binding | Scopo | Stato |
|-------------|-------|-------|
| `KEAP_TOKENS` | Memorizza access/refresh token OAuth Keap con auto-refresh | [Confermato da codice] |
| `LOGS_KV` | Logging operazioni con TTL 30 giorni | [Confermato da codice] |

### Secrets e Variabili

| Variabile | Tipo | Servizio | Descrizione | Stato |
|-----------|------|----------|-------------|-------|
| `KEAP_PAK` | Secret | Keap | Personal Access Key per autenticazione alternativa | [Confermato da codice] |
| `KEAP_CLIENT_ID` | Secret | Keap | Client ID per OAuth2 flow | [Confermato da codice] |
| `KEAP_CLIENT_SECRET` | Secret | Keap | Client Secret per OAuth2 flow | [Confermato da codice] |
| `PUSHOVER_TOKEN` | Secret | Pushover | Token applicazione per notifiche push | [Confermato da codice] |
| `PUSHOVER_USER` | Secret | Pushover | User key destinatario notifiche | [Confermato da codice] |
| `AUTH_BASE_ID` | Secret | Airtable | ID della base Airtable usata per autenticazione/config | [Confermato da codice] |
| `AUTH_RECORD_ID` | Secret | Airtable | ID del record contenente token di autenticazione | [Confermato da codice] |
| `AIRTABLE_API_TOKEN` | Secret | Airtable | Token API per accesso Airtable | [Confermato da codice] |

---

## 3. Dettaglio: keap-utility

| Variabile | Tipo | Servizio | Descrizione | Stato |
|-----------|------|----------|-------------|-------|
| `KEAP_ACCESS_TOKEN` | Secret | Keap | Token di accesso per API REST Keap | [Confermato da codice] |

> **Nota**: `keap-utility` è un worker di servizio esposto come service binding ad altri worker. Centralizza le chiamate a Keap per evitare duplicazione di token. [Confermato da codice]

---

## 4. Dettaglio: lead-handler

### Secrets e Variabili

| Variabile | Tipo | Servizio | Descrizione | Stato |
|-----------|------|----------|-------------|-------|
| `VERIFY_TOKEN` | Secret | Facebook | Token di verifica per webhook Facebook | [Confermato da codice] |
| `APP_SECRET` | Secret | Facebook | App Secret per validazione firma richieste | [Confermato da codice] |
| `PAGE_TOKENS_JSON` | Secret | Facebook | JSON con token di pagina per ogni pagina Facebook gestita | [Confermato da codice] |
| `GRAPH_TOKEN` | Secret | Facebook | Token per chiamate Graph API | [Confermato da codice] |
| `AIRTABLE_API_KEY` | Secret | Airtable | Chiave API per creazione record lead | [Confermato da codice] |

### Service Binding

| Binding | Worker Target | Scopo | Stato |
|---------|--------------|-------|-------|
| `KEAP_UTILITY` | `keap-utility` | Creazione/aggiornamento contatti in Keap | [Confermato da codice] |

---

## 5. Dettaglio: sendapp-monitor

| Variabile | Tipo | Servizio | Descrizione | Stato |
|-----------|------|----------|-------------|-------|
| `SENDAPP_URL` | Secret | SendApp | URL base dell'istanza SendApp | [Confermato da codice] |
| `RECONNECT_BASE` | Secret | SendApp | URL base per riconnessione istanza | [Confermato da codice] |

### D1 Database

| Binding | Scopo | Stato |
|---------|-------|-------|
| `DB` | Logging messaggi WhatsApp: stato, retry, timestamp | [Confermato da codice] |

---

## 6. Dettaglio: apt-monitor

### Secrets e Variabili

| Variabile | Tipo | Servizio | Descrizione | Stato |
|-----------|------|----------|-------------|-------|
| `PUSHOVER_TOKEN` | Secret | Pushover | Token applicazione per notifiche | [Confermato da codice] |
| `PUSHOVER_USER` | Secret | Pushover | User key destinatario | [Confermato da codice] |
| `PUSHOVER_DEVICE` | Secret | Pushover | Device target per la notifica | [Confermato da codice] |
| `PUSHOVER_TITLE` | Secret | Pushover | Titolo predefinito per le notifiche | [Confermato da codice] |

### D1 Database

| Binding | Scopo | Stato |
|---------|-------|-------|
| `DB` | Logging eventi rinvio/annullamento, riepilogo giornaliero | [Confermato da codice] |

### Service Binding

| Binding | Worker Target | Scopo | Stato |
|---------|--------------|-------|-------|
| `KEAP_UTILITY` | `keap-utility` | Lettura dati appuntamento da Keap | [Confermato da codice] |

---

## 7. Dettaglio: applytags

| Variabile | Tipo | Servizio | Descrizione | Stato |
|-----------|------|----------|-------------|-------|
| `KEAP_API_KEY` | Secret | Keap | Chiave API per applicazione tag | [Confermato da codice] |

---

## 8. Dettaglio: find-contact-id

| Variabile | Tipo | Servizio | Descrizione | Stato |
|-----------|------|----------|-------------|-------|
| `KEAP_API_KEY` | Secret | Keap | Chiave API per ricerca contatti | [Da verificare] |

---

## 9. Dettaglio: getcontactinfo

| Variabile | Tipo | Servizio | Descrizione | Stato |
|-----------|------|----------|-------------|-------|
| `KEAP_API_KEY` | Secret | Keap | Chiave API per lettura info contatto | [Da verificare] |

---

## 10. Dettaglio: linkforreferral

| Variabile | Tipo | Servizio | Descrizione | Stato |
|-----------|------|----------|-------------|-------|
| — | — | — | Nessuna variabile d'ambiente propria | — |

### Service Binding

| Binding | Worker Target | Scopo | Stato |
|---------|--------------|-------|-------|
| `APPLY_TAGS` | `applytags` | Applicazione tag referral ai contatti | [Confermato da codice] |

---

## 11. Dettaglio: leadgen

| Variabile | Tipo | Servizio | Descrizione | Stato |
|-----------|------|----------|-------------|-------|
| `AIRTABLE_API_KEY` | Secret | Airtable | Chiave API per accesso base Airtable | [Confermato da codice] |
| `AIRTABLE_BASE_ID` | Secret | Airtable | ID della base Airtable target | [Confermato da codice] |
| `AIRTABLE_TABLE_NAME` | Secret | Airtable | Nome della tabella per inserimento lead | [Confermato da codice] |
| `PUSHOVER_TOKEN` | Secret | Pushover | Token applicazione per notifiche | [Confermato da codice] |
| `PUSHOVER_USER` | Secret | Pushover | User key destinatario | [Confermato da codice] |
| `SENDAPP_API_KEY` | Secret | SendApp | Chiave API per invio messaggi WhatsApp | [Confermato da codice] |

---

## 12. Dettaglio: prebooking

### Secrets e Variabili

| Variabile | Tipo | Servizio | Descrizione | Stato |
|-----------|------|----------|-------------|-------|
| `PUSHOVER_TOKEN` | Secret | Pushover | Token applicazione per notifiche | [Confermato da codice] |
| `PUSHOVER_USER` | Secret | Pushover | User key destinatario | [Confermato da codice] |

### Service Binding

| Binding | Worker Target | Scopo | Stato |
|---------|--------------|-------|-------|
| `KEAP_UTILITY` | `keap-utility` | Lettura/scrittura dati prebooking in Keap | [Confermato da codice] |

---

## 13. Oggetti CONFIG negli Script Airtable

### apertura_scheda CONFIG

| Chiave | Valore | Descrizione | Stato |
|--------|--------|-------------|-------|
| `INFO_RECORD_ID` | `"recZqxq5Uji0ZTO5z"` | ID del record contenente info di configurazione | [Confermato da codice] |
| `WORKER_URL` | URL del worker `apertura-scheda` | Endpoint chiamato dallo script per avviare il flusso | [Confermato da codice] |

### chiusura_scheda CONFIG

| Chiave | Tipo Valore | Descrizione | Stato |
|--------|-------------|-------------|-------|
| Field IDs per tabella `Appuntamenti` | Stringhe `fld...` | Mapping dei campi da leggere/aggiornare | [Confermato da codice] |
| Field IDs per tabella `Clienti` | Stringhe `fld...` | Mapping dei campi cliente da aggiornare | [Confermato da codice] |
| Field IDs per tabella `Prebooking` | Stringhe `fld...` | Mapping dei campi prebooking | [Confermato da codice] |

> **Nota**: I field ID Airtable (formato `fld...`) sono specifici per ciascuna base. Se le basi dei centri hanno strutture identiche, i field ID dovrebbero corrispondere, ma questo va verificato. [Da verificare]

### Script Referral CONFIG

| Chiave | Descrizione | Stato |
|--------|-------------|-------|
| `TAG_ENDPOINT_BASE` | URL base del worker `applytags` (es. `https://applytags.notifichegielvi.workers.dev`) | [Confermato da codice] |
| Tag IDs specifici | ID numerici dei tag Keap da applicare per ciascun evento referral | [Confermato da codice] |

---

## 14. Mappa delle Dipendenze tra Variabili

### Servizi e quanti worker li usano

| Servizio Esterno | Variabili Correlate | Worker che le Usano |
|------------------|--------------------|--------------------|
| Keap OAuth | `KEAP_CLIENT_ID`, `KEAP_CLIENT_SECRET`, `KEAP_PAK` | `apertura-scheda` |
| Keap REST (diretto) | `KEAP_API_KEY` | `applytags`, `find-contact-id`, `getcontactinfo` |
| Keap REST (via binding) | `KEAP_ACCESS_TOKEN` (in `keap-utility`) | `lead-handler`, `apt-monitor`, `prebooking` (via service binding) |
| Pushover | `PUSHOVER_TOKEN`, `PUSHOVER_USER` | `apertura-scheda`, `apt-monitor`, `leadgen`, `prebooking` |
| Airtable | `AIRTABLE_API_KEY` / `AIRTABLE_API_TOKEN` | `apertura-scheda`, `lead-handler`, `leadgen` |
| Facebook | `VERIFY_TOKEN`, `APP_SECRET`, `PAGE_TOKENS_JSON`, `GRAPH_TOKEN` | `lead-handler` |
| SendApp | `SENDAPP_URL`, `SENDAPP_API_KEY` | `sendapp-monitor`, `leadgen` |

### Service Binding Graph

```
keap-utility  ←── lead-handler
              ←── apt-monitor
              ←── prebooking

applytags     ←── linkforreferral
```

[Confermato da codice]

---

> **Attenzione**: Tutte le variabili marcate come `Secret` devono essere configurate tramite `wrangler secret put` e NON inserite nel file `wrangler.toml` in chiaro. [Inferito da contesto]
