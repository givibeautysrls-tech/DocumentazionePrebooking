# chiusura_scheda.js -- Chiusura Scheda Prebooking

## 1. Scopo

Chiude una scheda di prebooking. Gestisce la marcatura di presenza del cliente, la registrazione degli acquisti (prodotti e trattamenti), il collegamento automatico al rendiconto giornaliero, e opzionalmente la registrazione del prossimo appuntamento su Keap. E' lo script piu' complesso del sistema (~534 righe). [Confermato da codice]

## 2. Tabella di attivazione

**Prebooking** -- lo script viene attivato tramite pulsante sulla tabella Prebooking. [Confermato da codice]

```js
const prebookingRecord = await input.recordAsync("Record cliccato", prebookingTable);
```

## 3. Tabelle lette

| Tabella | Dati letti |
|---------|------------|
| Prebooking | Cliente, Appuntamento, Prossimo Appuntamento, Acquisto (tutti linked) [Confermato da codice] |
| Clienti | KeapID, Nome, Cognome, Email, Telefono [Confermato da codice] |
| Appuntamenti | KeapID, Presente, Rinviato, Annullato, Data e ora, Trattamento, Incasso previsto, Promozione, Prezzo promozione, NumAptKeap [Confermato da codice] |
| Acquisti | Totale, Importo Contanti, Importo POS, Prodotti (linked), Trattamenti (linked), Data, Pagato con Gift Card [Confermato da codice] |
| Acquisti Prodotti | Prodotto (linked) [Confermato da codice] |
| Prodotti | Nome [Confermato da codice] |
| Rendiconto | Data, Incassi (linked) [Confermato da codice] |
| KeapAPIVars | Centro [Confermato da codice] |

## 4. Tabelle scritte

| Tabella | Campi aggiornati | Condizione |
|---------|-----------------|------------|
| Prebooking | Esito Prebooking | Sempre (con messaggio di successo o errore) [Confermato da codice] |
| Appuntamenti | KeapID, NumAptKeap | Sul prossimo appuntamento, se registrato dal worker [Confermato da codice] |
| Rendiconto | Incassi | Collega l'acquisto al rendiconto della stessa data [Confermato da codice] |

## 5. Endpoint chiamati

| Endpoint | Metodo |
|----------|--------|
| `https://apertura-scheda.notifichegielvi.workers.dev/api/prebooking/chiusura` | POST [Confermato da codice] |

## 6. Payload inviato

```json
{
  "centro": "Arzano",
  "cliente": {
    "id": "<airtable record ID>",
    "keapId": "<keap ID>",
    "nome": "Maria",
    "cognome": "Rossi",
    "email": "maria@example.com",
    "telefono": "+39..."
  },
  "presente": true,
  "appuntamento": {
    "id": "<airtable record ID>",
    "keapId": "<keap ID>",
    "presente": true
  },
  "acquisto": {
    "totale": 80,
    "importoContanti": 30,
    "importoPos": 50,
    "prodotti": ["Shampoo XYZ", "Crema ABC"],
    "trattamenti": ["Taglio", "Piega"]
  },
  "prossimoAppuntamento": {
    "id": "<airtable record ID>",
    "dataEOra": "2026-04-02T10:00:00.000Z",
    "trattamenti": "Colore, Piega",
    "incassoPrevisto": 60,
    "promozione": false,
    "prezzoPromo": null
  }
}
```
[Confermato da codice] -- struttura ricostruita dal codice, i valori sono esemplificativi. I campi `appuntamento`, `acquisto` e `prossimoAppuntamento` sono tutti opzionali.

## 7. Campi aggiornati dopo risposta worker

