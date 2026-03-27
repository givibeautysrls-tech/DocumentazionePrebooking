# annulla_appuntamento.js -- Annullamento Appuntamento

## 1. Scopo

Annulla un appuntamento esistente. Comunica l'annullamento al Cloudflare Worker e marca il record Appuntamento come `Annullato = 1` su Airtable. [Confermato da codice]

## 2. Tabella di attivazione

**Appuntamenti** -- lo script viene attivato tramite pulsante sulla tabella Appuntamenti. [Confermato da codice]

```js
const aptRecord = await input.recordAsync("Record cliccato", appuntamentiTable);
```

## 3. Tabelle lette

| Tabella | Dati letti |
|---------|------------|
| Appuntamenti | Annullato, Cliente (linked), KeapID, NumAptKeap, Data e ora, Trattamento (linked), Incasso previsto [Confermato da codice] |
| Clienti | KeapID, Nome, Cognome [Confermato da codice] |
| KeapAPIVars | Centro [Confermato da codice] |

## 4. Tabelle scritte

| Tabella | Campi aggiornati |
|---------|-----------------|
| Appuntamenti | Annullato = 1 (via field ID `fldgLrYjQ3fWM5Rw2`) [Confermato da codice] |

## 5. Endpoint chiamati

| Endpoint | Metodo |
|----------|--------|
| `https://apertura-scheda.notifichegielvi.workers.dev/api/prebooking/annulla` | POST [Confermato da codice] |

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
    "dataEOra": "2026-03-26T10:00:00.000Z",
    "trattamenti": "Taglio, Piega",
    "incassoPrevisto": 50
  }
}
```
[Confermato da codice] -- struttura ricostruita dal codice, i valori sono esemplificativi.

## 7. Campi aggiornati dopo risposta worker

| Campo | Tabella | Valore |
|-------|---------|--------|
| Annullato | Appuntamenti | `1` [Confermato da codice] |

## 8. Tag applicati

Nessun tag viene applicato direttamente dallo script. [Confermato da codice] La gestione dei tag e' delegata al worker. [Inferito da contesto]

## 9. Flusso logico

1. **Configurazione:** Legge Centro da `KeapAPIVars` [Confermato da codice]
2. **Recupero record:** Ottiene il record Appuntamento cliccato [Confermato da codice]
3. **Controllo duplicato:** Verifica che l'appuntamento non sia gia' annullato [Confermato da codice]
4. **Raccolta dati cliente:** Legge KeapID (obbligatorio), Nome, Cognome [Confermato da codice]
5. **Verifica KeapID:** L'appuntamento deve avere KeapID e NumAptKeap [Confermato da codice]
6. **Raccolta dati appuntamento:** Data e ora, trattamenti, incasso previsto [Confermato da codice]
7. **Chiamata worker:** Invia il payload [Confermato da codice]
8. **Marca annullato:** Imposta `Annullato = 1` sull'appuntamento [Confermato da codice]
9. **Output:** Mostra riepilogo con dati cliente, data, trattamenti e incasso [Confermato da codice]

## 10. Validazioni e controlli

| Controllo | Messaggio errore | Blocca esecuzione |
|-----------|-----------------|-------------------|
| Record mancante | "Riprova" | Si [Confermato da codice] |
| Appuntamento gia' annullato | "Appuntamento gia' annullato" | Si [Confermato da codice] |
| Cliente mancante | "Nessun cliente allegato all'appuntamento" | Si [Confermato da codice] |
| Cliente senza KeapID | "Cliente non ha Keap ID" | Si [Confermato da codice] |
| Appuntamento senza KeapID | "Appuntamento non ha Keap ID" | Si [Confermato da codice] |
| NumAptKeap mancante | "Numero appuntamento mancante" | Si [Confermato da codice] |

## 11. Criticita' e note

- **Field ID hardcoded:** Come chiusura_scheda.js, utilizza field ID per l'accesso ai campi di Appuntamenti e Clienti. [Confermato da codice]
- **Trattamenti opzionali:** Se non ci sono trattamenti collegati, il campo viene impostato a `"N/D"` (non blocca l'esecuzione, a differenza di rinvio_appuntamento). [Confermato da codice]
- **Nessun rollback:** Lo script non prevede meccanismi di rollback. Se la chiamata al worker ha successo ma l'aggiornamento Airtable fallisce, lo stato potrebbe risultare inconsistente (annullato su Keap ma non su Airtable). [Inferito da contesto]
- **Non chiede conferma:** A differenza di altri script, non chiede conferma all'utente prima di procedere con l'annullamento. [Confermato da codice]
