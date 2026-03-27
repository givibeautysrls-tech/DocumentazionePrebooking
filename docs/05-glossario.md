# 05 - Glossario

---

## Termini di dominio (business)

### Prebooking
Record in Airtable che rappresenta una sessione/visita pianificata. Collega un Cliente, un Appuntamento, un eventuale Acquisto e un eventuale Prossimo Appuntamento. Il campo `_aperta` indica se la scheda e stata aperta (inviata a Keap). [Confermato da codice]

### Scheda
Termine operativo usato dal personale per indicare il record Prebooking. "Aprire la scheda" significa sincronizzare il prebooking con Keap (creando contatto e appuntamento). "Chiudere la scheda" significa registrare l'esito della visita. [Confermato da codice]

### Rinvio
Spostamento di un appuntamento a una nuova data. Comporta: marcatura del vecchio appuntamento come rinviato, creazione di un nuovo appuntamento, applicazione del tag di rinvio sullo slot corrispondente, invio messaggio WhatsApp al cliente. [Confermato da codice]

### Annullamento
Cancellazione definitiva di un appuntamento senza riprogrammazione. Comporta: marcatura come annullato, applicazione del tag di annullamento, invio messaggio WhatsApp. A differenza del rinvio, non viene creato un nuovo appuntamento. [Confermato da codice]

### No-Show
Situazione in cui il cliente non si presenta all'appuntamento. Nella chiusura scheda, il campo `presente` viene impostato a `false`. [Inferito da contesto]

### Centro
Uno dei 4 centri estetici: Portici, Arzano, Torre del Greco, Pomigliano. Ogni centro ha una base Airtable dedicata e un'istanza SendApp propria. Il centro e identificato dal custom field Keap ID 41. [Confermato da codice]

### Trattamento
Servizio estetico eseguito durante un appuntamento. I trattamenti sono categorizzati in due tipologie in base alla zona corporea. [Confermato da codice]

### ProSkin
Tipo di trattamento associato a zone corporee specifiche (viso, ascelle, inguine, ecc.). Il sistema lo identifica verificando se il nome del trattamento contiene una delle zone nella lista `TREATMENT_ZONES`. [Confermato da codice]

### Fusion
Tipo di trattamento non legato a zone corporee specifiche. E il tipo predefinito: se i trattamenti non contengono nomi di zone ProSkin, vengono classificati come Fusion. [Inferito da contesto]

### NMV (No Mas Vello)
Brand franchising a cui appartengono i centri estetici. Utilizzato come prefisso nelle automazioni Keap (es. "NMV -- Nuovo Appuntamento"). [Confermato da codice]

### Rendiconto
Tabella Airtable che registra gli incassi giornalieri. Ogni record ha una Data e un campo "Incassi" collegato ai record Acquisti di quel giorno. Viene aggiornato automaticamente alla chiusura scheda. [Confermato da codice]

### Referral
Programma di passaparola. Un cliente esistente (referrer) porta un nuovo contatto (referral/referree). Il sistema traccia il collegamento, gestisce i buoni e i premi tramite tag Keap e contatori Airtable. [Confermato da codice]

### Puntuale e Premiata
Promozione di fidelizzazione. Il cliente che si presenta puntuale agli appuntamenti puo ricevere vantaggi. Attivata tramite lo script `puntuale_e_premiata.js` che applica il tag 387 e aggiorna il campo `Promo Fidelity`. [Confermato da codice]

---

## Termini tecnici

### SendApp
Servizio esterno per l'invio di messaggi WhatsApp. Ogni centro ha un'istanza dedicata identificata da un Instance ID. Le automazioni Keap inviano HTTP Request che passano attraverso i worker per raggiungere SendApp. [Confermato da codice]

### Pushover
Servizio di notifiche push utilizzato per inviare avvisi operativi in tempo reale (nuovi lead, rinvii, annullamenti, acquisti, riepilogo giornaliero). [Confermato da codice]

### KV (Key-Value)
Cloudflare KV Namespace: storage persistente key-value a bassa latenza. Usato per il token OAuth (`KEAP_TOKENS`) e per i log operativi (`LOGS_KV`). [Confermato da codice]