| Campo | Tabella | Valore | Condizione |
|-------|---------|--------|------------|
| KeapID | Appuntamenti (prossimo) | `result.prossimoAppuntamento.keapId` | Se prossimo appuntamento registrato [Confermato da codice] |
| NumAptKeap | Appuntamenti (prossimo) | `result.prossimoAppuntamento.numeroAppuntamento` | Se prossimo appuntamento registrato [Confermato da codice] |
| Esito Prebooking | Prebooking | Messaggi di successo/errore | Sempre [Confermato da codice] |
| Incassi | Rendiconto | Aggiunge acquisto all'array linked | Se c'e' un acquisto [Confermato da codice] |

## 8. Tag applicati

Nessun tag viene applicato direttamente dallo script. [Confermato da codice] La gestione dei tag e' delegata al worker. [Inferito da contesto]

## 9. Flusso logico

1. **Configurazione:** Legge Centro da `KeapAPIVars` [Confermato da codice]
2. **Recupero record:** Ottiene il record Prebooking cliccato [Confermato da codice]
3. **Blocco per rinvio/annullamento:** Se l'appuntamento e' gia' rinviato o annullato, scrive l'esito sul Prebooking e blocca l'esecuzione [Confermato da codice]
4. **Raccolta dati cliente:** Legge KeapID (obbligatorio), Nome, Cognome, Email, Telefono [Confermato da codice]
5. **Validazione presenza:** Se c'e' un appuntamento, verifica che il campo "Presente" sia true. Altrimenti blocca con messaggio esplicativo [Confermato da codice]
6. **Raccolta acquisto (opzionale):**
   - Legge totale, importi contanti/POS, flag gift card [Confermato da codice]
   - Validazione: totale obbligatorio (a meno che non sia gift card) [Confermato da codice]
   - Validazione: totale > 0 e gift card sono mutuamente esclusivi [Confermato da codice]
   - Carica prodotti tramite Acquisti Prodotti --> Prodotti [Confermato da codice]
   - Carica trattamenti acquistati [Confermato da codice]
   - Validazione: almeno un prodotto o trattamento deve essere presente [Confermato da codice]
7. **Prossimo appuntamento (opzionale):**
   - Se collegato, verifica che non abbia gia' un KeapID (evita duplicati) [Confermato da codice]
   - Validazione: data obbligatoria, trattamenti obbligatori [Confermato da codice]
   - Validazione promozione/prezzo promo coerenti [Confermato da codice]
8. **Conferma utente:** Se non c'e' appuntamento ma ci sono acquisti o prossimo appuntamento, chiede conferma con bottoni [Confermato da codice]
9. **Chiamata worker:** Invia il payload [Confermato da codice]
10. **Aggiornamento Rendiconto:** Se c'e' un acquisto, chiama `aggiornaRendiconto()` [Confermato da codice]
11. **Aggiornamento prossimo appuntamento:** Scrive KeapID e NumAptKeap se il worker li restituisce [Confermato da codice]
12. **Salvataggio esito:** Scrive i messaggi nel campo Esito Prebooking [Confermato da codice]

## 10. Validazioni e controlli

| Controllo | Messaggio errore | Blocca esecuzione |
|-----------|-----------------|-------------------|
| Appuntamento rinviato | "Appuntamento rinviato" (+ esito su Prebooking) | Si, con `return` [Confermato da codice] |
| Appuntamento annullato | "Appuntamento annullato" (+ esito su Prebooking) | Si, con `return` [Confermato da codice] |
| Cliente mancante | "Nessun cliente allegato al prebooking" | Si [Confermato da codice] |
| Cliente senza KeapID | "Cliente non ha Keap ID" | Si [Confermato da codice] |
| Presenza non marcata | "Cliente non presente" | Si [Confermato da codice] |
| Totale acquisto mancante (non gift card) | "Inserisci l'importo dell'acquisto o segna il pagamento con Gift Card" | Si [Confermato da codice] |
| Totale > 0 con Gift Card | "Se segni un pagamento con gift card, il totale deve essere 0" | Si [Confermato da codice] |
| Acquisto senza prodotti/trattamenti | "Inserisci i prodotti o i trattamenti acquistati" | Si [Confermato da codice] |
| Prossimo appuntamento senza data | "Aggiungi data e ora del prossimo appuntamento" | Si [Confermato da codice] |
| Prossimo appuntamento senza trattamenti | "Aggiungi i trattamenti del prossimo appuntamento" | Si [Confermato da codice] |
| Promozione senza prezzo (prossimo appt) | "Promozione senza prezzo scontato" | Si [Confermato da codice] |
| Prezzo promo senza flag (prossimo appt) | "Prezzo scontato senza flag promozione" | Si [Confermato da codice] |
| Nessun dato da registrare | "Nessun appuntamento, nessun acquisto, nessun prossimo appuntamento" | Si [Confermato da codice] |

