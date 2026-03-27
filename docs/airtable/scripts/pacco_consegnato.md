# pacco_consegnato.js -- Consegna Pacco Referral

## 1. Scopo

Registra la consegna del pacco referral a un cliente. Imposta il flag "Pacco Referral Ricevuto" a `true` sul record Clienti, applica il tag 357 su Keap, e incrementa il contatore "Pacchi Referral Consegnati" nell'ultima riga di Riepilogo Mensile. Include un meccanismo di rollback in caso di errore. [Confermato da codice]

## 2. Tabella di attivazione

**Recensioni e Referral** -- lo script viene attivato tramite pulsante sulla tabella Recensioni e Referral. [Confermato da codice]

```js
const mainRecord = await input.recordAsync('Seleziona la riga su cui hai cliccato il pulsante:', mainTable);
```

## 3. Tabelle lette

| Tabella | Dati letti |
|---------|------------|
| Recensioni e Referral | Cliente (linked) [Confermato da codice] |
| Clienti | KeapID, Pacco Referral Ricevuto [Confermato da codice] |
| Riepilogo Mensile | Pacchi Referral Consegnati (ultima riga) [Confermato da codice] |

## 4. Tabelle scritte

| Tabella | Campi aggiornati | Condizione |
|---------|-----------------|------------|
| Clienti | "Pacco Referral Ricevuto" = true | Sempre (con rollback a false in caso di errore) [Confermato da codice] |
| Riepilogo Mensile | "Pacchi Referral Consegnati" = valore precedente + 1 | Ultima riga [Confermato da codice] |

## 5. Endpoint chiamati

| Endpoint | Metodo | Scopo |
|----------|--------|-------|
| `https://applytags.notifichegielvi.workers.dev/?keapID=...&tagIDs=357` | GET | Applicazione tag 357 [Confermato da codice] |

## 6. Payload inviato

Chiamata GET con parametri in query string: [Confermato da codice]

```
GET https://applytags.notifichegielvi.workers.dev/?keapID=<keapID>&tagIDs=357
```

## 7. Campi aggiornati dopo risposta worker

| Campo | Tabella | Valore |
|-------|---------|--------|
| Pacco Referral Ricevuto | Clienti | `true` (o `false` in rollback) [Confermato da codice] |
| Pacchi Referral Consegnati | Riepilogo Mensile (ultima riga) | Valore precedente + 1 [Confermato da codice] |

## 8. Tag applicati

| Tag ID | Descrizione | Applicato a | Worker |
|--------|-------------|-------------|--------|
| 357 | Pacco referral consegnato | Cliente | applytags [Confermato da codice] |

## 9. Flusso logico

1. Recupera il record dalla tabella "Recensioni e Referral" [Confermato da codice]
2. Legge il Cliente collegato e il suo KeapID [Confermato da codice]
3. **Controllo duplicato:** Verifica che "Pacco Referral Ricevuto" non sia gia' `true` [Confermato da codice]
4. Imposta "Pacco Referral Ricevuto" = `true` sul record Clienti [Confermato da codice]
5. (Dentro try/catch con rollback):
   a. Applica il tag 357 tramite applytags worker [Confermato da codice]
   b. Recupera l'ultima riga di Riepilogo Mensile [Confermato da codice]
   c. Incrementa "Pacchi Referral Consegnati" di +1 [Confermato da codice]
6. Se qualsiasi operazione del punto 5 fallisce: **rollback** - riporta "Pacco Referral Ricevuto" a `false` [Confermato da codice]
7. Mostra messaggio di conferma [Confermato da codice]

## 10. Validazioni e controlli

| Controllo | Messaggio errore | Blocca esecuzione |
|-----------|-----------------|-------------------|
| Nessuna riga selezionata | "Nessuna riga selezionata" | Si [Confermato da codice] |
| Cliente non collegato | "La riga non ha un Cliente collegato" | Si [Confermato da codice] |
| Record cliente non leggibile | "Impossibile leggere il record Cliente collegato" | Si [Confermato da codice] |
| KeapID mancante | "Il Cliente collegato non ha KeapID valorizzato" | Si [Confermato da codice] |
| Pacco gia' ricevuto | "Il campo Pacco Referral Ricevuto e' gia' TRUE. Operazione annullata per evitare doppi conteggi" | Si [Confermato da codice] |
| Riepilogo Mensile vuoto | "La tabella Riepilogo Mensile e' vuota: impossibile incrementare il contatore" | Si [Confermato da codice] |

## 11. Criticita' e note

- **Meccanismo di rollback:** E' l'unico script con un rollback esplicito. Se il tagging o l'incremento del contatore falliscono, il campo "Pacco Referral Ricevuto" viene riportato a `false`. Questo garantisce consistenza tra stato Airtable e stato Keap. [Confermato da codice]
- **Rollback parziale:** Il rollback resetta solo il campo boolean su Clienti. Se il tag e' stato applicato con successo ma l'incremento del contatore fallisce, il tag rimane su Keap ma il flag viene resettato. [Confermato da codice]
- **Controllo duplicati:** A differenza di `referral_riscattato.js`, questo script verifica esplicitamente che il pacco non sia gia' stato segnato come consegnato, prevenendo doppi conteggi. [Confermato da codice]
- **"Ultima riga" di Riepilogo Mensile:** Stessa logica di `referral_riscattato.js` - usa l'ultimo elemento dell'array, che potrebbe non corrispondere al mese corrente se i record sono fuori ordine. [Confermato da codice]
- **Ordine operazioni:** Il campo boolean viene aggiornato **prima** del tagging, poi eventualmente rollbackato. Questo approccio "ottimistico" e' piu' sicuro del contrario (evita che il tag venga applicato senza il flag). [Confermato da codice]
