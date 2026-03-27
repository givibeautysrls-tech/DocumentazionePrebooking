# referral_riscattato.js -- Riscatto Referral

## 1. Scopo

Registra il riscatto di un referral. Applica il tag 337 al cliente referito e il tag 355 al cliente referente (chi lo ha presentato), e incrementa il contatore "Referral riscattati" nell'ultima riga della tabella Riepilogo Mensile. [Confermato da codice]

## 2. Tabella di attivazione

**Recensioni e Referral** -- lo script viene attivato tramite pulsante sulla tabella Recensioni e Referral. [Confermato da codice]

```js
const mainRecord = await input.recordAsync('Seleziona la riga su cui hai cliccato il pulsante:', mainTable);
```

## 3. Tabelle lette

| Tabella | Dati letti |
|---------|------------|
| Recensioni e Referral | Cliente (linked) [Confermato da codice] |
| Clienti | KeapID (del cliente), Presentata da (linked, per trovare il referrer), KeapID (del referrer) [Confermato da codice] |
| Riepilogo Mensile | Referral riscattati (ultima riga) [Confermato da codice] |

## 4. Tabelle scritte

| Tabella | Campi aggiornati |
|---------|-----------------|
| Riepilogo Mensile | "Referral riscattati" = valore precedente + 1 (ultima riga) [Confermato da codice] |

## 5. Endpoint chiamati

| Endpoint | Metodo | Scopo |
|----------|--------|-------|
| `https://applytags.notifichegielvi.workers.dev/?keapID=...&tagIDs=337` | GET | Tag 337 al cliente [Confermato da codice] |
| `https://applytags.notifichegielvi.workers.dev/?keapID=...&tagIDs=355` | GET | Tag 355 al referrer [Confermato da codice] |

## 6. Payload inviato

Entrambe le chiamate sono GET con parametri in query string: [Confermato da codice]

```
GET https://applytags.notifichegielvi.workers.dev/?keapID=<keapID>&tagIDs=337
GET https://applytags.notifichegielvi.workers.dev/?keapID=<referrerKeapID>&tagIDs=355
```

## 7. Campi aggiornati dopo risposta worker

| Campo | Tabella | Valore |
|-------|---------|--------|
| Referral riscattati | Riepilogo Mensile (ultima riga) | Valore precedente + 1 [Confermato da codice] |

## 8. Tag applicati

| Tag ID | Descrizione | Applicato a | Worker |
|--------|-------------|-------------|--------|
| 337 | Referral riscattato | Cliente referito | applytags [Confermato da codice] |
| 355 | Premio referral | Referrer ("Presentata da") | applytags [Confermato da codice] |

## 9. Flusso logico

1. Recupera il record dalla tabella "Recensioni e Referral" [Confermato da codice]
2. Legge il Cliente collegato e il suo KeapID [Confermato da codice]
3. Legge il campo "Presentata da" (linked a Clienti, self-referential) per trovare il referrer [Confermato da codice]
4. Legge il KeapID del referrer [Confermato da codice]
5. Applica il tag 337 al cliente tramite applytags worker [Confermato da codice]
6. Applica il tag 355 al referrer tramite applytags worker [Confermato da codice]
7. Recupera l'ultima riga di Riepilogo Mensile [Confermato da codice]
8. Incrementa "Referral riscattati" di +1 [Confermato da codice]
9. Mostra messaggio di conferma [Confermato da codice]

## 10. Validazioni e controlli

| Controllo | Messaggio errore | Blocca esecuzione |
|-----------|-----------------|-------------------|
| Nessuna riga selezionata | "Nessuna riga selezionata" | Si [Confermato da codice] |
| Cliente non collegato | "La riga non ha un Cliente collegato" | Si [Confermato da codice] |
| Record cliente non leggibile | "Impossibile leggere il record Cliente collegato" | Si [Confermato da codice] |
| KeapID cliente mancante | "Il Cliente collegato non ha KeapID valorizzato" | Si [Confermato da codice] |
| "Presentata da" mancante | "Nessun Presentata da trovato. Inserisci un cliente nel campo Presentato da prima di procedere" | Si [Confermato da codice] |
| Record referrer non valido | "Il record collegato in Presentata da non e' valido" | Si [Confermato da codice] |
| KeapID referrer mancante | "Il cliente nel campo Presentata da non ha un KeapID" | Si [Confermato da codice] |
| Riepilogo Mensile vuoto | "La tabella Riepilogo Mensile e' vuota: impossibile incrementare il contatore" | Si [Confermato da codice] |

## 11. Criticita' e note

- **"Ultima riga" di Riepilogo Mensile:** Lo script usa `summaryQuery.records[summaryQuery.records.length - 1]` per trovare l'ultima riga. L'ordine dei record dipende dall'ordine di default di Airtable (ordine di creazione), non da un ordinamento esplicito. Se le righe vengono riordinate o inserite fuori sequenza, potrebbe non essere il mese corrente. [Confermato da codice]
- **Nessun rollback:** Se il tag al referrer fallisce dopo che il tag al cliente e' stato applicato con successo, non c'e' meccanismo di rollback. [Confermato da codice]
- **Chiamate sequenziali:** I due tag vengono applicati in sequenza (prima cliente, poi referrer), non in parallelo. [Confermato da codice]
- **Query completa Clienti:** Lo script carica tutti i record della tabella Clienti (`selectRecordsAsync`) per poter leggere sia il cliente che il referrer dallo stesso query result. Questo potrebbe avere impatto sulle performance con molti clienti. [Confermato da codice]
- **Nessun controllo duplicati:** Non verifica se il referral e' gia' stato riscattato per evitare doppi conteggi. [Confermato da codice]
