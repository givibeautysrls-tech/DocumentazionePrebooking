# 06 — Rischi e Debito Tecnico

> Ultima revisione: 2026-03-26

Questo documento cataloga i rischi tecnici, i bug noti e le aree di debito tecnico identificate nel sistema GiVi Beauty / NMV. Ogni voce e' classificata con il livello di confidenza della fonte.

---

## 1. Workers legacy / duplicati

### 1.1 `leadgen` (sostituito da `lead-handler`)

Il worker `leadgen` (backup: `workers-backup/leadgen/`) contiene il codice completo per la gestione lead da Facebook: verifica HMAC, integrazione Graph API, creazione contatto Keap via service binding, salvataggio Airtable e applicazione tag 361. Tuttavia, la documentazione lo identifica come **legacy**, sostituito dal worker attualmente deployato come `lead-handler`. [Inferito da contesto]

**Rischio:** Il nome `leadgen` nel backup contiene in realta' il codice piu' recente e completo (~544 righe), mentre la directory `lead-handler/` nel backup contiene il worker piu' vecchio e semplice (~160 righe, solo Airtable + Pushover + SendApp). Questa inversione di nomi puo' creare confusione in fase di manutenzione o ripristino. [Confermato da codice]

**Azione consigliata:** Verificare quale codice e' effettivamente in produzione e allineare i nomi. Dismettere il worker non utilizzato.

### 1.2 `prebooking` (parzialmente sostituito da `apertura-scheda`)

Il worker `prebooking` espone route `/setAppointment`, `/cancelAppointment/{id}`, `/resetAppointment/{id}` e `/setOpportunity`. Di queste, `/setAppointment` e `/setOpportunity` contengono handler vuoti (commento nel codice, nessuna logica implementata). Solo `/cancelAppointment` e `/resetAppointment` hanno implementazione funzionante (notifiche Pushover). [Confermato da codice]

Il worker `apertura-scheda` ha assunto la gestione completa del ciclo prebooking con funzionalita' molto piu' ricche. [Confermato da codice]

**Rischio:** Se `prebooking` e' ancora raggiungibile in produzione, potrebbe ricevere chiamate dirette da automazioni Keap (HTTP Request) per annullamenti/rinvii, creando un percorso parallelo non monitorato. [Inferito da contesto]

**Azione consigliata:** Verificare se `prebooking` riceve ancora traffico. Se no, disattivarlo. Se si', migrare le chiamate verso `apertura-scheda`.

---

## 2. Bug noti

### 2.1 Typo `contatti.lenght` in `find-contact-id`

**File:** `workers-backup/workers-backup/find-contact-id/worker.js`, linea 94

```js
const trovato = contatti.lenght === 1 || contatti.find(c => {
```

Il campo `contatti.lenght` e' un typo di `contatti.length`. In JavaScript, accedere a una proprieta' inesistente restituisce `undefined`, quindi `undefined === 1` e' sempre `false`. [Confermato da codice]

**Impatto:** Se Keap restituisce esattamente un contatto, la condizione di cortocircuito non funziona. Il codice cade nel fallback `contatti.find(...)` che confronta i numeri di telefono. Se il numero non corrisponde (ad esempio per differenze di formattazione), il contatto non viene trovato anche se era l'unico risultato. Quando `contatti.find` riesce, restituisce l'oggetto contatto e il `trovato.id` alla riga 109 funziona correttamente. Ma se avesse funzionato il cortocircuito `contatti.lenght === 1`, `trovato` sarebbe `true` (un booleano), e `trovato.id` alla riga 109 restituirebbe `undefined`. Quindi il typo maschera un secondo bug logico. [Confermato da codice]

**Severita':** Media — il worker funziona solo grazie al fatto che il typo disabilita un ramo di codice che a sua volta ha un bug.

---

## 3. Configurazione Pomigliano incompleta

### 3.1 AIRTABLE_ROUTES per Pomigliano

Nel worker `leadgen` (codice che corrisponde al `lead-handler` attivo), la mappa `AIRTABLE_ROUTES` definisce:

```js
var AIRTABLE_ROUTES = {
  "arzano":          { base: "appMoFcRmbgI8rpH8", table: "tblNNPcer4NqOqrpM" },
  "portici":         { base: "appWPbF9yD2PtQrEm", table: "tbl21en6aDhgcD7T0" },
  "torre del greco": { base: "appCVqkej3tDupAQP", table: "tblL6YNidW44GXBEq" },
  "pomigliano":      { base: "", table: "" }
};
```

[Confermato da codice]

