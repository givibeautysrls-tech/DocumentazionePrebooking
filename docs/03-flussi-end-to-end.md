# 03 - Flussi End-to-End

---

## 1. Nuovo Lead da Facebook

### Descrizione

Quando un utente compila un modulo di lead generation su Facebook/Instagram, il webhook invia i dati al worker `lead-handler`. Il worker estrae i campi del lead, determina il centro di appartenenza, crea il record in Airtable e il contatto in Keap, poi applica il tag 361 che attiva le automazioni di benvenuto. [Confermato da codice]

### Diagramma

```mermaid
sequenceDiagram
    participant FB as Facebook
    participant LH as lead-handler
    participant AT as Airtable
    participant KU as keap-utility<br/>(service binding)
    participant KP as Keap CRM

    FB->>LH: POST /moduli (webhook leadgen)
    LH->>LH: Verifica firma HMAC SHA-256
    LH->>FB: GET Graph API v23.0/{leadId}<br/>recupera field_data
    LH->>FB: GET Graph API v23.0/{formId}<br/>recupera label domande
    LH->>LH: normalizeLeadWithLabels()
    LH->>LH: extractCenterFromNormalized()
    LH->>AT: POST /v0/{baseId}/{tableId}<br/>Crea record (Nome, Cognome, Telefono, Data, Info)
    LH->>KU: POST /createContact<br/>(nome, cognome, telefono, email, custom_fields)
    KU->>KP: POST /crm/rest/v2/contacts
    KP-->>KU: {id: contactID}
    KU-->>LH: {id: contactID}
    LH->>KU: POST /applyTags<br/>{contactID, tagIds: [361]}
    KU->>KP: POST /crm/rest/v1/contacts/{id}/tags
    Note over KP: Tag 361 attiva automazione<br/>di benvenuto (WhatsApp)
```

### Dettagli implementativi

- **Routing per centro**: Il lead-handler usa la mappa `AIRTABLE_ROUTES` per determinare base e tabella Airtable in base al centro estratto dalle risposte del form. [Confermato da codice]
- **Centri supportati**: Arzano (`appMoFcRmbgI8rpH8`/`tblNNPcer4NqOqrpM`), Portici (`appWPbF9yD2PtQrEm`/`tbl21en6aDhgcD7T0`), Torre del Greco (`appCVqkej3tDupAQP`/`tblL6YNidW44GXBEq`). **Pomigliano ha base e table vuoti.** [Confermato da codice]
- **Custom fields Keap** impostati alla creazione: Centro (41), Telefono pulito (171), InstanceIDSendapp (165) [Confermato da codice]
- **SendApp Instance ID per lead-handler**: Portici=`67F7E1DA0EF73`, Arzano=`67EFB424D2353`, Torre del Greco=`67EFB605B93A1`, Pomigliano=`68BFEBB41DDD0` [Confermato da codice]

---

## 2. Apertura Scheda (Prebooking)

### Descrizione

L'operatrice del centro clicca il pulsante "Apri Scheda" su un record Prebooking in Airtable. Lo script raccoglie i dati del cliente e dell'appuntamento, li invia al worker `apertura-scheda`. Il worker cerca o crea il contatto su Keap, crea l'appuntamento Keap, determina lo slot disponibile (A1-A5), compila i custom fields e applica i tag di trigger. L'automazione Keap 179 invia la conferma WhatsApp. [Confermato da codice]

### Diagramma

```mermaid
sequenceDiagram
    participant OP as Operatrice
    participant AT as Airtable<br/>(apertura_scheda.js)
    participant WK as apertura-scheda<br/>worker
    participant KP as Keap CRM

    OP->>AT: Click pulsante "Apri Scheda"
    AT->>AT: Raccolta dati: Cliente, Appuntamento,<br/>Trattamenti, Prebooking ID
    AT->>WK: POST /api/prebooking<br/>{centro, cliente, appuntamento, prebooking}
    WK->>WK: validatePrebookingRequest()
    WK->>KP: Cerca contatto (nome, cognome, telefono)
    alt Contatto trovato
        WK->>KP: PATCH contatto (aggiorna se necessario)
    else Contatto non trovato
        WK->>KP: POST crea contatto con custom fields<br/>(Centro, SendApp Instance, Telefono pulito)
    end
    WK->>KP: POST /crm/rest/v1/appointments<br/>Crea appuntamento Keap
    WK->>KP: XML-RPC DataService.update<br/>Aggiorna custom fields ContactAction<br/>(_Trattamenti, _Note)
    WK->>WK: Determina slot A1-A5 disponibile
    WK->>KP: PATCH contatto: compila custom fields<br/>data/ora/trattamenti per lo slot
    WK->>KP: POST applica tag appuntamento<br/>(es. 285 per A1)
    WK->>KP: POST applica tag tipo trattamento<br/>(Fusion 307 o ProSkin 309)
    WK->>WK: Salva log in LOGS_KV
    WK-->>AT: {success, cliente, appuntamento,<br/>numeroAppuntamento, messages}
    AT->>AT: Aggiorna KeapID su Clienti e Appuntamenti
    AT->>AT: Marca Prebooking _aperta=1
    Note over KP: Tag Appuntamento attiva<br/>automazione 179<br/>(conferma WhatsApp)
```

