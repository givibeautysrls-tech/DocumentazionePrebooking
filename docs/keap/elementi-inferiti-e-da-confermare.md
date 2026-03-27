# Elementi Inferiti e Da Confermare

> Ultima revisione: 2026-03-27
>
> Questo documento cataloga in modo sistematico tutti gli elementi dell'intera documentazione tecnica GiVi Beauty che sono stati classificati come `[Inferito da contesto]` — ovvero deduzioni ragionevoli non direttamente verificabili dal codice sorgente. Per gli elementi che richiedono azione correttiva o verifica operativa urgente, consultare anche `../../07-elementi-da-verificare.md`.

---

## Legenda

| Tag | Significato |
|-----|-------------|
| `[Inferito da contesto]` | Deduzione dalla struttura del codice, dai naming convention o dalla logica dei flussi — non dichiarata esplicitamente nel codice |
| `[Da verificare]` | Informazione plausibile che richiede conferma su ambiente di produzione, dashboard o CRM |

---

## 1. Dominio Cloudflare Workers

### 1.1 Architettura e deployment

| # | Elemento inferito | Fonte inferenza | Documento di riferimento |
|---|-------------------|-----------------|--------------------------|
| CF-I-01 | Il worker `prebooking` e' stato sostituito da `apertura-scheda` ma potrebbe essere ancora deployato | Sovrapposizione funzionale tra i due worker | `cloudflare/inventario-progetti-cloudflare.md` |
| CF-I-02 | Il worker `leadgen` (backup) e' lo stesso codice attualmente deployato come `lead-handler` | I backup hanno nomi invertiti rispetto alla documentazione | `07-elementi-da-verificare.md §1.2` |
| CF-I-03 | I worker con PAK (`applytags`, `find-contact-id`, `getcontactinfo`) sono stati creati prima dell'implementazione OAuth | Uso inconsistente dei metodi di autenticazione | `07-elementi-da-verificare.md §2.3` |
| CF-I-04 | Il `KEAP_ACCESS_TOKEN` in `keap-utility` potrebbe essere un OAuth token statico a rischio di scadenza | Nome della variabile ambiguo; non e' una PAK nominalmente | `cloudflare/workers/keap-utility.md` |
| CF-I-05 | `getcontactinfo` puo' essere dismesso a favore di `keap-utility /getContactInfo/{id}` | Funzionalita' sovrapposte tra i due worker | `07-elementi-da-verificare.md §1.6` |
| CF-I-06 | `applytags` puo' essere consolidato in `keap-utility /applyTags` | Endpoint equivalente gia' presente in `keap-utility` | `07-elementi-da-verificare.md §1.7` |
| CF-I-07 | Il nome del service binding in `prebooking` (`keap-utility` con trattino vs `KEAP_UTILITY` con underscore) e' gestito con pattern di fallback | Il codice usa `env["keap-utility"] \|\| env.KEAP_UTILITY` | `cloudflare/workers/prebooking.md` |

### 1.2 Storage e configurazione

| # | Elemento inferito | Fonte inferenza | Documento di riferimento |
|---|-------------------|-----------------|--------------------------|
| CF-I-08 | Il KV `KEAP_TOKENS` ha un TTL di 12 ore per il token OAuth | Logica di refresh nel codice di `apertura-scheda` | `cloudflare/bindings-storage-env.md` |
| CF-I-09 | Il KV `LOGS_KV` ha un TTL di 30 giorni per i log operativi | Deduzione dalla funzione di log di `apertura-scheda` | `cloudflare/bindings-storage-env.md` |
| CF-I-10 | Il backup del token OAuth su Airtable (AUTH_BASE_ID) e' usato solo per recovery manuale, non da nessun altro componente | Nessun altro worker legge da quella base Airtable | `keap/relazioni-keap-airtable-cloudflare.md §8.3` |

### 1.3 Cron e scheduling

| # | Elemento inferito | Fonte inferenza | Documento di riferimento |
|---|-------------------|-----------------|--------------------------|
| CF-I-11 | Il cron di `apt-monitor` (20:00 Europe/Rome) e' impostato come `0 18 * * *` in UTC | Conversione fuso orario | `cloudflare/cron-jobs.md` |
| CF-I-12 | Il cron orario di `sendapp-monitor` elabora i messaggi WhatsApp accodati nella D1 | Struttura del codice con polling D1 | `cloudflare/cron-jobs.md` |

---

## 2. Dominio Airtable

### 2.1 Struttura delle basi

