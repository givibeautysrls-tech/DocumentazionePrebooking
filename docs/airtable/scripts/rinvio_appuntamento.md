# rinvio_appuntamento.js -- Rinvio Appuntamento

## 1. Scopo

Rinvia un appuntamento esistente a una nuova data. Comunica il rinvio al worker Cloudflare, marca il vecchio appuntamento come rinviato su Airtable, e crea automaticamente un nuovo record Appuntamento e un nuovo record Prebooking con i dati preservati dall'originale. [Confermato da codice]

## 2. Tabella di attivazione

**Appuntamenti** -- lo script viene attivato tramite pulsante sulla tabella Appuntamenti. [Confermato da codice]

```js
const aptRecord = await input.recordAsync("Record cliccato", appuntamentiTable);
```

## 3. Tabelle lette

| Tabella | Dati letti |
|---------|------------|
| Appuntamenti | KeapID, NumAptKeap, Rinviato, Data Rinvio, Data e ora, Trattamento (linked), Incasso previsto, Promozione, Prezzo promozione, Prepagato, Appuntamento preso da, Rinvia senza messaggio, Cliente (linked), Prebooking (Apertura Scheda) (linked) [Confermato da codice] |
| Clienti | KeapID, Nome, Cognome [Confermato da codice] |
| KeapAPIVars | Centro [Confermato da codice] |

## 4. Tabelle scritte

| Tabella | Operazione | Dettaglio |
|---------|------------|-----------|
| Appuntamenti (vecchio) | Update | `Rinviato = 1` [Confermato da codice] |
| Appuntamenti (nuovo) | Create | Nuovo record con: Cliente, Data Rinvio, Trattamento, KeapID (dal worker), NumAptKeap (dal worker), Promozione, Prezzo promozione (condizionale), Prepagato, Presente=false, Rinviato=0, Annullato=0, Appuntamento preso da [Confermato da codice] |
| Prebooking (esistente) | Update | Campo "Feedback Cliente" con motivo rinvio [Confermato da codice] |
| Prebooking (nuovo) | Create | Nuovo record con: Cliente, Appuntamento (il nuovo) [Confermato da codice] |

## 5. Endpoint chiamati

| Endpoint | Metodo |
|----------|--------|
| `https://apertura-scheda.notifichegielvi.workers.dev/api/prebooking/rinvio` | POST [Confermato da codice] |

## 6. Payload inviato

```json
{
  "centro": "Arzano",
  "cliente": {
    "id": "<airtable record ID>",
    "keapId": "<keap ID>",
    "nome": "Maria Rossi"
  },
  "appuntamento": {
    "id": "<airtable record ID>",
    "keapId": "<keap ID>",
    "numeroAppuntamento": 3,
    "dataVecchia": "2026-03-26T10:00:00.000Z",
    "trattamenti": "Taglio, Piega",
    "incassoPrevisto": 50
  },
  "rinvio": {
    "nuovaDataEOra": "2026-04-02T10:00:00.000Z",
    "motivoRinvio": "Non specificato",
    "noMessaggio": false
  },
  "motivazione": "La cliente ha chiesto di spostare per impegni familiari"
}
```
[Confermato da codice] -- struttura ricostruita dal codice, i valori sono esemplificativi.

**Nota:** Il campo `rinvio.motivoRinvio` e' sempre impostato a `"Non specificato"` nel codice, mentre il motivo effettivo digitato dall'utente viene inviato nel campo `motivazione` di primo livello. [Confermato da codice]

## 7. Campi aggiornati dopo risposta worker

| Campo | Tabella | Valore | Condizione |
|-------|---------|--------|------------|
| Rinviato | Appuntamenti (vecchio) | `1` | Sempre [Confermato da codice] |
| KeapID | Appuntamenti (nuovo) | `result.appuntamentoNuovo.keapId` | Se il worker restituisce il nuovo appuntamento [Confermato da codice] |
| NumAptKeap | Appuntamenti (nuovo) | `result.appuntamentoNuovo.numeroAppuntamento` | Se il worker restituisce il nuovo appuntamento [Confermato da codice] |
| Feedback Cliente | Prebooking (esistente) | `"RINVIATO: " + motivo` | Sempre [Confermato da codice] |

