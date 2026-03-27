# 02 - Mappa dei Domini

---

## Dominio: Cloudflare Workers

### Worker attivi

| Worker | Dominio | Descrizione | Service Bindings | Storage |
|--------|---------|-------------|-----------------|---------|
| `apertura-scheda` | `apertura-scheda.notifichegielvi.workers.dev` | Worker principale: gestisce apertura, chiusura, rinvio, annullamento, sync appuntamenti | -- | KV: `KEAP_TOKENS`, `LOGS_KV` |
| `keap-utility` | `keap-utility.notifichegielvi.workers.dev` | Proxy generico verso Keap API: createContact, findContact, getContactInfo, applyTags, getAppointment | -- | -- |
| `lead-handler` | `lead-handler.notifichegielvi.workers.dev` | Riceve webhook Facebook Lead Gen, inoltra a Airtable e Keap | `keap-utility` (come `KEAP_UTILITY`) | -- |
| `sendapp-monitor` | `sendapp-monitor.notifichegielvi.workers.dev` | Monitora lo stato delle istanze SendApp | -- | -- |
| `apt-monitor` | `apt-monitor.notifichegielvi.workers.dev` | Monitora rinvii/annullamenti, salva in D1, invia notifiche Pushover, riepilogo giornaliero (scheduled) | `KEAP_UTILITY` (service binding) | D1: `DB` |
| `applytags` | `applytags.notifichegielvi.workers.dev` | Applica tag Keap a un contatto via query string | -- | -- |
| `find-contact-id` | `find-contact-id.notifichegielvi.workers.dev` | Cerca contatto Keap per nome/cognome/telefono | -- | -- |
| `getcontactinfo` | `getcontactinfo.notifichegielvi.workers.dev` | Restituisce dettagli contatto Keap per ID (con custom fields) | -- | -- |
| `linkforreferral` | `linkforreferral.notifichegielvi.workers.dev` | Crea contatto referral, lo collega al referrer, applica tag 333/335 | `APPLY_TAGS` (service binding verso `applytags`) | -- |
| `prebooking` | -- | **LEGACY** -- Worker precedente per gestione prebooking | -- | -- |
| `leadgen` | -- | **LEGACY** -- Worker precedente per lead generation (semplificato) | -- | -- |

[Confermato da codice]

### D1 Databases

| Nome binding | Usato da | Tabelle |
|-------------|----------|---------|
| `DB` | `apt-monitor` | `events` (apt_id, keap_contact_id, center, status, original_date, new_date, value_cents, treatments, contact_given_name, contact_family_name, local_day) |

[Confermato da codice]

### KV Namespaces

| Nome binding | Usato da | Contenuto |
|-------------|----------|-----------|
| `KEAP_TOKENS` | `apertura-scheda` | Token OAuth corrente (`current_token`) con access_token, refresh_token, last_refresh |
| `LOGS_KV` | `apertura-scheda` | Log operazioni con TTL 30 giorni, chiave formato `log_YYYYMMDD_timestamp` |

[Confermato da codice]

### Service Bindings

| Binding | Worker chiamante | Worker chiamato | Scopo |
|---------|-----------------|-----------------|-------|
| `KEAP_UTILITY` / `keap-utility` | `lead-handler` | `keap-utility` | createContact, applyTags |
| `KEAP_UTILITY` | `apt-monitor` | `keap-utility` | getContactInfo |
| `APPLY_TAGS` | `linkforreferral` | `applytags` | Applicazione tag referral |

[Confermato da codice]

### Route principali del worker `apertura-scheda`

| Metodo | Path | Funzione |
|--------|------|----------|
| POST | `/api/prebooking` | Apertura scheda: upsert contatto + creazione appuntamento |
| POST | `/api/prebooking/chiusura` | Chiusura scheda: segna presenza, aggiorna custom fields |
| POST | `/api/prebooking/rinvio` | Rinvio appuntamento: applica tag rinvio, crea nuovo appuntamento |
| POST | `/api/prebooking/annulla` | Annullamento appuntamento: applica tag annullamento |
| POST | `/api/prebooking/sync-next-appointment` | Sincronizza NextAppointmentDate/Time/Treatments |

[Confermato da codice]

### Route principali del worker `keap-utility`

| Metodo | Path | Funzione |
|--------|------|----------|
| POST | `/createContact` | Crea contatto su Keap v2 |
| GET | `/findContact?email=` | Cerca contatto per email su Keap v2 |
| GET | `/getContactInfo/{id}` | Legge dettagli contatto Keap v2 |
| POST | `/applyTags` | Applica array di tag a un contatto Keap v1 |
| GET | `/getAppointment/{id}` | Legge dettagli appuntamento Keap v1 |

[Confermato da codice]

### Route del worker `lead-handler`

| Metodo | Path | Funzione |
|--------|------|----------|
| GET/POST | `/moduli` | Webhook Facebook Lead Gen (verifica + ricezione) |
| POST | `/form` | Endpoint per form web (placeholder, ritorna `{ok: true}`) |