| # | Elemento inferito | Fonte inferenza | Documento di riferimento |
|---|-------------------|-----------------|--------------------------|
| AT-I-01 | Le 4 basi Airtable (Arzano, Portici, Torre del Greco, Pomigliano) hanno struttura identica di tabelle e campi | Architettura multi-centro dichiarata; il codice usa gli stessi nomi campo in tutti i centri | `airtable/README.md` |
| AT-I-02 | Le tabelle presenti in ogni base includono: Clienti, Appuntamenti, Prebooking, Rendiconto, Riepilogo Mensile, Recensioni, Referral | Naming nelle query degli script | `airtable/mappa-tabelle-campi-relazioni.md` |
| AT-I-03 | La base Airtable di Pomigliano esiste ma non e' ancora configurata nel codice del worker | I campi `base` e `table` sono stringa vuota in `AIRTABLE_ROUTES["pomigliano"]` | `07-elementi-da-verificare.md §1.4` |
| AT-I-04 | La tabella `KeapAPIVars` contiene un solo record con ID fisso `recZqxq5Uji0ZTO5z` in tutte e 4 le basi | Il codice usa questo record ID hardcoded | `airtable/README.md` |
| AT-I-05 | Le 4 basi sono strutturalmente identiche ma fisicamente separate (non c'e' sincronizzazione automatica tra basi) | Nessun codice di sync trovato; ogni script opera sulla propria base | `keap/relazioni-keap-airtable-cloudflare.md §8.4` |

### 2.2 Accesso ai dati

| # | Elemento inferito | Fonte inferenza | Documento di riferimento |
|---|-------------------|-----------------|--------------------------|
| AT-I-06 | I nomi dei campi Airtable sono consistenti tra le 4 basi (stessi nomi, non ID) | Il codice usa `getCellValue("NomeCampo")` senza ID specifici per base | `airtable/mappa-tabelle-campi-relazioni.md` |
| AT-I-07 | Il campo `"Centro"` in `KeapAPIVars` e' impostato manualmente da un amministratore al momento del setup di ogni base | Nessun meccanismo automatico di impostazione trovato | `airtable/README.md` |

---

## 3. Dominio Keap CRM

### 3.1 Automazioni

| # | Elemento inferito | Fonte inferenza | Documento di riferimento |
|---|-------------------|-----------------|--------------------------|
| KP-I-01 | L'automazione 497 (Compleanni) e' triggerata dalla data di compleanno del contatto | Nome e categoria dell'automazione | `keap/inventario-automazioni.md` |
| KP-I-02 | L'automazione 353 (Feedback trimestrale) e' triggerata da tag o da data, con cadenza ~90 giorni | Nome "trimestrale" e tipo azioni | `keap/inventario-automazioni.md` |
| KP-I-03 | L'automazione 69 (MH – Salon Startup – 24 Marzo – Temp) e' disattivata poiche' l'evento e' passato | La data e' nel nome; il prefisso "Temp" suggerisce temporaneita' | `keap/inventario-automazioni.md` |
| KP-I-04 | L'automazione 17 (Contatti Salon Startup) e' irrilevante per NMV e probabilmente disattivata | Appartiene al brand MH (MarketingHero), non NMV | `keap/inventario-automazioni.md` |
| KP-I-05 | Le automazioni referral (319-343) hanno 0 contatti attivi perche' il programma referral e' in fase di lancio o uso limitato | Basso traffico referral rilevato | `keap/inventario-automazioni.md` |
| KP-I-06 | Gli step "Send HTTP Request" nelle automazioni 179 e 201 puntano a `sendapp-monitor` per l'invio WhatsApp | Coerenza architetturale; `sendapp-monitor` e' il proxy WhatsApp del sistema | `keap/relazioni-keap-airtable-cloudflare.md §4` |
| KP-I-07 | Al termine del flusso di automazione 179, il tag AT applicato viene rimosso per evitare rientri involontari | Pattern standard di tag lifecycle nel sistema | `keap/inventario-automazioni.md §2` |

### 3.2 Custom Fields

| # | Elemento inferito | Fonte inferenza | Documento di riferimento |
|---|-------------------|-----------------|--------------------------|
| KP-I-08 | Il campo 163 (Rinvii) viene incrementato da `apertura-scheda` ad ogni operazione di rinvio | Logica di business coerente con il nome del campo | `keap/custom-fields-e-mapping.md §2` |
| KP-I-09 | Il campo 167 (No-Show) viene incrementato in chiusura scheda se il cliente non si e' presentato | Logica di business; la chiusura scheda distingue "presente" / "assente" | `keap/custom-fields-e-mapping.md §2` |
| KP-I-10 | Il campo 239 (Apt Puntuale e premiata) conta le visite consecutive puntuali per la promo `puntuale_e_premiata` | Nome del campo e dello script correlato | `keap/custom-fields-e-mapping.md §2` |
| KP-I-11 | I gruppi A4 e A5 (campi 23 e 25) hanno solo 3 campi ciascuno anziche' 11, indicando che sono stati aggiunti in una fase successiva con meno metadati | Differenza strutturale rispetto ai gruppi A1-A3 | `keap/custom-fields-e-mapping.md §5-6` |

