# Appendice C — Catalogo Endpoint

> Catalogo completo di tutti gli endpoint esposti dai worker Cloudflare e di tutte le API esterne
> chiamate dal sistema GiVi Beauty.

---

## Sommario

1. [Endpoint Interni (Workers)](#1-endpoint-interni-workers)
2. [API Esterne Chiamate](#2-api-esterne-chiamate)
3. [Mappa Chiamante-Destinazione](#3-mappa-chiamante-destinazione)
4. [Autenticazione per Endpoint](#4-autenticazione-per-endpoint)

---

## 1. Endpoint Interni (Workers)

Tutti i worker sono ospitati su `*.notifichegielvi.workers.dev`. [Confermato da codice]

### apertura-scheda

| Metodo | Path | Descrizione | Chiamato da | Stato |
|--------|------|-------------|-------------|-------|
| `POST` | `/` | Avvia il flusso di apertura scheda prebooking | Script Airtable `apertura_scheda.js` | [Confermato da codice] |
| `POST` | `/chiusura` | Gestisce la chiusura della scheda | Script Airtable `chiusura_scheda.js` | [Inferito da contesto] |
| `POST` | `/rinvio` | Gestisce il rinvio di un appuntamento | Script Airtable `rinvio_appuntamento.js` | [Inferito da contesto] |
| `POST` | `/annulla` | Gestisce l'annullamento di un appuntamento | Script Airtable `annullamento.js` | [Inferito da contesto] |

### keap-utility

| Metodo | Path | Descrizione | Chiamato da | Stato |
|--------|------|-------------|-------------|-------|
| `POST` | `/contacts` | Crea o aggiorna un contatto Keap | Service binding (worker interni) | [Inferito da contesto] |
| `GET` | `/contacts/:id` | Recupera informazioni contatto | Service binding (worker interni) | [Inferito da contesto] |
| `POST` | `/tags` | Applica tag a un contatto | Service binding (worker interni) | [Inferito da contesto] |

> **Nota**: `keap-utility` è accessibile solo tramite service binding, non tramite URL pubblico. [Confermato da codice]

### lead-handler

| Metodo | Path | Descrizione | Chiamato da | Stato |
|--------|------|-------------|-------------|-------|
| `GET` | `/webhook/facebook` | Verifica webhook Facebook (challenge) | Facebook Platform | [Confermato da codice] |
| `POST` | `/webhook/facebook` | Riceve notifiche lead da Facebook | Facebook Platform | [Confermato da codice] |

### sendapp-monitor

| Metodo | Path | Descrizione | Chiamato da | Stato |
|--------|------|-------------|-------------|-------|
| `POST` | `/` | Riceve e logga stato messaggi WhatsApp | SendApp webhook | [Inferito da contesto] |
| `GET` | `/status` | Verifica stato connessione istanza | Monitoraggio interno | [Da verificare] |

### apt-monitor

| Metodo | Path | Descrizione | Chiamato da | Stato |
|--------|------|-------------|-------------|-------|
| `POST` | `/` | Riceve evento di rinvio/annullamento e logga | Keap Automation / Cron trigger | [Inferito da contesto] |
| `GET` | `/summary` | Genera riepilogo giornaliero Pushover | Cron trigger | [Da verificare] |

### applytags

| Metodo | Path | Descrizione | Chiamato da | Stato |
|--------|------|-------------|-------------|-------|
| `POST` | `/` | Applica uno o più tag a un contatto Keap | Script Airtable referral, `linkforreferral` (via binding) | [Confermato da codice] |

### find-contact-id

| Metodo | Path | Descrizione | Chiamato da | Stato |
|--------|------|-------------|-------------|-------|
| `GET` | `/` | Cerca un contatto Keap per email o telefono | Worker interni, script Airtable | [Da verificare] |

### getcontactinfo

| Metodo | Path | Descrizione | Chiamato da | Stato |
|--------|------|-------------|-------------|-------|
| `GET` | `/` | Restituisce informazioni dettagliate di un contatto | Worker interni, script Airtable | [Da verificare] |

### linkforreferral

| Metodo | Path | Descrizione | Chiamato da | Stato |
|--------|------|-------------|-------------|-------|
| `POST` | `/` | Genera link referral e applica tag tramite binding ad `applytags` | Script Airtable referral | [Confermato da codice] |

### prebooking

| Metodo | Path | Descrizione | Chiamato da | Stato |
|--------|------|-------------|-------------|-------|
| `POST` | `/api/prebooking/sync-next-appointment` | Sincronizza il prossimo appuntamento dal calendario a Keap | Script Airtable `sync_next_appointment.js` | [Confermato da codice] |

### leadgen

| Metodo | Path | Descrizione | Chiamato da | Stato |
|--------|------|-------------|-------------|-------|
| `POST` | `/` | Riceve dati lead e li inserisce in Airtable + notifica | Webhook esterni | [Inferito da contesto] |

---

## 2. API Esterne Chiamate

### Keap CRM

| Protocollo | URL Base | Versione | Usato per | Stato |
|------------|----------|----------|-----------|-------|
| REST v1 | `https://api.infusionsoft.com/crm/rest/v1/` | v1 | Contatti, tag, custom fields | [Confermato da codice] |
| REST v2 | `https://api.infusionsoft.com/crm/rest/v2/` | v2 | Funzionalità più recenti | [Confermato da codice] |
| XML-RPC | `https://api.infusionsoft.com/crm/xmlrpc/v1` | v1 | Operazioni legacy (DataService, etc.) | [Confermato da codice] |
| OAuth | `https://accounts.infusionsoft.com/app/oauth/token` | — | Refresh token OAuth2 | [Confermato da codice] |

#### Endpoint Keap REST v1 utilizzati

| Endpoint | Metodo | Descrizione | Stato |
|----------|--------|-------------|-------|
| `/contacts` | `GET` | Ricerca contatti con filtri | [Confermato da codice] |
| `/contacts` | `POST` | Creazione nuovo contatto | [Confermato da codice] |
| `/contacts/:id` | `PATCH` | Aggiornamento contatto esistente | [Confermato da codice] |
| `/contacts/:id/tags` | `POST` | Applicazione tag a contatto | [Confermato da codice] |
| `/contacts/:id/tags/:tagId` | `DELETE` | Rimozione tag da contatto | [Inferito da contesto] |

### SendApp

| URL Base | Descrizione | Stato |
|----------|-------------|-------|
| Configurato tramite `SENDAPP_URL` env var | URL dell'istanza SendApp per invio messaggi WhatsApp | [Da verificare] |

> **Nota**: L'URL di SendApp non è hardcoded — proviene dalla variabile d'ambiente `SENDAPP_URL`. Ogni centro potrebbe avere un'istanza SendApp distinta con URL diverso. [Inferito da contesto]

### Pushover

| URL | Metodo | Descrizione | Stato |
|-----|--------|-------------|-------|
| `https://api.pushover.net/1/messages.json` | `POST` | Invio notifiche push al dispositivo configurato | [Confermato da codice] |

#### Parametri Pushover tipici

| Parametro | Valore | Stato |
|-----------|--------|-------|
| `token` | Da `PUSHOVER_TOKEN` | [Confermato da codice] |
| `user` | Da `PUSHOVER_USER` | [Confermato da codice] |
| `device` | Da `PUSHOVER_DEVICE` (solo `apt-monitor`) | [Confermato da codice] |
| `title` | Da `PUSHOVER_TITLE` o hardcoded | [Confermato da codice] |
| `message` | Contenuto dinamico | [Confermato da codice] |

### Facebook Graph API

| URL Base | Versione | Descrizione | Stato |
|----------|----------|-------------|-------|
| `https://graph.facebook.com/v18.0/` | v18.0 | Recupero dati lead form da Facebook | [Da verificare — versione potrebbe essere cambiata] |

#### Endpoint Facebook utilizzati

| Endpoint | Metodo | Descrizione | Stato |
|----------|--------|-------------|-------|
| `/{leadgen_id}` | `GET` | Recupera dati di un lead specifico | [Confermato da codice] |
| `/{page_id}/subscribed_apps` | `POST` | Sottoscrizione webhook per la pagina | [Da verificare] |

### Airtable API

| URL Base | Descrizione | Stato |
|----------|-------------|-------|
| `https://api.airtable.com/v0/` | API REST per lettura/scrittura record | [Confermato da codice] |

#### Pattern di chiamata Airtable

| Endpoint | Metodo | Descrizione | Stato |
|----------|--------|-------------|-------|
| `/{baseId}/{tableName}` | `GET` | Lettura record con filtri | [Confermato da codice] |
| `/{baseId}/{tableName}` | `POST` | Creazione nuovi record | [Confermato da codice] |
| `/{baseId}/{tableName}/{recordId}` | `PATCH` | Aggiornamento record esistente | [Confermato da codice] |

---

## 3. Mappa Chiamante-Destinazione

### Da Script Airtable a Worker

| Script Airtable | Worker Chiamato | Endpoint | Stato |
|-----------------|----------------|----------|-------|
| `apertura_scheda.js` | `apertura-scheda` | `POST /` | [Confermato da codice] |
| `chiusura_scheda.js` | `apertura-scheda` | `POST /chiusura` | [Inferito da contesto] |
| `rinvio_appuntamento.js` | `apertura-scheda` | `POST /rinvio` | [Inferito da contesto] |
| `annullamento.js` | `apertura-scheda` | `POST /annulla` | [Inferito da contesto] |
| `sync_next_appointment.js` | `prebooking` | `POST /api/prebooking/sync-next-appointment` | [Confermato da codice] |
| Script referral | `applytags` | `POST /` | [Confermato da codice] |
| Script referral | `linkforreferral` | `POST /` | [Confermato da codice] |

### Da Worker a API Esterna

| Worker | API Esterna | Scopo | Stato |
|--------|------------|-------|-------|
| `apertura-scheda` | Keap REST v1/v2 | CRUD contatti, tag | [Confermato da codice] |
| `apertura-scheda` | Keap OAuth | Refresh token | [Confermato da codice] |
| `apertura-scheda` | Airtable API | Lettura configurazione | [Confermato da codice] |
| `apertura-scheda` | Pushover | Notifiche errori/conferme | [Confermato da codice] |
| `keap-utility` | Keap REST v1 | Proxy operazioni Keap | [Confermato da codice] |
| `lead-handler` | Facebook Graph API | Recupero dati lead | [Confermato da codice] |
| `lead-handler` | Airtable API | Inserimento lead | [Confermato da codice] |
| `sendapp-monitor` | SendApp | Monitoraggio messaggi | [Confermato da codice] |
| `applytags` | Keap REST v1 | Applicazione tag | [Confermato da codice] |
| `leadgen` | Airtable API | Inserimento lead | [Confermato da codice] |
| `leadgen` | Pushover | Notifiche nuovo lead | [Confermato da codice] |
| `leadgen` | SendApp | Invio messaggio WhatsApp | [Confermato da codice] |
| `apt-monitor` | Pushover | Riepilogo giornaliero | [Confermato da codice] |
| `prebooking` | Pushover | Notifiche errori | [Confermato da codice] |

### Da Keap Automation a Worker

| Automazione Keap | Worker Target | Descrizione | Stato |
|------------------|--------------|-------------|-------|
| Trigger su tag `AT–` | `apertura-scheda` | HTTP POST per operazioni scheda | [Inferito da contesto] |
| Monitoraggio appuntamenti | `apt-monitor` | Notifica rinvio/annullamento | [Inferito da contesto] |

---

## 4. Autenticazione per Endpoint

### Endpoint Interni (Worker)

| Worker | Tipo Autenticazione | Dettaglio | Stato |
|--------|---------------------|-----------|-------|
| `lead-handler` | Firma HMAC | Verifica `X-Hub-Signature-256` di Facebook | [Confermato da codice] |
| `lead-handler` | Verify Token | Challenge di verifica webhook | [Confermato da codice] |
| Altri worker | Nessuna / URL segreto | Sicurezza basata sull'oscurità dell'URL | [Da verificare] |

### API Esterne

| API | Tipo Autenticazione | Header/Parametro | Stato |
|-----|---------------------|------------------|-------|
| Keap REST | Bearer Token | `Authorization: Bearer {access_token}` | [Confermato da codice] |
| Keap REST (PAK) | API Key | `X-Keap-API-Key: {pak}` | [Confermato da codice] |
| Keap XML-RPC | API Key nel body | Incluso nel payload XML | [Confermato da codice] |
| Airtable | Bearer Token | `Authorization: Bearer {api_token}` | [Confermato da codice] |
| Pushover | Token nel body | Parametri `token` e `user` nel POST | [Confermato da codice] |
| Facebook Graph | Access Token | Query param `access_token` | [Confermato da codice] |
| SendApp | API Key | Modalità specifica SendApp | [Da verificare] |

---

> **Nota sulla sicurezza**: La maggior parte dei worker esposti pubblicamente non implementa autenticazione oltre alla segretezza dell'URL. Questo rappresenta un rischio documentato in [06-rischi-debito-tecnico.md](../06-rischi-debito-tecnico.md). [Inferito da contesto]
