# Relazioni Keap — Airtable — Cloudflare

> Ultima revisione: 2026-03-27
>
> Questo documento descrive in modo dettagliato come i tre sistemi (Keap CRM, Airtable e Cloudflare Workers) si relazionano tra loro: quali componenti comunicano con quali, in quale direzione, attraverso quale protocollo e con quali dati.

---

## 1. Schema generale delle relazioni

```mermaid
graph TD
    subgraph AIRTABLE["Airtable (4 basi — una per centro)"]
        direction TB
        AS1["apertura_scheda.js"]
        AS2["chiusura_scheda.js"]
        AS3["rinvio_appuntamento.js"]
        AS4["annulla_appuntamento.js"]
        AS5["puntuale_e_premiata.js"]
        AS6["referral_riscattato.js"]
        AS7["pacco_consegnato.js"]
        AS8["conferma_recensione.js"]
    end

    subgraph CF["Cloudflare Workers"]
        direction TB
        APSC["apertura-scheda"]
        AT["applytags"]
        KU["keap-utility"]
        FC["find-contact-id"]
        GC["getcontactinfo"]
        LR["linkforreferral"]
        LH["lead-handler / leadgen"]
        SM["sendapp-monitor"]
        AM["apt-monitor"]
        PB["prebooking (LEGACY)"]
    end

    subgraph KEAP["Keap CRM"]
        direction TB
        KC["Contatti"]
        KT["Tag"]
        KA["Automazioni"]
        KAP["Appuntamenti (ContactAction)"]
    end

    subgraph EXT["Servizi Esterni"]
        SA["SendApp (WhatsApp)"]
        FB["Facebook Graph API"]
        PO["Pushover"]
    end

    AS1 -->|remoteFetchAsync HTTP| APSC
    AS2 -->|remoteFetchAsync HTTP| APSC
    AS3 -->|remoteFetchAsync HTTP| APSC
    AS4 -->|remoteFetchAsync HTTP| APSC
    AS5 -->|remoteFetchAsync HTTP| AT
    AS6 -->|remoteFetchAsync HTTP| AT
    AS7 -->|remoteFetchAsync HTTP| AT
    AS8 -->|remoteFetchAsync HTTP| AT

    APSC -->|REST v1 PATCH /contacts| KC
    APSC -->|REST v1 POST /tags| KT
    APSC -->|XML-RPC DataService.update| KAP
    APSC -->|Service Binding| KU
    AT -->|REST v1 POST /tags| KT
    KU -->|REST v1 GET/PATCH /contacts| KC
    KU -->|REST v1 POST/DELETE /tags| KT
    FC -->|REST v1 GET /contacts| KC
    GC -->|REST v1+v2 GET /contacts| KC
    LR -->|Service Binding| AT
    LH -->|Service Binding| KU
    LH -->|REST: Airtable API| AIRTABLE
    AM -->|Service Binding| KU
    PB -->|Service Binding| KU

    KA -->|HTTP Request (WhatsApp)| SM
    KA -->|Trigger su tag| KT
    KT -->|Tag Applied trigger| KA

    SM -->|API| SA
    LH -->|API| SA
    APSC -->|API| SA
    LH -->|API| PO
    AM -->|API| PO
    LH -->|Webhook| FB
```

---

## 2. Relazioni Airtable → Cloudflare Workers

Tutti gli script Airtable comunicano con i worker tramite `remoteFetchAsync` (funzione nativa Airtable per chiamate HTTP esterne). Non esistono chiamate dirette da Airtable verso Keap o SendApp. [Confermato da codice]

| Script Airtable | Worker chiamato | Endpoint | Dati inviati |
|-----------------|-----------------|----------|--------------|
| `apertura_scheda.js` | `apertura-scheda` | `/action` con `action: "apriScheda"` | keapID, datiAppuntamento, centro, tipo servizio |
| `chiusura_scheda.js` | `apertura-scheda` | `/action` con `action: "chiudiScheda"` | keapID, appID, slotInfo, presente (YES/NO) |
| `rinvio_appuntamento.js` | `apertura-scheda` | `/action` con `action: "rinviaAppuntamento"` | keapID, appID, nuovaData, noMsg flag |
| `annulla_appuntamento.js` | `apertura-scheda` | `/action` con `action: "annullaAppuntamento"` | keapID, appID, slotInfo |
| `puntuale_e_premiata.js` | `applytags` | `/apply` | keapID, tagIDs: [387] |
| `referral_riscattato.js` | `applytags` | `/apply` | keapID referrer (tag 355), keapID cliente (tag 337) |
| `pacco_consegnato.js` | `applytags` | `/apply` | keapID, tagIDs: [357] |
| `conferma_recensione.js` | `applytags` | `/apply` | keapID, tagIDs: [155] |