[Confermato da codice]

---

## Dominio: Airtable

### Basi (una per centro)

| Centro | Base ID | Stato |
|--------|---------|-------|
| Portici | `appWPbF9yD2PtQrEm` | Attivo [Confermato da codice] |
| Arzano | `appMoFcRmbgI8rpH8` | Attivo [Confermato da codice] |
| Torre del Greco | `appCVqkej3tDupAQP` | Attivo [Confermato da codice] |
| Pomigliano | Base ID vuoto nel lead-handler | Parziale [Confermato da codice] |

### Tabelle principali (per ciascuna base)

| Tabella | Scopo |
|---------|-------|
| **Prebooking** | Record di ogni visita/appuntamento pianificato. Contiene link a Cliente, Appuntamento, Acquisto, Prossimo Appuntamento. Campo `_aperta` per tracking stato. [Confermato da codice] |
| **Clienti** | Anagrafica clienti con KeapID, Nome, Cognome, Email, Telefono, Promo Fidelity, Recensione Inviata, Pacco Referral Ricevuto, Presentata da [Confermato da codice] |
| **Appuntamenti** | Ogni appuntamento con KeapID, NumAptKeap (slot A1-A5), Data e ora, Trattamento (linked), Presente, Rinviato, Annullato, Data Rinvio, Incasso previsto, Promozione, Prezzo promozione, Prepagato [Confermato da codice] |
| **Trattamenti** | Catalogo trattamenti con Nome [Confermato da codice] |
| **Acquisti** | Registrazione acquisti con Totale, Importo contanti, Importo POS, Prodotti (linked), Trattamenti (linked), Data, Pagato con Gift Card [Confermato da codice] |
| **Rendiconto** | Rendiconto giornaliero con Data, Incassi (linked ad Acquisti) [Confermato da codice] |
| **Recensioni e Referral** | Gestione recensioni e referral, campo Cliente (linked) [Confermato da codice] |
| **Riepilogo Mensile** | Contatori mensili: Referral riscattati, Pacchi Referral Consegnati [Confermato da codice] |
| **KeapAPIVars** | Configurazione per centro (campo "Centro") [Confermato da codice] |

### Script Airtable (8 script)

| Script | Tabella trigger | Scopo |
|--------|----------------|-------|
| `apertura_scheda.js` | Prebooking | Apertura scheda: raccoglie dati e chiama `/api/prebooking` |
| `chiusura_scheda.js` | Prebooking | Chiusura scheda: raccoglie dati e chiama `/api/prebooking/chiusura` |
| `rinvio_appuntamento.js` | Appuntamenti | Rinvio: raccoglie dati e chiama `/api/prebooking/rinvio` |
| `annulla_appuntamento.js` | Appuntamenti | Annullamento: raccoglie dati e chiama `/api/prebooking/annulla` |
| `puntuale_e_premiata.js` | Recensioni e Referral | Attiva promo "Puntuale e Premiata", tag 387, sync next appointment |
| `referral_riscattato.js` | Recensioni e Referral | Riscatto referral: tag 337 al cliente, tag 355 al referrer |
| `pacco_consegnato.js` | Recensioni e Referral | Pacco consegnato: tag 357, incrementa contatore |
| `conferma_recensione.js` | Recensioni e Referral | Conferma recensione: tag 155, aggiorna flag |

[Confermato da codice]

---

## Dominio: Keap CRM

### API utilizzate

| API | Versione | Endpoint base | Uso |
|-----|----------|---------------|-----|
| REST API v1 | v1 | `https://api.infusionsoft.com/crm/rest/v1/` | Contatti (PATCH), Appuntamenti (CRUD), Tag (apply), Tags (list) |
| REST API v2 | v2 | `https://api.infusionsoft.com/crm/rest/v2/` | Contatti (create, search, get), Contacts:link (referral) |
| XML-RPC | v1 | `https://api.infusionsoft.com/crm/xmlrpc/v1` | DataService.update su ContactAction (custom fields appuntamento) |
| OAuth Token | -- | `https://api.infusionsoft.com/token` | Refresh token |

[Confermato da codice]

### Tag principali (selezione)

