# apertura_scheda.js -- Apertura Scheda Prebooking

## 1. Scopo

Apre una scheda di prebooking raccogliendo i dati del cliente, dell'appuntamento e dei trattamenti da eseguire, li invia al Cloudflare Worker per la creazione/aggiornamento su Keap, e scrive indietro su Airtable i Keap ID generati. [Confermato da codice]

## 2. Tabella di attivazione

**Prebooking** -- lo script viene attivato tramite pulsante sulla tabella Prebooking. [Confermato da codice]

```js
const prebookingRecord = await input.recordAsync("Record cliccato", prebookingTable);
```

## 3. Tabelle lette

| Tabella | Dati letti |
|---------|------------|
| Prebooking | Cliente (linked), Appuntamento (linked), Trattamenti da eseguire (linked), Data e ora [Confermato da codice] |
| Clienti | KeapID, Nome, Cognome, Email, Telefono [Confermato da codice] |
| Appuntamenti | KeapID, Promozione, Prezzo promozione, Incasso previsto, NumAptKeap, Appuntamento preso da [Confermato da codice] |
| Trattamenti | Nome [Confermato da codice] |
| KeapAPIVars | Centro (record `recZqxq5Uji0ZTO5z`) [Confermato da codice] |

## 4. Tabelle scritte

| Tabella | Campi aggiornati | Condizione |
|---------|-----------------|------------|
| Clienti | KeapID | Solo se il cliente non aveva KeapID e il worker lo restituisce [Confermato da codice] |
| Clienti | Email | Solo se mancante e il worker la restituisce [Confermato da codice] |
| Clienti | Telefono | Solo se mancante e il worker lo restituisce [Confermato da codice] |
| Appuntamenti | KeapID | Solo se l'appuntamento non aveva KeapID [Confermato da codice] |
| Appuntamenti | NumAptKeap | Solo se mancante [Confermato da codice] |
| Prebooking | _aperta | Impostato a `1` sempre [Confermato da codice] |

## 5. Endpoint chiamati

| Endpoint | Metodo |
|----------|--------|
| `https://apertura-scheda.notifichegielvi.workers.dev/api/prebooking` | POST [Confermato da codice] |

## 6. Payload inviato

```json
{
  "centro": "Arzano",
  "cliente": {
    "id": "<airtable record ID>",
    "keapId": "<keap ID o null>",
    "nome": "Maria",
    "cognome": "Rossi",
    "email": "maria@example.com",
    "telefono": "+39..."
  },
  "appuntamento": {
    "id": "<airtable record ID>",
    "keapId": "<keap ID o null>",
    "dataEOra": "2026-03-26T10:00:00.000Z",
    "trattamenti": "Taglio, Piega",
    "incassoPrevisto": 50,
    "promozione": false,
    "prezzoPromo": null,
    "numeroAppuntamento": null
  },
  "prebooking": {
    "id": "<airtable record ID>"
  }
}
```
[Confermato da codice] -- struttura ricostruita dal codice, i valori sono esemplificativi.

**Nota:** Il campo `appuntamento` puo' essere `null` se non c'e' un appuntamento collegato al prebooking. [Confermato da codice]

## 7. Campi aggiornati dopo risposta worker

| Campo | Tabella | Valore | Condizione |
|-------|---------|--------|------------|
| KeapID | Clienti | `result.cliente.keapId` | Se il cliente non aveva KeapID [Confermato da codice] |
| Email | Clienti | `result.cliente.email` | Se mancante lato Airtable [Confermato da codice] |
| Telefono | Clienti | `result.cliente.telefono` | Se mancante lato Airtable [Confermato da codice] |
| KeapID | Appuntamenti | `result.appuntamento.keapId` | Se l'appuntamento non aveva KeapID [Confermato da codice] |
| NumAptKeap | Appuntamenti | `result.numeroAppuntamento` | Se mancante [Confermato da codice] |
| _aperta | Prebooking | `1` | Sempre [Confermato da codice] |

## 8. Tag applicati

Nessun tag viene applicato direttamente dallo script. [Confermato da codice] I tag sono gestiti dal worker lato server. [Inferito da contesto]

## 9. Flusso logico

1. Legge il record ID di configurazione `recZqxq5Uji0ZTO5z` dalla tabella `KeapAPIVars` per ottenere il campo `Centro` [Confermato da codice]
2. Recupera il record Prebooking cliccato dall'utente [Confermato da codice]
3. Legge il Cliente collegato al Prebooking e raccoglie i dati anagrafici [Confermato da codice]
4. Se c'e' un Appuntamento collegato:
   - Valida la coerenza dei campi Promozione/Prezzo promozione [Confermato da codice]
   - Verifica la presenza di Data e ora [Confermato da codice]
   - Carica i Trattamenti da eseguire e ne estrae i nomi [Confermato da codice]
   - Verifica la presenza dell'operatrice [Confermato da codice]
5. Compone il payload e lo invia via POST al worker [Confermato da codice]
6. In caso di successo, aggiorna su Airtable i Keap ID ricevuti e marca il prebooking come aperto (`_aperta = 1`) [Confermato da codice]
7. Mostra i messaggi di conferma all'utente [Confermato da codice]

## 10. Validazioni e controlli

| Controllo | Messaggio errore | Blocca esecuzione |
|-----------|-----------------|-------------------|
| Record Prebooking mancante | "Riprova" | Si [Confermato da codice] |
| Cliente non collegato | "Nessun cliente nel Prebooking" | Si [Confermato da codice] |
| Promozione spuntata ma prezzo promo mancante | "Inserisci il prezzo scontato" | Si [Confermato da codice] |
| Prezzo promo presente ma promozione non spuntata | "Spunta 'Promozione' se inserisci un prezzo scontato" | Si [Confermato da codice] |
| Data e ora mancante | "Inserisci una data valida" | Si [Confermato da codice] |
| Nessun trattamento | "Inserisci almeno un trattamento" | Si [Confermato da codice] |
| Trattamenti non validi (nomi vuoti) | "Nessun trattamento valido" | Si [Confermato da codice] |
| Operatrice mancante | "Seleziona l'operatrice che ha preso l'appuntamento" | Si [Confermato da codice] |

## 11. Criticita' e note

- **Fallback Centro:** Se la tabella `KeapAPIVars` non ha il campo "Centro" valorizzato, il fallback e' `"Arzano"`. Questo potrebbe causare problemi se lo script viene eseguito in una base diversa da Arzano senza configurazione corretta. [Confermato da codice]
- **Data e ora:** Il campo `dataEOra` viene estratto come `lookupDate[0]`, presumendo che sia un array (probabilmente un lookup field). [Confermato da codice]
- **Aggiornamenti paralleli:** Tutti gli update finali vengono eseguiti con `Promise.all()`, il che e' efficiente ma potrebbe nascondere errori individuali. [Confermato da codice]
- **L'appuntamento e' opzionale:** Lo script puo' essere eseguito anche senza un appuntamento collegato (in quel caso `appuntamentoData = null`). [Confermato da codice]