### 3.3 Tag e orchestrazione

| # | Elemento inferito | Fonte inferenza | Documento di riferimento |
|---|-------------------|-----------------|--------------------------|
| KP-I-12 | Il tag 347 (`S – NMV – Bassa Frequenza Messaggi`) e' usato come condizione di uscita nelle automazioni 179 e 201 per ridurre le comunicazioni ai contatti che lo richiedono | Referenziato nel report automazioni come filtro; non trovato nel codice dei worker | `keap/inventario-tags.md §2` |
| KP-I-13 | Il tag 385 (`S – NMV – Promo – Puntuale e premiata`) e' applicato manualmente o da un'automazione ai contatti idonei alla promo, non dai worker | Non trovato nel codice dei worker/script | `keap/inventario-tags.md §2` |
| KP-I-14 | Il tag 359 (`AT – NMV – Rinvia senza messaggio`) evita che l'automazione 179 invii il messaggio di reminder in caso di rinvio operativo interno | Semantica del nome; usato da `apertura-scheda` con flag `noMsg=true` | `keap/inventario-tags.md §1` |
| KP-I-15 | I tag di data auto-generati (category 19 e 37, IDs 147-411) sono artefatti di test inviati dalla piattaforma Keap, non hanno utilizzo operativo | Nomi in formato datetime; assenti nel codice | `keap/inventario-tags.md §8` |

### 3.4 OAuth e autenticazione

| # | Elemento inferito | Fonte inferenza | Documento di riferimento |
|---|-------------------|-----------------|--------------------------|
| KP-I-16 | Il refresh token OAuth per `apertura-scheda` e' archiviato come secret Cloudflare e ha durata molto lunga (mesi o anni) | Comportamento standard OAuth Keap; il codice fa refresh automatico dell'access token | `keap/README.md §2.4` |
| KP-I-17 | Se il refresh token scade, l'intero flusso di apertura/chiusura/rinvio/annullamento scheda si interrompe immediatamente | Dipendenza critica da un singolo segreto | `07-elementi-da-verificare.md §2.3` |

---

## 4. Relazioni inter-sistema

| # | Elemento inferito | Fonte inferenza | Documento di riferimento |
|---|-------------------|-----------------|--------------------------|
| IS-I-01 | Keap e' il sistema di record per i dati dei contatti; Airtable e' l'interfaccia operativa; Cloudflare e' lo strato di integrazione | Flusso dei dati: Airtable legge da Keap tramite Cloudflare | `01-panorama-sistema.md` |
| IS-I-02 | Non esiste sincronizzazione bidirezionale tra Keap e Airtable: i dati vengono scritti su Keap dai worker, ma Airtable non aggiorna automaticamente i propri record dai dati Keap | Nessun meccanismo di polling o webhook da Keap verso Airtable trovato | `03-flussi-end-to-end.md` |
| IS-I-03 | Gli script Airtable eseguono una lettura del record Keap tramite `getcontactinfo` o `find-contact-id` solo all'apertura della scheda, non in tempo reale | Pattern di lettura una-tantum al click del pulsante | `airtable/inventario-script-airtable.md` |
| IS-I-04 | Il sistema non ha un layer di autenticazione tra Airtable e i worker Cloudflare: chiunque conosca l'URL del worker potrebbe chiamarlo | `remoteFetchAsync` non invia header di autenticazione Airtable-side | `cloudflare/sicurezza-configurazione.md` |

---

## 5. Riepilogo quantitativo

| Dominio | Elementi inferiti | Documenti di riferimento |
|---------|------------------|--------------------------|
| Cloudflare Workers | 12 (CF-I-01 … CF-I-12) | `cloudflare/`, `07-elementi-da-verificare.md` |
| Airtable | 7 (AT-I-01 … AT-I-07) | `airtable/`, `07-elementi-da-verificare.md` |
| Keap CRM | 17 (KP-I-01 … KP-I-17) | `keap/`, `keap-backup/` |
| Relazioni inter-sistema | 4 (IS-I-01 … IS-I-04) | `01-panorama-sistema.md`, `03-flussi-end-to-end.md` |
| **Totale** | **40** | |

---

## 6. Come usare questo documento

1. **Prima di modificare un componente** — verificare se esistono elementi inferiti relativi a quel componente (colonna "Fonte inferenza") che potrebbero invalidare le assunzioni.
2. **Durante l'onboarding tecnico** — questo documento evidenzia le zone grigie del sistema, utili per capire dove la documentazione non e' certa.
3. **Per la prioritizzazione delle verifiche** — combinare questo documento con `../../07-elementi-da-verificare.md` che classifica gli stessi elementi per priorita' operativa.
