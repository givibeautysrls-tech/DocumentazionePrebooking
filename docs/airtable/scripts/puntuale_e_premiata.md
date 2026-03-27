# puntuale_e_premiata.js -- Promozione Puntuale e Premiata

## 1. Scopo

Attiva la promozione fidelity "Puntuale e Premiata" per un cliente. Imposta il campo "Promo Fidelity" sul record Clienti, chiama l'endpoint di sincronizzazione del prossimo appuntamento, e applica il tag 387 su Keap tramite il worker applytags. [Confermato da codice]

## 2. Tabella di attivazione

**Recensioni e Referral** -- lo script viene attivato tramite pulsante sulla tabella Recensioni e Referral. [Confermato da codice]

```js
const mainRecord = await input.recordAsync('Seleziona la riga su cui hai cliccato il pulsante:', mainTable);
```

## 3. Tabelle lette

| Tabella | Dati letti |
|---------|------------|
| Recensioni e Referral | Cliente (linked) [Confermato da codice] |
| Clienti | KeapID [Confermato da codice] |

**Nota:** Lo script legge anche `CONFIG.CLIENT_PACKAGE_FIELD` nella query dei clienti, che sembra essere un residuo di un altro script (pacco_consegnato). Il campo non e' definito in CONFIG e potrebbe generare un errore silenzioso o essere ignorato. [Confermato da codice]

## 4. Tabelle scritte

| Tabella | Campi aggiornati |
|---------|-----------------|
| Clienti | "Promo Fidelity" = `{name: "Puntuale e Premiata"}` (valore select) [Confermato da codice] |

## 5. Endpoint chiamati

| Endpoint | Metodo | Scopo |
|----------|--------|-------|
| `https://apertura-scheda.notifichegielvi.workers.dev/api/prebooking/sync-next-appointment` | POST | Sincronizzazione prossimo appuntamento [Confermato da codice] |
| `https://applytags.notifichegielvi.workers.dev/?keapID=...&tagIDs=387` | GET | Applicazione tag 387 [Confermato da codice] |

## 6. Payload inviato

**Endpoint sync-next-appointment:**
```json
{
  "cliente": {
    "keapId": "<keap ID>"
  }
}
```
[Confermato da codice]

**Endpoint applytags:**
Parametri in query string: `?keapID=<keapID>&tagIDs=387` [Confermato da codice]

## 7. Campi aggiornati dopo risposta worker

| Campo | Tabella | Valore |
|-------|---------|--------|
| Promo Fidelity | Clienti | `{name: "Puntuale e Premiata"}` [Confermato da codice] |

**Nota:** L'aggiornamento del campo "Promo Fidelity" avviene **prima** delle chiamate ai worker, non dopo. [Confermato da codice]

## 8. Tag applicati

| Tag ID | Descrizione | Applicato a | Worker |
|--------|-------------|-------------|--------|
| 387 | Promozione "Puntuale e Premiata" | Cliente | applytags [Confermato da codice] |

## 9. Flusso logico

1. Recupera il record dalla tabella "Recensioni e Referral" [Confermato da codice]
2. Legge il Cliente collegato e il suo KeapID [Confermato da codice]
3. Aggiorna il campo "Promo Fidelity" a "Puntuale e Premiata" sul record Clienti [Confermato da codice]
4. Chiama l'endpoint `sync-next-appointment` con il KeapID del cliente [Confermato da codice]
5. Applica il tag 387 tramite il worker applytags [Confermato da codice]
6. Mostra messaggio di conferma [Confermato da codice]

## 10. Validazioni e controlli

| Controllo | Messaggio errore | Blocca esecuzione |
|-----------|-----------------|-------------------|
| Nessuna riga selezionata | "Nessuna riga selezionata" | Si [Confermato da codice] |
| Cliente non collegato | "La riga non ha un Cliente collegato" | Si [Confermato da codice] |
| Record cliente non leggibile | "Impossibile leggere il record Cliente collegato" | Si [Confermato da codice] |
| KeapID mancante | "Il Cliente collegato non ha KeapID valorizzato" | Si [Confermato da codice] |

## 11. Criticita' e note

- **Rollback in caso di errore tagging:** Se il tagging (punto 5) fallisce, lo script tenta un rollback impostando `CONFIG.CLIENT_PACKAGE_FIELD` a `false`. Tuttavia, `CLIENT_PACKAGE_FIELD` non e' definito in CONFIG di questo script (sembra copiato da `pacco_consegnato.js`). Questo rollback potrebbe non funzionare come previsto. [Confermato da codice]
- **Ordine operazioni:** Il campo "Promo Fidelity" viene aggiornato **prima** delle chiamate ai worker. Se il worker fallisce, il campo rimane aggiornato senza il tag corrispondente su Keap. [Confermato da codice]
- **sync-next-appointment:** La risposta di questo endpoint viene parsata (`response.json()`) ma il risultato non viene utilizzato ne' controllato per errori specifici. L'unica gestione e' il controllo `response.ok`. [Confermato da codice]
- **CONFIG.CLIENT_PACKAGE_FIELD non definito:** Nella query `selectRecordsAsync`, viene passato `CONFIG.CLIENT_PACKAGE_FIELD` che non esiste nell'oggetto CONFIG. Potrebbe causare un errore runtime o essere ignorato. [Confermato da codice]
- **Nessun utilizzo di KeapAPIVars:** A differenza degli script di prebooking, questo script non legge la tabella KeapAPIVars per il Centro. [Confermato da codice]