### D1
Database SQLite serverless di Cloudflare. Usato dal worker `apt-monitor` per salvare eventi di rinvio/annullamento nella tabella `events` e generare riepiloghi giornalieri. [Confermato da codice]

### Service Binding
Meccanismo Cloudflare Workers che permette a un worker di invocare un altro worker direttamente (senza passare per la rete pubblica). Usato per collegare `lead-handler` a `keap-utility`, `apt-monitor` a `keap-utility`, e `linkforreferral` a `applytags`. [Confermato da codice]

### Tag (Keap)
Etichetta applicata a un contatto Keap che funge da segnale per le automazioni. Il sistema GiVi Beauty usa i tag come meccanismo primario di orchestrazione. [Confermato da codice]

**Prefissi dei tag:** [Confermato da codice]
- `AT -> AT -- ...` : **Automation Trigger** -- il tag attiva un'automazione
- `S -> S -- ...` : **Stato** -- il tag rappresenta lo stato corrente del contatto
- `A -- ...` : **Attributo/Azione** -- il tag rappresenta un attributo o un'azione completata

### Custom Field (Keap)
Campo personalizzato sul contatto Keap, identificato da un ID numerico. Il sistema usa custom fields per: centro di appartenenza (41), istanza SendApp (165), telefono pulito (171), dati appuntamento per slot (133-237), prossimo appuntamento (233-237). [Confermato da codice]

### Slot Appuntamento (A1-A5)
Workaround per la limitazione di Keap che non permette di gestire istanze di appuntamento nelle automazioni. Il sistema implementa 5 "slot" numerati, ciascuno con un set dedicato di tag e custom fields. Lo slot viene assegnato in sequenza al momento della creazione dell'appuntamento. [Confermato da codice]

| Slot | Uso tipico |
|------|-----------|
| A1 | Primo appuntamento del cliente |
| A2 | Secondo appuntamento (follow-up) |
| A3 | Terzo appuntamento |
| A4 | Quarto appuntamento (custom fields ridotti) |
| A5 | Quinto appuntamento (custom fields ridotti) |

### ContactAction
Termine Keap per l'oggetto "appuntamento" nel database. I custom fields di un ContactAction (es. `_Trattamenti`, `_Presente`, `_Rinviato`) possono essere scritti solo tramite XML-RPC, non tramite REST API. [Confermato da codice]

### XML-RPC
Protocollo legacy usato da Keap per operazioni non supportate dalla REST API, in particolare l'aggiornamento dei custom fields sugli oggetti ContactAction (appuntamenti). Il worker `apertura-scheda` usa `DataService.update` su `/crm/xmlrpc/v1`. [Confermato da codice]

### OAuth Token Refresh
Processo di rinnovo del token di accesso Keap. Il token ha un TTL di 12 ore. Viene refreshato automaticamente dal worker `apertura-scheda` usando client_id, client_secret e refresh_token. Il nuovo token viene salvato in KV e in Airtable (tabella KeapAuth). [Confermato da codice]

### remoteFetchAsync
Funzione Airtable per effettuare chiamate HTTP da uno script. Equivalente di `fetch` ma gestita dal runtime Airtable. Tutti gli script la usano per comunicare con i Cloudflare Workers. [Confermato da codice]

### CORS (Cross-Origin Resource Sharing)
Header HTTP per il controllo degli accessi cross-origin. Nel sistema, alcuni worker usano `Access-Control-Allow-Origin: *` (apertura-scheda, keap-utility, lead-handler), mentre altri usano `https://promoepilazione.it` (find-contact-id, linkforreferral, applytags, getcontactinfo). [Confermato da codice]

### Riepilogo Mensile
Tabella Airtable che contiene contatori mensili (Referral riscattati, Pacchi Referral Consegnati). Gli script incrementano il contatore sull'**ultima riga** della tabella, assunta essere il mese corrente. Strategia fragile. [Confermato da codice]

### Field Timer (Keap)
Meccanismo nelle automazioni Keap che attende fino a una data specifica memorizzata in un custom field del contatto. Usato per schedulare i reminder prima della data dell'appuntamento (es. "7 giorni prima di a1: data alle 8:00"). [Confermato da codice]