### Dettagli implementativi

- **Upsert contatto**: Il worker cerca prima per nome/cognome/email. Se trova un solo risultato, lo usa. Se ne trova multipli, filtra per telefono. Se non trova nulla, crea un nuovo contatto. [Confermato da codice]
- **Determinazione tipo trattamento**: Il sistema verifica se i trattamenti contengono nomi di zone corporee (dalla lista `TREATMENT_ZONES`). Se li contiene, il trattamento e di tipo **ProSkin**; altrimenti e **Fusion**. [Confermato da codice]
- **Slot assignment**: Il worker cerca il primo slot (A1-A5) disponibile per il contatto, basandosi sui custom fields data gia compilati. [Inferito da contesto]
- **XML-RPC**: Usato per scrivere i custom fields `_Trattamenti` e `_Note` sull'oggetto ContactAction (appuntamento Keap), in quanto l'API REST non supporta la scrittura di questi campi. [Confermato da codice]

---

## 3. Chiusura Scheda

### Descrizione

L'operatrice clicca "Chiudi Scheda" sul record Prebooking. Lo script verifica che l'appuntamento non sia gia rinviato/annullato, raccoglie dati su presenza, acquisto e prossimo appuntamento, poi chiama il worker. Il worker aggiorna Keap (presenza, custom fields), registra il prossimo appuntamento se presente, e sincronizza i campi NextAppointment. [Confermato da codice]

### Diagramma

```mermaid
sequenceDiagram
    participant OP as Operatrice
    participant AT as Airtable<br/>(chiusura_scheda.js)
    participant WK as apertura-scheda<br/>worker
    participant KP as Keap CRM

    OP->>AT: Click pulsante "Chiudi Scheda"
    AT->>AT: Verifica: appuntamento non rinviato/annullato
    AT->>AT: Raccolta: cliente, presenza, acquisto,<br/>prossimo appuntamento
    AT->>WK: POST /api/prebooking/chiusura<br/>{centro, cliente, presente, appuntamento,<br/>acquisto, prossimoAppuntamento}
    WK->>WK: validateChiusuraRequest()
    WK->>KP: XML-RPC: aggiorna _Presente su ContactAction
    opt Se c'e prossimo appuntamento
        WK->>KP: POST crea nuovo appuntamento Keap
        WK->>KP: XML-RPC: aggiorna custom fields<br/>del nuovo appuntamento
        WK->>KP: PATCH: compila slot A1-A5<br/>per il nuovo appuntamento
        WK->>KP: POST: applica tag appuntamento + tipo
    end
    WK->>KP: POST /api/prebooking/sync-next-appointment<br/>(aggiorna NextAppointmentDate/Time/Treatments)
    WK->>WK: Notifica Pushover (se acquisto > 0)
    WK->>WK: Salva log in LOGS_KV
    WK-->>AT: {success, messages, prossimoAppuntamento}
    AT->>AT: Aggiorna KeapID prossimo appuntamento
    AT->>AT: Collega acquisto al Rendiconto giornaliero
    AT->>AT: Salva esito in campo "esito_prebooking"
```

### Dettagli implementativi

- **Rendiconto automatico**: Lo script Airtable, dopo la risposta positiva dal worker, cerca nella tabella Rendiconto un record con la stessa data dell'acquisto e collega l'acquisto al campo "Incassi". [Confermato da codice]
- **Notifica Pushover**: Viene inviata una notifica push con suono "cashregister" per ogni acquisto con totale > 0. [Confermato da codice]
- **Validazione acquisto**: Il totale deve essere presente (o Gift Card segnata). Se totale > 0 e Gift Card = true, l'operazione viene bloccata. [Confermato da codice]

---

## 4. Rinvio Appuntamento

### Descrizione

L'operatrice clicca "Rinvia" su un record Appuntamenti. Lo script chiede il motivo, poi invia i dati al worker. Il worker applica il tag di rinvio sullo slot corrispondente (es. tag 299 per A1), che attiva l'automazione Keap 201. Il worker crea un nuovo appuntamento Keap nello slot successivo. Lo script Airtable marca il vecchio appuntamento come rinviato e crea un nuovo record Appuntamento + Prebooking. [Confermato da codice]