**Impatto:** I lead provenienti dal centro di Pomigliano vengono creati correttamente su Keap (il contatto e' creato con custom field Centro=Pomigliano e i tag vengono applicati), ma il record **non viene salvato su Airtable** perche' base e table sono stringhe vuote. La chiamata API ad Airtable fallira' con URL malformato. [Confermato da codice]

**Severita':** Alta — perdita di dati lead per il centro Pomigliano.

---

## 4. SendApp Instance ID inconsistenza

Due worker utilizzano mappe diverse per il SendApp Instance ID di Pomigliano:

| Worker | Contesto | Pomigliano Instance ID |
|--------|----------|----------------------|
| `leadgen` / lead-handler attivo | `sendappUser` nella funzione `handleLead` | `68BFEBB41DDD0` |
| `apertura-scheda` | `CONFIG.CENTRO_TO_SENDAPP` | `6926D352155D3` |

[Confermato da codice]

**Impatto:** Il custom field 165 (`IstanceIDSendapp`) del contatto Keap viene impostato con valori diversi a seconda che il contatto venga creato dal flusso lead (lead-handler) o dal flusso apertura scheda. Se il valore corretto e' cambiato nel tempo, i contatti creati dal worker con l'ID obsoleto avranno un'istanza SendApp errata, impedendo la ricezione dei messaggi WhatsApp. [Confermato da codice]

**Severita':** Alta — potenziale interruzione delle comunicazioni WhatsApp per i clienti di Pomigliano.

**Nota:** Per gli altri 3 centri (Portici, Arzano, Torre del Greco) gli ID sono coerenti tra i due worker. [Confermato da codice]

---

## 5. CORS inconsistente

| Worker | CORS Allow-Origin | Fonte |
|--------|-------------------|-------|
| `applytags` | `https://promoepilazione.it` | [Confermato da codice] |
| `find-contact-id` | `https://promoepilazione.it` | [Confermato da codice] |
| `getcontactinfo` | `*` (in risposta OK), `https://promoepilazione.it` (in errore catch) | [Confermato da codice] |
| `keap-utility` | `*` | [Confermato da codice] |
| `prebooking` | `*` | [Confermato da codice] |
| `lead-handler` (vecchio) | `*` | [Confermato da codice] |
| `leadgen` (attivo) | Nessun header CORS per `/moduli`; `*` per `/form` | [Confermato da codice] |
| `apertura-scheda` | Non rilevato negli estratti esaminati | [Da verificare] |
| `linkforreferral` | Limitato a `promoepilazione.it` | [Da verificare] |
| `sendapp-monitor` | Non rilevato | [Da verificare] |
| `apt-monitor` | Non rilevato | [Da verificare] |

**Rischio:** La mancanza di una policy CORS uniforme crea:
- **Rischio di sicurezza**: Workers con `*` accettano richieste da qualsiasi origine, inclusi siti malevoli. In particolare `keap-utility` espone operazioni CRUD su Keap senza restrizioni di origine. [Confermato da codice]
- **Rischio di funzionalita'**: Workers con CORS restrittivo potrebbero bloccare chiamate legittime da nuovi domini.

---

## 6. Token refresh centralizzato solo in `apertura-scheda`

Il meccanismo di refresh automatico del token OAuth Keap e' implementato esclusivamente nel worker `apertura-scheda`:

- Utilizza KV store `KEAP_TOKENS` per memorizzare access_token, refresh_token e timestamp dell'ultimo refresh
- Il TTL del token e' configurato a 12 ore (`TOKEN_TTL_MS: 12 * 60 * 60 * 1000`)
- In caso di fallimento del refresh, effettua fallback su `env.KEAP_PAK` (Personal Access Key)
- Esegue backup del token aggiornato su Airtable (`AUTH_BASE_ID`, `AUTH_RECORD_ID`)

[Confermato da codice]

**Impatto:** Gli altri worker che necessitano di autenticazione Keap utilizzano approcci diversi:

| Worker | Metodo di autenticazione |
|--------|--------------------------|
| `apertura-scheda` | OAuth con refresh automatico + fallback PAK |
| `keap-utility` | `env.KEAP_ACCESS_TOKEN` statico (nessun refresh) |
| `applytags` | `env.KEAP_API_KEY` (PAK) |
| `find-contact-id` | `env.KEAP_API_KEY` (PAK) |
| `getcontactinfo` | `env.KEAP_API_KEY` (PAK) |

[Confermato da codice]

Se il token OAuth di `keap-utility` scade e nessuno lo aggiorna manualmente, tutte le operazioni che passano per il service binding (lead-handler, prebooking, apt-monitor) falliranno silenziosamente. [Confermato da codice]

---

## 7. Hardcoded IDs ovunque

Tutti gli identificatori critici sono hardcoded direttamente nel codice sorgente:

| Tipo | Esempi | Worker/Script |
|------|--------|---------------|
| Tag IDs | 285, 287, 289, 291, 293, 295, 297, 299, 301, 303, 307, 309, 311, 313, 315, 317, 333, 335, 337, 355, 357, 361, 365, 367, 369, 371, 373, 375, 377, 379, 381, 383, 387 | `apertura-scheda`, `leadgen`, `linkforreferral`, scripts Airtable |
| Custom Field IDs | 41, 133, 135, 137, 139, 141, 143, 145, 147, 151, 153, 157, 159, 163, 165, 167, 171, 173, 177, 179, 181, 185, 187, 189, 191, 193, 195, 197, 199, 201, 203, 207, 209, 213, 215, 217, 219, 221, 225, 227, 229, 231, 233, 235, 237, 239 | `apertura-scheda`, `leadgen` |
| Airtable Base IDs | `appMoFcRmbgI8rpH8`, `appWPbF9yD2PtQrEm`, `appCVqkej3tDupAQP` | `leadgen` |
| Airtable Table IDs | `tblNNPcer4NqOqrpM`, `tbl21en6aDhgcD7T0`, `tblL6YNidW44GXBEq` | `leadgen` |
| SendApp Instance IDs | `67F7E1DA0EF73`, `67EFB424D2353`, `67EFB605B93A1`, `6926D352155D3`, `68BFEBB41DDD0` | `apertura-scheda`, `leadgen` |

[Confermato da codice]

**Rischio:** La modifica di un ID su Keap o Airtable richiede intervento manuale su tutti i file sorgente che lo referenziano. Non esiste un file di configurazione centralizzato ne' un sistema di environment variables per questi valori.

---

## 8. Nessun test automatizzato

Non esiste alcuna suite di test (unit, integration, e2e) per nessun componente del sistema:

- Nessun file `*.test.js` o `*.spec.js` nei backup dei worker
- Nessun framework di test nelle dipendenze (`package.json` contiene solo il nome e la versione)
- Nessun script npm per l'esecuzione dei test
- Nessun file di configurazione per test runner (jest, vitest, mocha, etc.)

[Confermato da codice]

**Rischio:** Ogni modifica al codice puo' introdurre regressioni non rilevabili prima del deployment. Il bug `contatti.lenght` (Sezione 2.1) ne e' un esempio concreto.

---

## 9. Nessun versionamento dei workers

I backup nella directory `workers-backup/` sono copie statiche dei file deployati, senza:

- Repository Git associato
- Storico delle modifiche
- Pipeline CI/CD
- Meccanismo di rollback automatico

[Inferito da contesto]

**Rischio:** In caso di deployment errato, il rollback richiede la copia manuale di un backup precedente. Non c'e' tracciabilita' di chi ha modificato cosa e quando.

---

## 10. Slot appuntamento limitati a 5

Il sistema gestisce un massimo di 5 appuntamenti contemporanei per contatto, denominati A1-A5. La configurazione `APPOINTMENT_FIELDS` in `apertura-scheda` definisce esattamente 5 slot:

```js
APPOINTMENT_FIELDS: {
  1: { trattamenti: 133, data: 185, ora: 173 },
  2: { trattamenti: 135, ora: 177, data: 179 },
  3: { trattamenti: 137, ora: 181, data: 187 },
  4: { trattamenti: 219, ora: 221, data: 225 },
  5: { trattamenti: 227, ora: 229, data: 231 }
}
```

[Confermato da codice]

Allo stesso modo, `APPOINTMENT_TAGS` definisce tag solo per A1-A5. [Confermato da codice]

**Impatto:** Se un cliente ha 5 appuntamenti attivi e ne viene creato un sesto, il worker non trovera' uno slot disponibile. Il comportamento in questo caso non e' documentato e dipende dalla logica di selezione slot del worker. [Confermato da codice]

**Nota:** La validazione in `validateAnnullaRequest` limita esplicitamente `numeroAppuntamento` a 1-4, non a 1-5, suggerendo che A5 potrebbe essere stato aggiunto successivamente senza aggiornare tutti i validatori. [Confermato da codice]

---

## 11. XML-RPC deprecation risk

Il worker `apertura-scheda` utilizza l'endpoint XML-RPC legacy di Keap per aggiornare i custom fields degli appuntamenti (ContactAction):

```js
XMLRPC: "https://api.infusionsoft.com/crm/xmlrpc/v1"
```

Questo endpoint viene usato per chiamate `DataService.update` sui record ContactAction, necessarie perche' la REST API v1/v2 non espone la scrittura diretta sui custom fields degli appuntamenti. [Confermato da codice]

**Rischio:** Keap ha gradualmente deprecato le API XML-RPC in favore delle REST API. Se l'endpoint venisse disabilitato, la scrittura dei campi `_Trattamenti`, `_Note`, `_Presente`, `_Rinviato`, `_Annullato`, `_DataRinvio` sugli appuntamenti non sarebbe piu' possibile. [Inferito da contesto]

---

## 12. Logging su KV con TTL 30 giorni

La funzione `saveLogToKV` in `apertura-scheda` salva i log delle operazioni nel KV store `LOGS_KV` con un TTL di 30 giorni:

```js
await env.LOGS_KV.put(key, JSON.stringify(log), {
  expirationTtl: 60 * 60 * 24 * 30  // 30 giorni
});
```

[Confermato da codice]

**Impatto:** Dopo 30 giorni, tutti i log vengono eliminati automaticamente da Cloudflare. Non esiste un meccanismo di archiviazione permanente o di esportazione periodica. Eventuali necessita' di audit o analisi storica oltre i 30 giorni non possono essere soddisfatte.

---

## 13. Assenza di rate limiting

Nessun worker implementa rate limiting sulle richieste in ingresso. [Confermato da codice]

**Rischio:**
- Un attaccante potrebbe inviare richieste in massa ai worker, consumando le quote Keap API (rate limit Keap: ~25 req/s)
- Attacchi DDoS sugli endpoint pubblici come `applytags` o `getcontactinfo` (che accettano richieste GET senza autenticazione)
- Costi imprevisti su Cloudflare Workers (piano a consumo)

---

## 14. Autenticazione debole

La maggior parte degli endpoint non richiede autenticazione:

| Worker | Autenticazione | Dettaglio |
|--------|---------------|-----------|
| `leadgen` (attivo) | HMAC SHA-256 | Solo per webhook Meta (`/moduli`). Verifica firma `x-hub-signature-256` con `env.APP_SECRET` |
| `lead-handler` (vecchio) | Nessuna | Accetta POST senza verifica |
| `applytags` | Nessuna | Accetta qualsiasi richiesta con `keapID` e `tagIDs` validi |
| `find-contact-id` | Nessuna | Accetta POST con nome, cognome e telefono |
| `getcontactinfo` | Nessuna | Accetta GET con `keapID` — restituisce tutti i dati del contatto inclusi custom fields |
| `keap-utility` | Nessuna | Proxy CRUD completo verso Keap |
| `prebooking` | Nessuna | Accetta POST per annullamenti e rinvii |
| `apertura-scheda` | Nessuna rilevata | [Da verificare] |
| `linkforreferral` | Nessuna | Crea contatti e applica tag |

[Confermato da codice]

**Rischio critico:** Chiunque conosca l'URL di `getcontactinfo` puo' estrarre tutti i dati personali dei clienti (nome, email, telefono, custom fields) semplicemente iterando sugli ID. Chiunque conosca l'URL di `applytags` puo' applicare tag arbitrari a qualsiasi contatto Keap, potenzialmente attivando automazioni indesiderate.

---

## Matrice di severita'

| # | Rischio | Severita' | Probabilita' | Impatto |
|---|---------|-----------|-------------|---------|
| 2.1 | Bug `contatti.lenght` | Media | Alta | Ricerca contatti fallisce in edge case |
| 3.1 | Pomigliano Airtable vuoto | Alta | Alta | Perdita dati lead |
| 4 | SendApp ID inconsistente | Alta | Media | Mancata ricezione WhatsApp |
| 5 | CORS inconsistente | Media | Bassa | Sicurezza / funzionalita' |
| 6 | Token refresh centralizzato | Alta | Media | Interruzione servizio |
| 7 | Hardcoded IDs | Media | Media | Errori in manutenzione |
| 8 | Nessun test | Alta | Alta | Regressioni non rilevate |
| 10 | Limite 5 slot | Bassa | Bassa | Mancata gestione caso raro |
| 11 | XML-RPC deprecation | Alta | Bassa | Interruzione funzionalita' critica |
| 12 | Log TTL 30gg | Media | Media | Perdita dati audit |
| 13 | No rate limiting | Alta | Bassa | Abuso API / costi |
| 14 | Auth debole | Critica | Media | Esposizione dati personali |
