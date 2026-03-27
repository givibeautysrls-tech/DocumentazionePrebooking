# Mappa Tabelle, Campi e Relazioni Airtable

## Diagramma delle relazioni

```
KeapAPIVars (config)
    |
    +-- Centro, record ID: recZqxq5Uji0ZTO5z

Prebooking
    |-- Cliente         --> Clienti (linked)
    |-- Appuntamento    --> Appuntamenti (linked)
    |-- Prossimo Appuntamento --> Appuntamenti (linked)
    |-- Acquisto        --> Acquisti (linked)
    |-- Trattamenti da eseguire --> Trattamenti (linked)
    |-- _aperta         (flag numerico)
    |-- Esito Prebooking (testo)
    |-- Feedback Cliente (testo)
    +-- Data e ora

Clienti
    |-- KeapID
    |-- Nome, Cognome, Email, Telefono
    |-- Promo Fidelity      (select/testo)
    |-- Pacco Referral Ricevuto (checkbox)
    |-- Recensione Inviata  (checkbox)
    |-- Presentata da       --> Clienti (self-referential, per referral)
    +-- [linked da Appuntamenti, Prebooking, Acquisti, Recensioni e Referral]

Appuntamenti
    |-- Cliente         --> Clienti (linked)
    |-- Prebooking (Apertura Scheda) --> Prebooking (linked)
    |-- Trattamento     --> Trattamenti (linked)
    |-- KeapID, NumAptKeap
    |-- Data e ora, Data Rinvio
    |-- Incasso previsto
    |-- Promozione (checkbox), Prezzo promozione
    |-- Prepagato (checkbox)
    |-- Presente (checkbox), Rinviato (numerico), Annullato (numerico)
    |-- Appuntamento preso da (operatrice)
    +-- Rinvia senza messaggio (checkbox)

Trattamenti
    +-- Nome (catalogo trattamenti)

Acquisti
    |-- Totale
    |-- Importo Contanti, Importo POS
    |-- Pagato con Gift Card (checkbox)
    |-- Prodotti        --> Acquisti Prodotti (linked)
    |-- Trattamenti     --> Trattamenti (linked)
    +-- Data

Acquisti Prodotti
    |-- Prodotto        --> Prodotti (linked)
    +-- [dettagli acquisto singolo prodotto]

Prodotti
    +-- Nome (catalogo prodotti)

Rendiconto
    |-- Data
    +-- Incassi         --> Acquisti (linked, array)

Recensioni e Referral
    |-- Cliente         --> Clienti (linked)
    +-- [usata come trigger per script referral/recensione]

Riepilogo Mensile
    |-- Referral riscattati    (numero, contatore)
    +-- Pacchi Referral Consegnati (numero, contatore)

KeapAPIVars
    +-- Centro (testo, nome del centro)
```

## Dettaglio tabelle

### Prebooking

Tabella centrale del flusso operativo. Ogni prebooking rappresenta una sessione/visita pianificata.

| Campo | Tipo | Relazione | Usato da script | Note |
|-------|------|-----------|-----------------|------|
| Cliente | Linked record | --> Clienti | apertura, chiusura | [Confermato da codice] |
| Appuntamento | Linked record | --> Appuntamenti | apertura, chiusura | Field ID: `fld9xVPrOS1MwPQpk` [Confermato da codice] |
| Prossimo Appuntamento | Linked record | --> Appuntamenti | chiusura | Field ID: `fldZCd9ydPG3PIBfI` [Confermato da codice] |
| Acquisto | Linked record | --> Acquisti | chiusura | Field ID: `fld4yipezOekynfD0` [Confermato da codice] |
| Trattamenti da eseguire | Linked record | --> Trattamenti | apertura | [Confermato da codice] |
| Data e ora | Date/DateTime | -- | apertura | [Confermato da codice] |
| _aperta | Numero | -- | apertura | Settato a 1 dopo apertura [Confermato da codice] |
| Esito Prebooking | Testo | -- | chiusura | Field ID: `fldOIdDCLwYCJlwBM` [Confermato da codice] |
| Feedback Cliente | Testo | -- | rinvio | Scritto con motivo rinvio [Confermato da codice] |

### Clienti

Anagrafica clienti con dati personali e stato fidelity/referral.

| Campo | Tipo | Relazione | Usato da script | Note |
|-------|------|-----------|-----------------|------|
| KeapID | Testo/Numero | -- | tutti | Field ID: `flduX9mOEmzFPNTtY` [Confermato da codice] |
| Nome | Testo | -- | apertura, chiusura, rinvio, annulla | Field ID: `fldtD13XA83lWJ5aG` [Confermato da codice] |
| Cognome | Testo | -- | apertura, chiusura, rinvio, annulla | Field ID: `fldUNF7DWN2YiXH0s` [Confermato da codice] |
| Email | Testo | -- | apertura, chiusura | Field ID: `fldYWYDOoGU1VHbuu` [Confermato da codice] |
| Telefono | Testo | -- | apertura, chiusura | Field ID: `fldboBaTDHYpY3j1P` [Confermato da codice] |
| Promo Fidelity | Select | -- | puntuale_e_premiata | Impostato a "Puntuale e Premiata" [Confermato da codice] |
| Pacco Referral Ricevuto | Checkbox | -- | pacco_consegnato | [Confermato da codice] |
| Recensione Inviata | Checkbox | -- | conferma_recensione | [Confermato da codice] |
| Presentata da | Linked record | --> Clienti (self) | referral_riscattato | Per trovare il referrer [Confermato da codice] |