## 11. Criticita' e note

### Funzione aggiornaRendiconto()

Questa funzione e' definita localmente nello script (~righe 54-139). [Confermato da codice]

- Cerca il record Rendiconto che ha la stessa data dell'acquisto confrontando le date in formato ISO `YYYY-MM-DD` [Confermato da codice]
- Carica **tutti** i record della tabella Rendiconto per fare il match (`selectRecordsAsync` senza filtro) -- potenziale problema di performance su tabelle grandi [Confermato da codice]
- Verifica che l'acquisto non sia gia' collegato (evita duplicati) [Confermato da codice]
- Se non trova un record Rendiconto per la data, mostra un avviso ma **non** blocca l'esecuzione [Confermato da codice]

### Field ID hardcoded

Lo script utilizza **Field ID** (es. `fld05nAGn7hzGXE8K`) invece dei nomi dei campi per molte operazioni. [Confermato da codice] Questo rende lo script resistente a rinominazioni dei campi ma fragile se i field ID cambiano (evento raro).

Lista completa dei field ID usati:

```js
// Prebooking
"fld05nAGn7hzGXE8K"  // cliente
"fld9xVPrOS1MwPQpk"  // appuntamento
"fldZCd9ydPG3PIBfI"  // prossimoAppuntamento
"fld4yipezOekynfD0"  // acquisto
"fldOIdDCLwYCJlwBM"  // esito_prebooking

// Clienti
"flduX9mOEmzFPNTtY"  // keapid
"fldtD13XA83lWJ5aG"  // nome
"fldUNF7DWN2YiXH0s"  // cognome
"fldYWYDOoGU1VHbuu"  // email
"fldboBaTDHYpY3j1P"  // telefono

// Appuntamenti
"fldvzDLWzL8RL1aLy"  // keapid
"fld9Qq8FmixTn66nK"  // presente
"fldSFvsHEhGajIRnR"  // rinviato
"fldgLrYjQ3fWM5Rw2"  // annullato
"fldy0rOapheuBOwpY"  // data_e_ora
"fldWzEjFT7wUoCEDI"  // trattamento
"fld5nCiDy8X0o5ZHD"  // numaptkeap

// Acquisti
"fldsPsqmKzRGROEkE"  // totale
"fld2Q2iJvLi38m3Fn"  // importo_contanti
"fldXjhoChD9JTxP9J"  // importo_pos
"fldG8UcHREfmQdsai"  // prodotti
"fldNARYFKLL3xDncR"  // trattamenti
```
[Confermato da codice]

### Altre note

- **Conferma utente:** Se non c'e' appuntamento ma ci sono dati da registrare, lo script chiede conferma con `input.buttonsAsync` [Confermato da codice]
- **Errori salvati su Airtable:** In caso di errore dal worker, il messaggio viene scritto nel campo Esito Prebooking [Confermato da codice]
- **Blocco per rinvio/annullamento:** Lo script fa `return` (non `throw`) quando l'appuntamento e' rinviato o annullato, il che significa che l'esecuzione termina silenziosamente dopo aver scritto l'esito [Confermato da codice]
