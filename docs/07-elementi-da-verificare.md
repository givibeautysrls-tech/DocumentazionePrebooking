# 07 — Elementi da Verificare

> Ultima revisione: 2026-03-26

Questo documento cataloga tutti gli elementi del sistema che sono stati inferiti dal contesto o che necessitano di verifica manuale. Sono organizzati per dominio (Cloudflare, Airtable, Keap) e per priorita'.

---

## Legenda

- **[Da verificare]** — Elemento che non puo' essere confermato dal solo codice sorgente; richiede verifica sull'ambiente di produzione, sulla dashboard Cloudflare, su Keap o su Airtable.
- **[Inferito da contesto]** — Deduzione ragionevole basata su naming convention, struttura del codice o documentazione esterna, ma non direttamente verificabile dal codice.

---

## 1. Dominio Cloudflare Workers

### 1.1 Il worker `prebooking` e' ancora in uso?

**Stato attuale nel codice:** Il worker esiste nel backup con route funzionanti (`/cancelAppointment/{id}`, `/resetAppointment/{id}`) e route non implementate (`/setAppointment`, `/setOpportunity`). Il worker `apertura-scheda` ha assunto le stesse funzionalita' con implementazione piu' completa. [Confermato da codice]

**Da verificare:**
- [ ] Il worker `prebooking` e' ancora deployato su Cloudflare?
- [ ] Riceve traffico attivo (controllare Workers Analytics)?
- [ ] Esistono automazioni Keap (HTTP Request) che puntano a `prebooking.notifichegielvi.workers.dev`?
- [ ] I route `/setAppointment` e `/setOpportunity` (handler vuoti) sono mai stati implementati in una versione successiva?

**Priorita':** Alta — rischio di percorsi duplicati e confusione operativa.

### 1.2 Il worker `leadgen` e' ancora in uso o e' stato rinominato?

**Stato attuale nel codice:** Il backup `workers-backup/leadgen/` contiene il codice completo per la gestione lead Facebook (~544 righe: HMAC, Graph API, Keap via service binding, AIRTABLE_ROUTES). Il backup `workers-backup/lead-handler/` contiene un worker piu' semplice (~160 righe: solo Airtable + Pushover + SendApp). La documentazione indica `lead-handler` come attivo e `leadgen` come legacy. [Confermato da codice]

**Da verificare:**
- [ ] Quale codice e' effettivamente deployato come `lead-handler` su Cloudflare? Il codice dal backup `leadgen/` o dal backup `lead-handler/`?
- [ ] Il worker `leadgen` e' ancora deployato con un route attivo?
- [ ] Il webhook Facebook Meta punta a quale URL esattamente?

**Priorita':** Alta — i nomi dei backup sono invertiti rispetto alla documentazione.

### 1.3 Quale SendApp Instance ID e' corretto per Pomigliano?

| Sorgente | Instance ID | Contesto |
|----------|-------------|----------|
| `leadgen` worker (backup) | `68BFEBB41DDD0` | Mappa `sendappUser` in `handleLead()` |
| `apertura-scheda` worker | `6926D352155D3` | `CONFIG.CENTRO_TO_SENDAPP` |

[Confermato da codice]

**Da verificare:**
- [ ] Quale ID e' attualmente attivo sulla piattaforma SendApp per il centro Pomigliano?
- [ ] L'ID `68BFEBB41DDD0` e' stato sostituito da `6926D352155D3` o viceversa?
- [ ] I contatti Keap di Pomigliano hanno valori misti nel custom field 165?

**Priorita':** Alta — impatto sulle comunicazioni WhatsApp.

### 1.4 La configurazione Airtable per Pomigliano deve essere completata nel lead-handler?

Il worker `leadgen` (codice attivo come lead-handler) ha `AIRTABLE_ROUTES["pomigliano"] = { base: "", table: "" }`. [Confermato da codice]

**Da verificare:**
- [ ] Esiste una base Airtable dedicata al centro Pomigliano?
- [ ] Se si', quali sono i base ID e table ID corretti?
- [ ] Pomigliano riceve lead da Facebook? Se si', dove vengono salvati attualmente?
- [ ] L'assenza e' intenzionale (centro non ancora operativo per lead gen) o e' una dimenticanza?

**Priorita':** Alta — potenziale perdita dati.

### 1.5 Consistenza nell'accesso al service binding `keap-utility`

Il worker `prebooking` accede al service binding con un pattern di fallback:

```js
const svc = env["keap-utility"] || env.KEAP_UTILITY;
```

[Confermato da codice]