[Confermato da codice]

---

## 3. Relazioni Cloudflare Workers → Keap

### 3.1 Operazioni su Contatti (REST API v1)

| Worker | Operazione | Endpoint | Campi / Dati |
|--------|-----------|----------|--------------|
| `apertura-scheda` | Lettura contatto | `GET /contacts/{id}` | Custom fields appuntamento, IstanceIDSendapp, Centro |
| `apertura-scheda` | Aggiornamento contatto | `PATCH /contacts/{id}` | Custom fields A1-A5, cleanPhone, IstanceIDSendapp, Centro, Rinvii |
| `apertura-scheda` | Creazione contatto | `POST /contacts` | Nome, telefono, Centro, IstanceIDSendapp, cleanPhone |
| `keap-utility` | Lettura contatto | `GET /contacts/{id}` | Tutti i campi richiesti |
| `keap-utility` | Aggiornamento contatto | `PATCH /contacts/{id}` | Campi passati dal caller |
| `getcontactinfo` | Lettura contatto v1+v2 | `GET /contacts` + v2 con optional_properties | Custom fields, email, telefono |
| `find-contact-id` | Ricerca contatto | `GET /contacts?email=` o `?phone=` | Ricerca per email o telefono |
| `leadgen` | Creazione/aggiornamento contatto | tramite `keap-utility` | Centro, cleanPhone, IstanceIDSendapp, tag 361 |

[Confermato da codice]

### 3.2 Operazioni su Tag (REST API v1)

| Worker | Operazione | Tag coinvolti |
|--------|-----------|---------------|
| `apertura-scheda` | Applica tag appuntamento | 285-289 (A1-A3), 365, 375 (A4-A5) |
| `apertura-scheda` | Applica tag tipo servizio | 307-317 (Fusion/ProSkin A1-A3), 367-379 (A4-A5) |
| `apertura-scheda` | Applica tag annullamento | 291-295 (A1-A3), 371, 383 (A4-A5) |
| `apertura-scheda` | Applica tag rinvio | 299-303 (A1-A3), 373, 381 (A4-A5) |
| `apertura-scheda` | Applica tag rinvio silenzioso | 359 |
| `apertura-scheda` | Applica tag recensione | 297 |
| `apertura-scheda` | Rimuove tag cleanup | Vari tag AT dopo reset |
| `applytags` | Applica tag generici | Qualsiasi tag passato nel payload |
| `linkforreferral` | Applica tag referral | 333 (referrer), 335 (referree) |
| `leadgen` | Applica tag nuovo lead | 361 |

[Confermato da codice]

### 3.3 Operazioni su Appuntamenti (XML-RPC)

Il worker `apertura-scheda` usa XML-RPC per scrivere custom fields sugli oggetti `ContactAction` (appuntamenti), poiche' la REST API non espone questi campi. [Confermato da codice]

| Operazione | Endpoint | Campi scritti |
|-----------|----------|---------------|
| `aggiornaCustomFieldsAppuntamento()` | `POST /crm/xmlrpc/v1` metodo `DataService.update` su `ContactAction` | Trattamenti, Note, Presente, Rinviato, Annullato, DataRinvio |

---

## 4. Relazioni Keap → Cloudflare Workers (chiamate in uscita)

Le automazioni Keap eseguono step "Send HTTP Request" verso i worker Cloudflare. Questo e' il percorso inverso: Keap chiama i worker, non viceversa. [Confermato da codice — dal report automazioni]

| Automazione | ID | Step HTTP Request | Worker destinazione | Trigger |
|-------------|-----|------------------|--------------------|---------|
| NMV – Nuovo Appuntamento | 179 | Invio conferma + reminder WhatsApp | `sendapp-monitor` [Da verificare] | Tag Appuntamento 1/2 (285/287) |
| NMV – Appuntamento Rimandato/Annullato | 201 | Invio notifica WhatsApp | `sendapp-monitor` [Da verificare] | Tag Annullato/Rinviato |

**Nota:** Gli URL esatti degli step HTTP Request nelle automazioni Keap non sono ispezionabili dal codice sorgente dei worker. Richiedono verifica diretta sulla dashboard Keap. [Da verificare]

---

## 5. Relazioni tra Worker Cloudflare (Service Bindings)

I service bindings permettono a un worker di chiamare un altro direttamente, senza passare per HTTP esterno. [Confermato da codice]

