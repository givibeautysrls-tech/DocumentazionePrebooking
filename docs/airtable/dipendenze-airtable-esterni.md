# Dipendenze Esterne dagli Script Airtable

## Panoramica

Gli script Airtable non comunicano mai direttamente con le API Keap. [Confermato da codice] Tutte le interazioni con servizi esterni passano attraverso **Cloudflare Workers** tramite la funzione nativa `remoteFetchAsync` di Airtable. [Confermato da codice]

## Worker utilizzati

### 1. apertura-scheda.notifichegielvi.workers.dev

**URL base:** `https://apertura-scheda.notifichegielvi.workers.dev` [Confermato da codice]

Worker principale per la gestione del ciclo di vita dei prebooking. Espone i seguenti endpoint:

| Endpoint | Metodo | Usato da script | Descrizione |
|----------|--------|-----------------|-------------|
| `/api/prebooking` | POST | `apertura_scheda.js` | Apertura scheda: crea/aggiorna contatto e appuntamento su Keap [Confermato da codice] |
| `/api/prebooking/chiusura` | POST | `chiusura_scheda.js` | Chiusura scheda: registra presenza, acquisti, prossimo appuntamento [Confermato da codice] |
| `/api/prebooking/rinvio` | POST | `rinvio_appuntamento.js` | Rinvio appuntamento: aggiorna data su Keap, restituisce nuovo Keap ID [Confermato da codice] |
| `/api/prebooking/annulla` | POST | `annulla_appuntamento.js` | Annullamento appuntamento su Keap [Confermato da codice] |
| `/api/prebooking/sync-next-appointment` | POST | `puntuale_e_premiata.js` | Sincronizza prossimo appuntamento con Keap [Confermato da codice] |

**Protocollo di comunicazione:**
- Content-Type: `application/json` [Confermato da codice]
- Payload: oggetto JSON con `centro`, `cliente`, `appuntamento` e campi specifici per endpoint [Confermato da codice]
- Risposta: oggetto JSON con campo `success` (boolean), `messages` (array), ed eventuali dati di ritorno [Confermato da codice]

### 2. applytags.notifichegielvi.workers.dev

**URL base:** `https://applytags.notifichegielvi.workers.dev/` [Confermato da codice]

Worker dedicato all'applicazione di tag Keap ai contatti.

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `keapID` | Query string | ID del contatto Keap [Confermato da codice] |
| `tagIDs` | Query string | ID del tag da applicare [Confermato da codice] |

**Metodo:** GET [Confermato da codice]

**Usato da:**

| Script | Tag ID | Significato |
|--------|--------|-------------|
| `puntuale_e_premiata.js` | 387 | Promozione "Puntuale e Premiata" [Confermato da codice] |
| `referral_riscattato.js` | 337 | Referral riscattato (al cliente) [Confermato da codice] |
| `referral_riscattato.js` | 355 | Premio referral (al referrer) [Confermato da codice] |
| `pacco_consegnato.js` | 357 | Pacco referral consegnato [Confermato da codice] |
| `conferma_recensione.js` | 155 | Recensione inviata [Confermato da codice] |

## Funzione remoteFetchAsync

Tutti gli script utilizzano `remoteFetchAsync` fornita dall'ambiente di scripting Airtable. [Confermato da codice] Questa funzione ha la stessa interfaccia di `fetch()` standard:

```js
const response = await remoteFetchAsync(url, {
    method: "POST",  // oppure "GET"
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
});
```

**Nota:** gli script che usano il worker `applytags` effettuano una chiamata GET con parametri in query string, non POST con body JSON. [Confermato da codice]

## Mappa delle dipendenze

```
apertura_scheda.js -----> apertura-scheda worker /api/prebooking
chiusura_scheda.js -----> apertura-scheda worker /api/prebooking/chiusura
rinvio_appuntamento.js -> apertura-scheda worker /api/prebooking/rinvio
annulla_appuntamento.js > apertura-scheda worker /api/prebooking/annulla
puntuale_e_premiata.js -> apertura-scheda worker /api/prebooking/sync-next-appointment
                       +> applytags worker (tag 387)
referral_riscattato.js -> applytags worker (tag 337 + tag 355)
pacco_consegnato.js ----> applytags worker (tag 357)
conferma_recensione.js -> applytags worker (tag 155)
```

## Riepilogo tag Keap

| Tag ID | Nome/Scopo | Applicato a | Script |
|--------|------------|-------------|--------|
| 155 | Recensione inviata | Cliente | `conferma_recensione.js` [Confermato da codice] |
| 337 | Referral riscattato | Cliente referito | `referral_riscattato.js` [Confermato da codice] |
| 355 | Premio referral | Referrer (chi ha presentato) | `referral_riscattato.js` [Confermato da codice] |
| 357 | Pacco referral consegnato | Cliente | `pacco_consegnato.js` [Confermato da codice] |
| 387 | Puntuale e Premiata | Cliente | `puntuale_e_premiata.js` [Confermato da codice] |