**Da verificare:**
- [ ] Nella configurazione `wrangler.toml` di `prebooking`, il binding e' definito come `keap-utility` (con trattino) o `KEAP_UTILITY` (underscore)?
- [ ] Gli altri worker che usano il service binding (`apt-monitor`, `lead-handler`) usano la stessa convenzione?
- [ ] Il worker `apertura-scheda` usa il service binding verso `keap-utility` oppure chiama direttamente le API Keap?

**Priorita':** Media — il pattern di fallback mitiga il rischio, ma la convenzione dovrebbe essere uniforme.

### 1.6 Il worker `getcontactinfo` e' ancora utilizzato?

Il worker `keap-utility` espone un endpoint `/getContactInfo/{id}` con funzionalita' equivalente a `getcontactinfo`, ma usa OAuth token (`KEAP_ACCESS_TOKEN`) invece di PAK (`KEAP_API_KEY`). [Confermato da codice]

**Da verificare:**
- [ ] Esistono chiamate dirette a `getcontactinfo.notifichegielvi.workers.dev` da Airtable scripts, automazioni Keap o pagine web?
- [ ] Il worker `getcontactinfo` puo' essere dismesso a favore di `keap-utility`?

**Priorita':** Bassa — entrambi funzionano, ma mantenere duplicati aumenta la superficie di manutenzione.

### 1.7 Il worker `applytags` e' ancora utilizzato direttamente?

Il worker `keap-utility` espone `/applyTags` con funzionalita' equivalente. Tuttavia, `applytags` e' usato come service binding da `linkforreferral` (binding `APPLY_TAGS`) e chiamato direttamente via HTTP dagli script Airtable. [Confermato da codice]

**Da verificare:**
- [ ] Sarebbe possibile migrare tutte le chiamate verso `keap-utility` per consolidare?
- [ ] Il worker `linkforreferral` potrebbe usare `keap-utility` al posto di `applytags`?

**Priorita':** Bassa — funziona correttamente, migrazione opzionale.

---

## 2. Dominio Keap

### 2.1 Tutte le 23 automazioni sono ancora attive?

Il report automazioni (`keap-backup/automations_report.md`) elenca 23 automazioni. [Confermato da codice]

**Da verificare:**
- [ ] Quali automazioni hanno stato "Active" vs "Inactive" vs "Draft" sulla dashboard Keap?
- [ ] Le automazioni referral (319, 321, 323, 325, 327, 329, 331, 339, 343) hanno 0 contatti attivi — sono in attesa di attivazione o disabilitate?
- [ ] L'automazione 69 (`MH – Salon Startup – 24 Marzo – Temp`) e' stata disattivata dopo l'evento?
- [ ] L'automazione 17 (`Contatti Salon Startup`) e' ancora rilevante per NMV?

**Priorita':** Media — automazioni inattive non causano danni ma creano confusione.

### 2.2 L'endpoint XML-RPC continuera' a essere supportato da Keap?

Il worker `apertura-scheda` usa `https://api.infusionsoft.com/crm/xmlrpc/v1` per `DataService.update` sui custom fields degli appuntamenti (ContactAction). [Confermato da codice]

**Da verificare:**
- [ ] Keap ha annunciato una data di dismissione per XML-RPC?
- [ ] Esiste un'alternativa REST API per scrivere custom fields sui ContactAction?
- [ ] Il campo XML-RPC e' utilizzato solo per i suffix `_Trattamenti`, `_Note`, `_Presente`, `_Rinviato`, `_Annullato`, `_DataRinvio`?

**Priorita':** Alta — se XML-RPC viene dismesso, il flusso di apertura/chiusura scheda si interrompe.

### 2.3 KEAP_API_KEY (PAK) vs OAuth: scelta intenzionale o legacy?

| Worker | Metodo auth | Tipo |
|--------|-------------|------|
| `apertura-scheda` | OAuth + refresh + fallback PAK | Ibrido |
| `keap-utility` | `KEAP_ACCESS_TOKEN` (token statico) | [Da verificare] se e' PAK o OAuth token |
| `applytags` | `KEAP_API_KEY` | PAK |
| `find-contact-id` | `KEAP_API_KEY` | PAK |
| `getcontactinfo` | `KEAP_API_KEY` | PAK |
| `leadgen` | Tramite service binding `keap-utility` | Delegato |

[Confermato da codice]

**Da verificare:**
- [ ] L'uso del PAK nei worker piu' semplici e' una scelta architetturale (PAK non scade) o legacy (creati prima dell'implementazione OAuth)?
- [ ] Il `KEAP_ACCESS_TOKEN` di `keap-utility` e' un PAK o un token OAuth che rischia di scadere?
- [ ] Chi/cosa aggiorna `KEAP_ACCESS_TOKEN` in `keap-utility` quando scade?

