# conferma_recensione.js -- Conferma Recensione Inviata

## 1. Scopo

Conferma che un cliente ha inviato una recensione. Applica il tag 155 ("Recensione inviata") su Keap tramite il worker applytags e imposta il flag "Recensione Inviata" a `true` sul record Clienti. E' lo script piu' semplice del sistema (~38 righe). [Confermato da codice]

## 2. Tabella di attivazione

**Recensioni e Referral** -- lo script viene attivato tramite pulsante sulla tabella Recensioni e Referral. [Confermato da codice]

```js
let table = base.getTable("Recensioni e Referral")
const record = await input.recordAsync("Record cliccato", table);
```

## 3. Tabelle lette

| Tabella | Dati letti |
|---------|------------|
| Recensioni e Referral | Cliente (linked) [Confermato da codice] |
| Clienti | KeapID [Confermato da codice] |

## 4. Tabelle scritte

| Tabella | Campi aggiornati |
|---------|-----------------|
| Clienti | "Recensione Inviata" = true [Confermato da codice] |

## 5. Endpoint chiamati

| Endpoint | Metodo | Scopo |
|----------|--------|-------|
| `https://applytags.notifichegielvi.workers.dev/?keapID=...&tagIDs=155` | GET | Applicazione tag 155 [Confermato da codice] |

## 6. Payload inviato

Chiamata GET con parametri in query string costruita tramite `URL` e `searchParams`: [Confermato da codice]

```js
let workerURL = new URL("https://applytags.notifichegielvi.workers.dev/")
workerURL.searchParams.append("keapID", id || "")
workerURL.searchParams.append("tagIDs", "155")
```

Risultato: `GET https://applytags.notifichegielvi.workers.dev/?keapID=<keapID>&tagIDs=155` [Confermato da codice]

**Nota:** A differenza degli altri script che usano template literal per costruire la URL, questo script usa l'oggetto `URL` con `searchParams.append`. [Confermato da codice]

## 7. Campi aggiornati dopo risposta worker

| Campo | Tabella | Valore |
|-------|---------|--------|
| Recensione Inviata | Clienti | `true` [Confermato da codice] |

## 8. Tag applicati

| Tag ID | Descrizione | Applicato a | Worker |
|--------|-------------|-------------|--------|
| 155 | Recensione inviata | Cliente | applytags [Confermato da codice] |

## 9. Flusso logico

1. Recupera il record dalla tabella "Recensioni e Referral" [Confermato da codice]
2. Legge il primo Cliente collegato e ne estrae l'ID [Confermato da codice]
3. Carica il record Cliente e legge il KeapID [Confermato da codice]
4. Costruisce la URL del worker con i parametri [Confermato da codice]
5. Chiama il worker applytags tramite `remoteFetchAsync` (GET, senza headers espliciti) [Confermato da codice]
6. Se la risposta non e' ok, logga "ERRORE" e fa `return` [Confermato da codice]
7. Imposta "Recensione Inviata" = `true` sul record Clienti tramite funzione helper `setField()` [Confermato da codice]

## 10. Validazioni e controlli

| Controllo | Messaggio errore | Blocca esecuzione |
|-----------|-----------------|-------------------|
| Risposta worker non ok | "ERRORE" (solo in console) | Si, con `return` [Confermato da codice] |

**Nota:** Lo script ha **validazioni minime** rispetto agli altri. [Confermato da codice] Non verifica:
- Se il record e' stato trovato (usa optional chaining `record?.getCellValue`) [Confermato da codice]
- Se il cliente e' collegato (accede direttamente a `[0].id`) [Confermato da codice]
- Se il KeapID esiste (passa stringa vuota `""` se mancante) [Confermato da codice]
- Se la recensione e' gia' stata confermata (nessun controllo duplicati) [Confermato da codice]

## 11. Criticita' e note

- **Stile diverso dagli altri script:** Non segue il pattern CONFIG/UTILS/MAIN degli altri script del blocco referral. Usa uno stile piu' minimale e diretto. [Confermato da codice]
- **Funzione helper setField():** Definisce una funzione generica `setField(table, recordID, name, value)` per aggiornare campi. Questa funzione e' chiamata senza `await` alla riga 22, il che significa che l'aggiornamento potrebbe non completarsi prima della fine dello script. [Confermato da codice]
- **KeapID vuoto:** Se il cliente non ha un KeapID, lo script passa una stringa vuota (`""`) al worker invece di bloccare l'esecuzione. Il comportamento dipende dal worker. [Confermato da codice]
- **Gestione errori minima:** L'unica gestione errori e' il controllo `response.ok`. Un errore di rete o un cliente mancante causerebbe un'eccezione non gestita. [Confermato da codice]
- **Nessun controllo duplicati:** Non verifica se "Recensione Inviata" e' gia' `true`, quindi il tag potrebbe essere applicato piu' volte. [Confermato da codice]
- **remoteFetchAsync senza metodo esplicito:** La chiamata a `remoteFetchAsync` non specifica il metodo HTTP, quindi utilizza il default GET. [Confermato da codice]