```
apertura-scheda  ─── (non usa service binding verso keap-utility) ─── chiama Keap direttamente
lead-handler     ──── KEAP_UTILITY ────► keap-utility
apt-monitor      ──── KEAP_UTILITY ────► keap-utility
prebooking       ──── KEAP_UTILITY ────► keap-utility (LEGACY)
linkforreferral  ──── APPLY_TAGS   ────► applytags
```

[Confermato da codice]

---

## 6. Ciclo di vita completo di un'interazione (esempio: Apertura Scheda)

```
Operatore Airtable preme pulsante "Apri Scheda"
    │
    ▼
apertura_scheda.js (Airtable Script)
    │  Legge: keapID, dati appuntamento, tabella Prebooking
    │  Chiama: remoteFetchAsync → apertura-scheda worker
    │
    ▼
apertura-scheda (Cloudflare Worker)
    │  1. Ottiene token OAuth (da KV o refresh)
    │  2. PATCH /contacts/{keapID} — aggiorna custom fields A1-A5
    │  3. POST /tags — applica tag appuntamento (285/287/289/365/375)
    │  4. POST /tags — applica tag tipo servizio (Fusion/ProSkin)
    │  5. XML-RPC DataService.update — scrive su ContactAction
    │  6. (opzionale) backup token su Airtable AUTH_BASE
    │
    ▼
Keap CRM
    │  Tag "Appuntamento N" applicato
    │  → Automazione 179 si attiva
    │  → Delay 1h
    │  → Decision diamond (tipo servizio, frequenza)
    │  → HTTP Request → sendapp-monitor → WhatsApp al cliente
    │
    ▼
apertura-scheda worker (risposta)
    │
    ▼
apertura_scheda.js — aggiorna record Airtable (stato, log, errori)
```

[Confermato da codice per i passi 1-5; [Da verificare] per l'URL HTTP Request in automazione 179]

---

## 7. Matrice di dipendenze per dominio

| Da \ Verso | Keap API | Airtable API | SendApp API | Facebook API | Pushover | Worker Cloudflare |
|------------|----------|--------------|-------------|--------------|----------|-------------------|
| **Airtable Scripts** | ✗ (mai diretto) | ✓ (lettura record corrente) | ✗ | ✗ | ✗ | ✓ (sempre via worker) |
| **apertura-scheda** | ✓ (REST v1 + XML-RPC) | ✓ (backup token) | ✓ (invio WhatsApp) | ✗ | ✗ | ✓ (keap-utility opzionale) |
| **applytags** | ✓ (REST v1 POST tags) | ✗ | ✗ | ✗ | ✗ | ✗ |
| **keap-utility** | ✓ (REST v1 GET/PATCH) | ✗ | ✗ | ✗ | ✗ | ✗ |
| **lead-handler** | ✓ (via keap-utility) | ✓ (salva lead) | ✓ | ✓ (webhook) | ✓ | ✓ (keap-utility) |
| **linkforreferral** | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ (applytags) |
| **sendapp-monitor** | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ |
| **apt-monitor** | ✓ (via keap-utility) | ✗ | ✗ | ✗ | ✓ | ✓ (keap-utility) |
| **Automazioni Keap** | ✓ (interni) | ✗ | ✓ (via HTTP Request) | ✗ | ✗ | ✓ (HTTP Request verso workers) |

[Confermato da codice]

---

## 8. Note architetturali

### 8.1 Assenza di comunicazione diretta Airtable → Keap
Nessuno script Airtable chiama mai direttamente le API Keap. Tutta la comunicazione passa obbligatoriamente attraverso i worker Cloudflare. Questo garantisce centralizzazione della logica e gestione uniforme dei token. [Confermato da codice]

### 8.2 Comunicazione bidirezionale Keap ↔ Cloudflare
Il flusso e' normalmente Cloudflare → Keap (aggiornamento dati, tag), ma esiste anche il percorso inverso: Keap → Cloudflare tramite HTTP Request nelle automazioni (invio WhatsApp). [Confermato da codice]

### 8.3 Airtable come storage secondario per token OAuth
Il worker `apertura-scheda` usa Airtable (base `AUTH_BASE_ID`, record `AUTH_RECORD_ID`) come backup del token OAuth Keap, oltre al KV Cloudflare. Questa ridondanza permette un recovery manuale in caso di perdita del KV. [Confermato da codice]

### 8.4 Assenza di comunicazione Airtable ↔ Airtable
Non ci sono script che scrivono dati da una base Airtable a un'altra. Ogni centro opera in isolamento sulla propria base. [Inferito da contesto]