### Appuntamenti

Singoli appuntamenti dei clienti, con stato e dettagli trattamento.

| Campo | Tipo | Relazione | Usato da script | Note |
|-------|------|-----------|-----------------|------|
| Cliente | Linked record | --> Clienti | rinvio, annulla | Field ID: `fldcmfKuP5JWhDLtn` [Confermato da codice] |
| Prebooking (Apertura Scheda) | Linked record | --> Prebooking | rinvio | [Confermato da codice] |
| Trattamento | Linked record | --> Trattamenti | rinvio, annulla, chiusura | Field ID: `fldWzEjFT7wUoCEDI` [Confermato da codice] |
| KeapID | Testo/Numero | -- | apertura, chiusura, rinvio, annulla | Field ID: `fldvzDLWzL8RL1aLy` [Confermato da codice] |
| NumAptKeap | Numero | -- | apertura, rinvio, annulla | Field ID: `fld5nCiDy8X0o5ZHD` [Confermato da codice] |
| Data e ora | DateTime | -- | tutti | Field ID: `fldy0rOapheuBOwpY` [Confermato da codice] |
| Data Rinvio | DateTime | -- | rinvio | [Confermato da codice] |
| Incasso previsto | Numero | -- | apertura, chiusura, rinvio, annulla | [Confermato da codice] |
| Promozione | Checkbox | -- | apertura, chiusura, rinvio | [Confermato da codice] |
| Prezzo promozione | Numero | -- | apertura, chiusura, rinvio | [Confermato da codice] |
| Prepagato | Checkbox | -- | rinvio | [Confermato da codice] |
| Presente | Checkbox | -- | chiusura | Field ID: `fld9Qq8FmixTn66nK` [Confermato da codice] |
| Rinviato | Numero (0/1) | -- | chiusura, rinvio | Field ID: `fldSFvsHEhGajIRnR` [Confermato da codice] |
| Annullato | Numero (0/1) | -- | chiusura, annulla | Field ID: `fldgLrYjQ3fWM5Rw2` [Confermato da codice] |
| Appuntamento preso da | Select/Testo | -- | apertura, rinvio | Operatrice [Confermato da codice] |
| Rinvia senza messaggio | Checkbox | -- | rinvio | [Confermato da codice] |

### Acquisti

Registrazione acquisti associati alle visite.

| Campo | Tipo | Field ID | Usato da script |
|-------|------|----------|-----------------|
| Totale | Numero | `fldsPsqmKzRGROEkE` | chiusura [Confermato da codice] |
| Importo Contanti | Numero | `fld2Q2iJvLi38m3Fn` | chiusura [Confermato da codice] |
| Importo POS | Numero | `fldXjhoChD9JTxP9J` | chiusura [Confermato da codice] |
| Prodotti | Linked record --> Acquisti Prodotti | `fldG8UcHREfmQdsai` | chiusura [Confermato da codice] |
| Trattamenti | Linked record --> Trattamenti | `fldNARYFKLL3xDncR` | chiusura [Confermato da codice] |
| Data | Date | -- | chiusura (per match con Rendiconto) [Confermato da codice] |
| Pagato con Gift Card | Checkbox | -- | chiusura [Confermato da codice] |

### Acquisti Prodotti

Tabella ponte tra Acquisti e Prodotti.

| Campo | Tipo | Usato da script |
|-------|------|-----------------|
| Prodotto | Linked record --> Prodotti | chiusura [Confermato da codice] |

### Prodotti

Catalogo prodotti.

| Campo | Tipo | Usato da script |
|-------|------|-----------------|
| Nome | Testo | chiusura (per elenco prodotti acquistati) [Confermato da codice] |

### Rendiconto

Contabilita' giornaliera.

| Campo | Tipo | Usato da script |
|-------|------|-----------------|
| Data | Date | chiusura (per match con data acquisto) [Confermato da codice] |
| Incassi | Linked record --> Acquisti (array) | chiusura (aggiunge acquisto) [Confermato da codice] |

### Recensioni e Referral

Tracking recensioni e referral. Tabella trigger per script fidelity.

| Campo | Tipo | Usato da script |
|-------|------|-----------------|
| Cliente | Linked record --> Clienti | puntuale, referral, pacco, conferma [Confermato da codice] |

### Riepilogo Mensile

Contatori mensili. Gli script operano sempre sull'**ultima riga** dell'array di record. [Confermato da codice]

| Campo | Tipo | Usato da script |
|-------|------|-----------------|
| Referral riscattati | Numero | referral_riscattato (incremento +1) [Confermato da codice] |
| Pacchi Referral Consegnati | Numero | pacco_consegnato (incremento +1) [Confermato da codice] |

### KeapAPIVars

Tabella di configurazione.

| Campo | Tipo | Usato da script |
|-------|------|-----------------|
| Centro | Testo | apertura, chiusura, rinvio, annulla [Confermato da codice] |

**Record ID di riferimento:** `recZqxq5Uji0ZTO5z` [Confermato da codice]
