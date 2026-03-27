# Inventario Script Airtable

## Tabella riepilogativa

| # | Script | Righe | Tabella di attivazione | Worker chiamato | Tag applicati | Tabelle lette | Tabelle scritte |
|---|--------|-------|------------------------|-----------------|---------------|---------------|-----------------|
| 1 | `apertura_scheda.js` | ~230 | Prebooking | `apertura-scheda.../api/prebooking` | Nessuno direttamente (gestiti dal worker) [Inferito da contesto] | Prebooking, Clienti, Appuntamenti, Trattamenti, KeapAPIVars | Prebooking, Clienti, Appuntamenti |
| 2 | `chiusura_scheda.js` | ~534 | Prebooking | `apertura-scheda.../api/prebooking/chiusura` | Nessuno direttamente (gestiti dal worker) [Inferito da contesto] | Prebooking, Clienti, Appuntamenti, Acquisti, Acquisti Prodotti, Prodotti, Rendiconto, KeapAPIVars | Prebooking, Appuntamenti, Rendiconto |
| 3 | `rinvio_appuntamento.js` | ~218 | Appuntamenti | `apertura-scheda.../api/prebooking/rinvio` | Nessuno direttamente (gestiti dal worker) [Inferito da contesto] | Appuntamenti, Clienti, Prebooking, KeapAPIVars | Appuntamenti (vecchio + nuovo), Prebooking (feedback + nuovo) |
| 4 | `annulla_appuntamento.js` | ~175 | Appuntamenti | `apertura-scheda.../api/prebooking/annulla` | Nessuno direttamente (gestiti dal worker) [Inferito da contesto] | Appuntamenti, Clienti, KeapAPIVars | Appuntamenti |
| 5 | `puntuale_e_premiata.js` | ~125 | Recensioni e Referral | `apertura-scheda.../api/prebooking/sync-next-appointment` + `applytags...` | 387 (via applytags) | Recensioni e Referral, Clienti, KeapAPIVars [Da verificare] | Clienti |
| 6 | `referral_riscattato.js` | ~129 | Recensioni e Referral | `applytags...` | 337 (cliente), 355 (referrer) | Recensioni e Referral, Clienti | Riepilogo Mensile |
| 7 | `pacco_consegnato.js` | ~118 | Recensioni e Referral | `applytags...` | 357 | Recensioni e Referral, Clienti | Clienti, Riepilogo Mensile |
| 8 | `conferma_recensione.js` | ~38 | Recensioni e Referral | `applytags...` | 155 | Recensioni e Referral, Clienti | Clienti |

[Confermato da codice] per tutte le colonne salvo dove diversamente indicato.

## Dettagli per script

### 1. apertura_scheda.js

**Scopo:** Apre una scheda di prebooking. Raccoglie i dati di cliente, appuntamento e trattamenti, li invia al worker che crea/aggiorna il contatto e l'appuntamento su Keap, poi scrive indietro su Airtable i Keap ID generati. [Confermato da codice]

**Endpoint:** `POST https://apertura-scheda.notifichegielvi.workers.dev/api/prebooking` [Confermato da codice]

---

### 2. chiusura_scheda.js

**Scopo:** Chiude la scheda di prebooking. Gestisce la marcatura di presenza, la registrazione degli acquisti (prodotti e trattamenti), il collegamento al rendiconto giornaliero, e opzionalmente la registrazione del prossimo appuntamento su Keap. [Confermato da codice]

**Endpoint:** `POST https://apertura-scheda.notifichegielvi.workers.dev/api/prebooking/chiusura` [Confermato da codice]

**Nota:** E' lo script piu' complesso. Contiene una funzione dedicata `aggiornaRendiconto()` che cerca il record Rendiconto con la stessa data dell'acquisto e lo collega. [Confermato da codice]

---

### 3. rinvio_appuntamento.js

**Scopo:** Rinvia un appuntamento a una nuova data. Marca il vecchio appuntamento come rinviato, crea un nuovo record Appuntamento e un nuovo record Prebooking in Airtable, preservando i dati originali (promozione, prezzo promo, prepagato, operatrice). [Confermato da codice]

**Endpoint:** `POST https://apertura-scheda.notifichegielvi.workers.dev/api/prebooking/rinvio` [Confermato da codice]

---

### 4. annulla_appuntamento.js

**Scopo:** Annulla un appuntamento. Comunica l'annullamento al worker e marca il record come `Annullato = 1` su Airtable. [Confermato da codice]

**Endpoint:** `POST https://apertura-scheda.notifichegielvi.workers.dev/api/prebooking/annulla` [Confermato da codice]

---

### 5. puntuale_e_premiata.js

**Scopo:** Attiva la promozione fidelity "Puntuale e Premiata" per un cliente. Imposta il campo "Promo Fidelity" a "Puntuale e Premiata", chiama il sync del prossimo appuntamento, e applica il tag 387. [Confermato da codice]

**Endpoint:**
- `POST https://apertura-scheda.notifichegielvi.workers.dev/api/prebooking/sync-next-appointment` [Confermato da codice]
- `GET https://applytags.notifichegielvi.workers.dev/?keapID=...&tagIDs=387` [Confermato da codice]

---

### 6. referral_riscattato.js

**Scopo:** Riscatta un referral. Applica il tag 337 al cliente e il tag 355 al referrer (campo "Presentata da"), e incrementa il contatore "Referral riscattati" nell'ultima riga di Riepilogo Mensile. [Confermato da codice]

**Endpoint:** `GET https://applytags.notifichegielvi.workers.dev/?keapID=...&tagIDs=...` (due chiamate) [Confermato da codice]

---

### 7. pacco_consegnato.js

**Scopo:** Registra la consegna del pacco referral. Imposta "Pacco Referral Ricevuto" = true sul cliente, applica il tag 357, e incrementa il contatore "Pacchi Referral Consegnati" nell'ultima riga di Riepilogo Mensile. Ha meccanismo di rollback in caso di errore. [Confermato da codice]

**Endpoint:** `GET https://applytags.notifichegielvi.workers.dev/?keapID=...&tagIDs=357` [Confermato da codice]

---

### 8. conferma_recensione.js

**Scopo:** Conferma l'invio di una recensione. Applica il tag 155 e imposta "Recensione Inviata" = true sul cliente. E' lo script piu' semplice. [Confermato da codice]

**Endpoint:** `GET https://applytags.notifichegielvi.workers.dev/?keapID=...&tagIDs=155` [Confermato da codice]