## 8. Tag applicati

Nessun tag viene applicato direttamente dallo script. [Confermato da codice] I tag sono gestiti dal worker. [Inferito da contesto]

## 9. Flusso logico

1. **Configurazione:** Legge Centro da `KeapAPIVars` [Confermato da codice]
2. **Recupero record:** Ottiene il record Appuntamento cliccato [Confermato da codice]
3. **Controllo duplicato:** Verifica che l'appuntamento non sia gia' rinviato [Confermato da codice]
4. **Verifica data rinvio:** Controlla che il campo "Data Rinvio" sia valorizzato [Confermato da codice]
5. **Raccolta dati cliente:** Legge KeapID (obbligatorio), Nome, Cognome [Confermato da codice]
6. **Verifica KeapID appuntamento:** L'appuntamento deve avere KeapID e NumAptKeap (la scheda deve essere aperta) [Confermato da codice]
7. **Input motivo:** Chiede all'utente il motivo del rinvio tramite `input.textAsync` [Confermato da codice]
8. **Aggiornamento Prebooking:** Scrive il motivo nel campo "Feedback Cliente" del prebooking originale [Confermato da codice]
9. **Raccolta dati appuntamento:** Data vecchia, trattamenti, incasso previsto, promozione, prepagato, operatrice [Confermato da codice]
10. **Chiamata worker:** Invia il payload [Confermato da codice]
11. **Marca vecchio appuntamento:** Imposta `Rinviato = 1` [Confermato da codice]
12. **Crea nuovo appuntamento:** Con tutti i dati preservati + KeapID dal worker [Confermato da codice]
13. **Crea nuovo Prebooking:** Collegato al nuovo appuntamento [Confermato da codice]

## 10. Validazioni e controlli

| Controllo | Messaggio errore | Blocca esecuzione |
|-----------|-----------------|-------------------|
| Record mancante | "Riprova" | Si [Confermato da codice] |
| Appuntamento gia' rinviato | "Appuntamento gia' rinviato al {data}" | Si [Confermato da codice] |
| Data Rinvio mancante | "Data di rinvio non presente" | Si [Confermato da codice] |
| Cliente mancante | "Nessun cliente allegato all'appuntamento" | Si [Confermato da codice] |
| Cliente senza KeapID | "Cliente non ha Keap ID, controlla che la scheda sia aperta" | Si [Confermato da codice] |
| Appuntamento senza KeapID | "Appuntamento non ha Keap ID, controlla che la scheda sia aperta" | Si [Confermato da codice] |
| NumAptKeap mancante | "Numero appuntamento mancante, controlla che la scheda sia aperta" | Si [Confermato da codice] |
| Trattamenti mancanti | "Nessun trattamento associato" | Si [Confermato da codice] |

## 11. Criticita' e note

- **Dati preservati nel nuovo appuntamento:** Promozione, Prezzo promozione (solo se promozione attiva), Prepagato, Operatrice ("Appuntamento preso da") vengono copiati dall'appuntamento originale. [Confermato da codice]
- **Prezzo promozione condizionale:** Viene incluso nel nuovo appuntamento solo se `isPromozione` e' true, tramite spread operator condizionale: `...(isPromozione && { "Prezzo promozione": prezzoPromozionale })` [Confermato da codice]
- **Motivo rinvio:** Esiste una discrepanza: il campo `rinvio.motivoRinvio` e' hardcoded a `"Non specificato"`, mentre il motivo reale va nel campo `motivazione`. [Confermato da codice]
- **Aggiornamento prebooking anticipato:** L'update al campo "Feedback Cliente" viene lanciato **prima** della chiamata al worker (senza `await`), il che significa che viene eseguito in parallelo alla raccolta dati successiva. [Confermato da codice]
- **Campo "Rinvia senza messaggio":** Viene letto e inviato al worker come `noMessaggio`, ma non influenza il comportamento lato script Airtable. Il worker decide se inviare o meno il messaggio. [Confermato da codice]