| ID | Nome | Uso nel sistema |
|----|------|----------------|
| 155 | (Recensione) | Conferma recensione [Confermato da codice] |
| 285 | AT -- Appuntamento 1 | Trigger automazione 179 per slot A1 [Confermato da codice] |
| 287 | AT -- Appuntamento 2 | Trigger automazione 179 per slot A2 [Confermato da codice] |
| 289 | AT -- Appuntamento 3 | Trigger per slot A3 [Confermato da codice] |
| 291 | AT -- A1: Annullato | Trigger annullamento A1 [Confermato da codice] |
| 293 | AT -- A2: Annullato | Trigger annullamento A2 [Confermato da codice] |
| 295 | AT -- A3: Annullato | Trigger annullamento A3 [Confermato da codice] |
| 299 | AT -- A1: Rinviato | Trigger rinvio A1 [Confermato da codice] |
| 301 | AT -- A2: Rinviato | Trigger rinvio A2 [Confermato da codice] |
| 303 | AT -- A3: Rinviato | Trigger rinvio A3 [Confermato da codice] |
| 307 | AT -- A1: Fusion | Tipo trattamento Fusion per slot A1 [Confermato da codice] |
| 309 | AT -- A1: ProSkin | Tipo trattamento ProSkin per slot A1 [Confermato da codice] |
| 333 | (Referral - Referrer) | Applicato al referrer quando viene creato un nuovo referral [Confermato da codice] |
| 335 | (Referral - Nuovo contatto) | Applicato al nuovo contatto da referral [Confermato da codice] |
| 337 | (Referral riscattato - Cliente) | Applicato al cliente quando riscatta il referral [Confermato da codice] |
| 355 | (Referral riscattato - Referrer) | Applicato al referrer quando il referral viene riscattato [Confermato da codice] |
| 357 | (Pacco consegnato) | Applicato quando il pacco referral viene consegnato [Confermato da codice] |
| 361 | (Nuovo Lead) | Applicato dal lead-handler a ogni nuovo lead Facebook [Confermato da codice] |
| 365 | AT -- Appuntamento 4 | Trigger per slot A4 [Confermato da codice] |
| 375 | AT -- Appuntamento 5 | Trigger per slot A5 [Confermato da codice] |
| 387 | (Puntuale e Premiata) | Promo fidelity attivata [Confermato da codice] |

### Custom Fields principali (Contact)

| ID | Nome | Scopo |
|----|------|-------|
| 41 | Centro | Nome del centro di appartenenza |
| 133 | a1: trattamenti | Trattamenti slot A1 |
| 135 | a2: trattamenti | Trattamenti slot A2 |
| 137 | a3: trattamenti | Trattamenti slot A3 |
| 165 | InstanceIDSendapp | ID istanza SendApp per il centro |
| 171 | (Telefono pulito) | Numero normalizzato con prefisso 39 |
| 173 | a1: ora | Ora appuntamento slot A1 |
| 177 | a2: ora | Ora appuntamento slot A2 |
| 179 | a2: data | Data appuntamento slot A2 |
| 181 | a3: ora | Ora appuntamento slot A3 |
| 185 | a1: data | Data appuntamento slot A1 |
| 187 | a3: data | Data appuntamento slot A3 |
| 219 | a4: trattamenti | Trattamenti slot A4 |
| 221 | a4: ora | Ora appuntamento slot A4 |
| 225 | a4: data | Data appuntamento slot A4 |
| 227 | a5: trattamenti | Trattamenti slot A5 |
| 229 | a5: ora | Ora appuntamento slot A5 |
| 231 | a5: data | Data appuntamento slot A5 |
| 233 | NextAppointmentDate | Data prossimo appuntamento (per automazioni) |
| 235 | NextAppointmentTime | Ora prossimo appuntamento |
| 237 | NextAppointmentTreatments | Trattamenti prossimo appuntamento |

[Confermato da codice]

### Custom Fields Appuntamento (ContactAction, via XML-RPC)

| Nome campo | Scopo |
|-----------|-------|
| `_Trattamenti` | Elenco trattamenti dell'appuntamento |
| `_Note` | Note dell'appuntamento |
| `_Presente` | Flag presenza cliente |
| `_Rinviato` | Flag rinvio |
| `_Annullato` | Flag annullamento |
| `_DataRinvio` | Data del rinvio |

[Confermato da codice]

### Automazioni principali

| ID | Nome | Trigger | Scopo |
|----|------|---------|-------|
| **179** | NMV -- Nuovo Appuntamento | Tag Appuntamento 1/2 | Conferma WhatsApp + reminder pre-appuntamento |
| **201** | NMV -- Appuntamento Rimandato/Annullato | Tag A1/A2 Annullato, A3 Rinviato | Messaggi rinvio/annullamento + pulizia tag |
| **511** | NMV -- Temperatura rinvii | Tag rinvio A3/A4/A5 | Follow-up post-rinvio |
| 75 | NMV -- PreBooking | Tag interesse | Sequenza per contatti non ancora prenotati |
| 135 | Contatti NMV -- WelcomeOptin | Web Form | Benvenuto nuovi opt-in |
| 185 | NMV -- Recensioni | Tag post-visita | Raccolta recensioni |
| 205 | NMV -- Closed Opportunity | Opportunity stage | Post-chiusura opportunita |
| 319-343 | NMV -- Referral (7 automazioni) | Tag referral | Ciclo completo referral |
| 353 | NMV -- Feedback trimestrale | Tag/data | Feedback periodico |
| 497 | Compleanni | Data compleanno | Comunicazione compleanno |
| 15 | NMV -- Temperatura clienti | Tag stato | Nurturing clienti esistenti |

[Confermato da codice]