**Priorita':** Alta — se `KEAP_ACCESS_TOKEN` in `keap-utility` e' un OAuth token, tutti i worker che usano il service binding (lead-handler, prebooking, apt-monitor) sono a rischio di interruzione.

### 2.4 HTTP Request nelle automazioni Keap

Le automazioni 179 (`NMV – Nuovo Appuntamento`) e 201 (`NMV – Appuntamento Rimandato/Annullato`) contengono step "Send HTTP Request" per l'invio di messaggi WhatsApp. [Confermato da codice — dal report automazioni]

**Da verificare:**
- [ ] Quali URL esatti sono configurati negli step HTTP Request?
- [ ] Le richieste puntano a `sendapp-monitor` o a un altro worker/servizio?
- [ ] Quali dati del contatto vengono inviati nel payload?
- [ ] Esistono altre automazioni con step HTTP Request non documentati?

**Priorita':** Alta — le HTTP Request sono il meccanismo di comunicazione WhatsApp e non sono ispezionabili dal codice.

---

## 3. Dominio Airtable

### 3.1 Struttura identica delle 4 basi Airtable?

Il sistema presuppone che ogni centro abbia una base Airtable dedicata con struttura identica. [Inferito da contesto]

**Da verificare:**
- [ ] Tutte e 4 le basi (Arzano, Portici, Torre del Greco, Pomigliano) hanno le stesse tabelle?
- [ ] I nomi dei campi sono identici in tutte le basi?
- [ ] Le tabelle presenti sono: Clienti, Appuntamenti, Prebooking, Rendiconto, Riepilogo Mensile, Recensioni e Referral? [Inferito da contesto]
- [ ] La base Pomigliano esiste effettivamente?

**Basi note:**

| Centro | Base ID | Table ID (Lead) | Fonte |
|--------|---------|-----------------|-------|
| Arzano | `appMoFcRmbgI8rpH8` | `tblNNPcer4NqOqrpM` | [Confermato da codice] |
| Portici | `appWPbF9yD2PtQrEm` | `tbl21en6aDhgcD7T0` | [Confermato da codice] |
| Torre del Greco | `appCVqkej3tDupAQP` | `tblL6YNidW44GXBEq` | [Confermato da codice] |
| Pomigliano | `""` (vuoto) | `""` (vuoto) | [Confermato da codice] |

**Priorita':** Media — necessario per documentazione completa e per risolvere il problema Pomigliano.

### 3.2 Field IDs nelle basi Airtable

Gli script Airtable referenziano campi per nome (es. `"KeapID"`, `"Nome"`, `"Appuntamento"`), non per ID. [Confermato da codice]

**Da verificare:**
- [ ] I nomi dei campi Airtable sono consistenti tra le 4 basi?
- [ ] Ci sono campi mancanti o rinominati in alcune basi?

**Priorita':** Media.

### 3.3 Token OAuth backup su Airtable

Il worker `apertura-scheda` salva il token aggiornato su Airtable usando `AUTH_BASE_ID` e `AUTH_RECORD_ID`. [Confermato da codice]

**Da verificare:**
- [ ] Quale base e tabella Airtable contiene il token?
- [ ] Il token viene letto da qualche altro componente oppure il backup e' solo a fini di recovery manuale?
- [ ] La base con i token ha restrizioni di accesso adeguate?

**Priorita':** Alta — il token OAuth e' un dato sensibile.

---

## Riepilogo per priorita'

### Priorita' Alta

| # | Elemento | Dominio |
|---|----------|---------|
| 1.1 | `prebooking` ancora in uso? | Cloudflare |
| 1.2 | `leadgen` vs `lead-handler` naming | Cloudflare |
| 1.3 | SendApp Instance ID Pomigliano | Cloudflare |
| 1.4 | Airtable config Pomigliano | Cloudflare |
| 2.2 | XML-RPC deprecation | Keap |
| 2.3 | PAK vs OAuth per keap-utility | Keap |
| 2.4 | URL HTTP Request in automazioni | Keap |
| 3.3 | Token backup su Airtable | Airtable |

### Priorita' Media

| # | Elemento | Dominio |
|---|----------|---------|
| 1.5 | Binding name consistency | Cloudflare |
| 2.1 | Stato automazioni 23/23 attive | Keap |
| 3.1 | Struttura basi Airtable | Airtable |
| 3.2 | Field IDs consistenti | Airtable |

### Priorita' Bassa

| # | Elemento | Dominio |
|---|----------|---------|
| 1.6 | `getcontactinfo` dismettibile? | Cloudflare |
| 1.7 | `applytags` consolidabile? | Cloudflare |