### Diagramma

```mermaid
sequenceDiagram
    participant OP as Operatrice
    participant AT as Airtable<br/>(rinvio_appuntamento.js)
    participant WK as apertura-scheda<br/>worker
    participant KP as Keap CRM
    participant AM as Automazione 201

    OP->>AT: Click pulsante "Rinvia"
    AT->>AT: Verifica: non gia rinviato,<br/>data rinvio presente
    AT->>OP: Chiede motivo del rinvio
    AT->>AT: Aggiorna Prebooking con feedback
    AT->>WK: POST /api/prebooking/rinvio<br/>{centro, cliente, appuntamento,<br/>rinvio: {nuovaDataEOra, motivoRinvio}}
    WK->>WK: validateRinvioRequest()
    WK->>KP: XML-RPC: _Rinviato=true,<br/>_DataRinvio={nuovaData}
    WK->>KP: POST applica tag rinvio<br/>(es. 299 per A1 Rinviato)
    Note over KP: Tag rinvio attiva<br/>automazione 201
    AM->>AM: Invia WhatsApp rinvio<br/>Rimuove tag stato
    WK->>KP: POST crea nuovo appuntamento<br/>sulla nuova data
    WK->>KP: XML-RPC + PATCH:<br/>compila slot successivo
    WK->>KP: POST applica tag nuovo slot
    WK->>WK: Notifica Pushover (Appuntamento Rinviato)
    WK->>WK: Salva log in LOGS_KV
    WK-->>AT: {success, appuntamentoNuovo}
    AT->>AT: Marca vecchio appuntamento Rinviato=1
    AT->>AT: Crea nuovo record Appuntamento<br/>con KeapID e NumAptKeap
    AT->>AT: Crea nuovo record Prebooking<br/>collegato al nuovo appuntamento
```

### Dettagli implementativi

- **Notifica apt-monitor**: In parallelo, il worker `apertura-scheda` puo anche notificare l'`apt-monitor` per il tracking in D1. [Inferito da contesto]
- **Conservazione dati**: Il nuovo appuntamento Airtable conserva trattamenti, promozione, prezzo promozione, flag prepagato e operatrice dal vecchio appuntamento. [Confermato da codice]
- **Logica rinvio "lungo"**: Se la nuova data e distante almeno 4 giorni dalla vecchia, il sistema potrebbe applicare logiche diverse. [Confermato da codice]

---

## 5. Annullamento Appuntamento

### Descrizione

Simile al rinvio, ma senza creazione di un nuovo appuntamento. L'operatrice clicca "Annulla", il worker applica il tag di annullamento (es. 291 per A1), che attiva l'automazione Keap 201 per l'invio del messaggio di annullamento. [Confermato da codice]

### Diagramma

```mermaid
sequenceDiagram
    participant OP as Operatrice
    participant AT as Airtable<br/>(annulla_appuntamento.js)
    participant WK as apertura-scheda<br/>worker
    participant KP as Keap CRM
    participant AM as Automazione 201

    OP->>AT: Click pulsante "Annulla"
    AT->>AT: Verifica: non gia annullato,<br/>KeapID e NumAptKeap presenti
    AT->>WK: POST /api/prebooking/annulla<br/>{centro, cliente, appuntamento}
    WK->>WK: validateAnnullaRequest()
    WK->>KP: XML-RPC: _Annullato=true
    WK->>KP: POST applica tag annullamento<br/>(es. 291 per A1 Annullato)
    Note over KP: Tag annullamento attiva<br/>automazione 201
    AM->>AM: Invia WhatsApp annullamento<br/>Rimuove tag stato
    WK->>WK: Notifica Pushover (Appuntamento Annullato)
    WK->>WK: Salva log in LOGS_KV
    WK-->>AT: {success, messages}
    AT->>AT: Marca appuntamento Annullato=1
```

### Differenze rispetto al rinvio

- **Nessun nuovo appuntamento** creato ne su Keap ne su Airtable [Confermato da codice]
- **Validazione piu semplice**: non richiede `nuovaDataEOra` [Confermato da codice]
- **Numero appuntamento limitato a 1-4**: La validazione nel worker accetta solo `numeroAppuntamento` tra 1 e 4 per annullamento [Confermato da codice]

---

## 6. Referral Flow

### Descrizione

Il flusso referral gestisce l'intero ciclo: creazione del contatto referral, collegamento al referrer, riscatto del buono e consegna del pacco. Coinvolge il worker `linkforreferral`, lo script `referral_riscattato.js` e lo script `pacco_consegnato.js`. [Confermato da codice]

### Diagramma - Fase 1: Creazione Referral

```mermaid
sequenceDiagram
    participant WEB as Sito web<br/>promoepilazione.it
    participant LR as linkforreferral<br/>worker
    participant AT as applytags<br/>(service binding)
    participant KP as Keap CRM

    WEB->>LR: POST {first_name, last_name,<br/>phone, referrer_id, centro}
    LR->>LR: Validazione (centri: Portici, Arzano, Torre del Greco)
    LR->>LR: normalizzaTelefono()
    LR->>KP: POST /crm/rest/v2/contacts<br/>{nome, cognome, telefono, custom_fields:<br/>Centro(41), Telefono(171)}
    KP-->>LR: {id: newContactId}
    LR->>KP: POST /crm/rest/v2/contacts:link<br/>{contact1_id: referrer_id,<br/>contact2_id: newContactId, link_type_id: 1}
    LR->>AT: GET ?keapID={referrer_id}&tagIDs=333
    Note over AT,KP: Tag 333 al referrer<br/>(attiva automazioni referral Keap)
    LR->>AT: GET ?keapID={newContactId}&tagIDs=335
    Note over AT,KP: Tag 335 al nuovo contatto<br/>(benvenuto referral)
    LR-->>WEB: {status: "successo", contact_id}
```

### Diagramma - Fase 2: Riscatto e Consegna

```mermaid
sequenceDiagram
    participant OP as Operatrice
    participant AT as Airtable

    Note over OP,AT: Riscatto Referral (referral_riscattato.js)
    OP->>AT: Click "Riscatta Referral"<br/>su Recensioni e Referral
    AT->>AT: Recupera KeapID cliente
    AT->>AT: Recupera KeapID referrer<br/>(campo "Presentata da")
    AT->>AT: applytags: tag 337 al cliente
    AT->>AT: applytags: tag 355 al referrer
    AT->>AT: Incrementa +1 "Referral riscattati"<br/>su ultima riga Riepilogo Mensile

    Note over OP,AT: Consegna Pacco (pacco_consegnato.js)
    OP->>AT: Click "Pacco Consegnato"<br/>su Recensioni e Referral
    AT->>AT: Verifica: Pacco non gia ricevuto
    AT->>AT: Imposta "Pacco Referral Ricevuto"=true
    AT->>AT: applytags: tag 357 al cliente
    AT->>AT: Incrementa +1 "Pacchi Referral Consegnati"<br/>su ultima riga Riepilogo Mensile
```

### Tag del flusso referral

| Fase | Tag | Applicato a | Scopo |
|------|-----|-------------|-------|
| Creazione | 333 | Referrer | Segnala al CRM che il referrer ha portato qualcuno [Confermato da codice] |
| Creazione | 335 | Nuovo contatto | Segnala il nuovo contatto come arrivato da referral [Confermato da codice] |
| Riscatto | 337 | Cliente (referral) | Buono riscattato [Confermato da codice] |
| Riscatto | 355 | Referrer | Premio per il referrer [Confermato da codice] |
| Consegna | 357 | Cliente (referral) | Pacco consegnato [Confermato da codice] |

---

## 7. Sync Next Appointment

### Descrizione

Dopo ogni chiusura scheda (e dopo l'attivazione della promo "Puntuale e Premiata"), il sistema sincronizza i campi `NextAppointmentDate`, `NextAppointmentTime` e `NextAppointmentTreatments` sul contatto Keap. Questi campi sono utilizzati dalle automazioni Keap per schedulare reminder e comunicazioni. [Confermato da codice]

### Diagramma

```mermaid
sequenceDiagram
    participant SC as Script Airtable<br/>(chiusura / puntuale_e_premiata)
    participant WK as apertura-scheda<br/>worker
    participant KP as Keap CRM

    SC->>WK: POST /api/prebooking/sync-next-appointment<br/>{cliente: {keapId}}
    WK->>WK: validateSyncNextAppointmentRequest()
    WK->>KP: GET appuntamenti futuri del contatto
    WK->>WK: Identifica prossimo appuntamento<br/>(data piu vicina nel futuro)
    WK->>KP: PATCH contatto: custom_fields<br/>[{id:233, NextAppointmentDate},<br/>{id:235, NextAppointmentTime},<br/>{id:237, NextAppointmentTreatments}]
    WK-->>SC: {success, nextAppointment}
```

### Dettagli implementativi

- **Custom fields aggiornati**: `233` (NextAppointmentDate), `235` (NextAppointmentTime), `237` (NextAppointmentTreatments) [Confermato da codice]
- **Chiamato da**: `chiusura_scheda.js` (implicito nel flusso chiusura) e `puntuale_e_premiata.js` (esplicitamente) [Confermato da codice]
- **Scopo per Keap**: Le automazioni Keap usano questi campi nei Field Timer per schedulare reminder prima della data dell'appuntamento. [Inferito da contesto]
