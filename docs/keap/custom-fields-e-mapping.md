# Custom Fields e Mapping

> Fonte: `keap-backup/contacts-model.json` e codice sorgente dei worker
> Ultima revisione: 2026-03-26

Questo documento mappa tutti i custom fields definiti nel modello contatti Keap, organizzati per gruppo, e documenta quali worker/script leggono o scrivono ciascun campo.

---

## 1. Panoramica Gruppi

| Group ID | Nome Gruppo | Descrizione | N. campi |
|----------|-------------|-------------|----------|
| 3 | Generale | Dati generali del contatto (centro, stato, contatori) | 6 |
| 15 | A1 – Appuntamento 1 | Tutti i campi relativi al primo slot appuntamento | 11 |
| 17 | A2 – Appuntamento 2 | Secondo slot appuntamento | 11 |
| 19 | A3 – Appuntamento 3 | Terzo slot appuntamento | 11 |
| 21 | Referral | Dati programma referral | 1 |
| 23 | A4 – Appuntamento 4 | Quarto slot appuntamento | 3 |
| 25 | A5 – Appuntamento 5 | Quinto slot appuntamento + slot A6-A10 (aggiunti 2026-05-13) | 18 |
| 27 | Next Appointment | Prossimo appuntamento (calcolato) | 3 |

[Confermato da codice]

---

## 2. Gruppo 3 — Generale

| ID | Label | Field Name | Tipo | Descrizione |
|----|-------|------------|------|-------------|
| 41 | Centro | Centro | DROPDOWN | Centro di appartenenza (Portici, Arzano, Torre del Greco, Pomigliano) |
| 163 | Rinvii | Rinvii | WHOLE_NUMBER | Contatore totale rinvii appuntamento |
| 165 | IstanceIDSendapp | IstanceIDSendapp | TEXT | ID istanza SendApp per invio WhatsApp |
| 167 | No-Show | NoShow | WHOLE_NUMBER | Contatore mancate presentazioni |
| 171 | cleanPhone | cleanPhone | TEXT | Numero di telefono normalizzato (formato 39XXXXXXXXXX) |
| 239 | Apt Puntuale e premiata | AptPuntualeepremiata | WHOLE_NUMBER | Contatore appuntamenti nella promo "Puntuale e Premiata" |

[Confermato da codice]

### Utilizzo nel codice

| Field ID | Letto da | Scritto da | Fonte |
|----------|----------|------------|-------|
| 41 (Centro) | `apertura-scheda` (verifica coerenza) | `apertura-scheda` (creazione/aggiornamento contatto), `leadgen` (creazione lead) | [Confermato da codice] |
| 163 (Rinvii) | — | `apertura-scheda` (incremento al rinvio) | [Inferito da contesto] |
| 165 (IstanceIDSendapp) | `apertura-scheda` (verifica coerenza) | `apertura-scheda` (impostazione da `CENTRO_TO_SENDAPP`), `leadgen` (impostazione da `sendappUser`) | [Confermato da codice] |
| 167 (No-Show) | — | `apertura-scheda` (chiusura scheda, se non presente) | [Inferito da contesto] |
| 171 (cleanPhone) | — | `apertura-scheda` (normalizzazione telefono), `leadgen` (normalizzazione telefono) | [Confermato da codice] |
| 239 (Apt Puntuale e premiata) | — | `apertura-scheda` (incremento se promo attiva) | [Inferito da contesto] |

---

## 3. Gruppo 15 — A1 (Appuntamento 1)

| ID | Label | Field Name | Tipo | Descrizione |
|----|-------|------------|------|-------------|
| 127 | A1: Data e ora | Dataeora | DATE_TIME | Data e ora combinate (campo legacy) |
| 133 | A1: Trattamenti | A1Trattamenti | TEXT | Elenco trattamenti dell'appuntamento |
| 139 | A1: Presente | A1Presente | YES_NO | Flag presenza cliente |
| 145 | A1: Rinviato | A1Rinviato | YES_NO | Flag rinvio appuntamento |
| 147 | A1: Annullato | A1Annullato | YES_NO | Flag annullamento appuntamento |
| 173 | A1: Ora | A1Ora | TEXT | Orario dell'appuntamento (formato testo) |
| 185 | A1: Data | A1Data | DATE | Data dell'appuntamento |
| 191 | A1: Valore | A1Valore | DECIMAL_NUMBER | Valore economico dell'appuntamento |
| 197 | A1: keapID | A1keapID | TEXT | ID dell'appuntamento Keap associato |
| 203 | A1: Data rinvio | Datarinvio | DATE | Data del rinvio (se rinviato) |
| 213 | A1: Data precedente | A1Dataprecedente | DATE | Data originale prima del rinvio |

[Confermato da codice]

---

## 4. Gruppo 17 — A2 (Appuntamento 2)

| ID | Label | Field Name | Tipo | Descrizione |
|----|-------|------------|------|-------------|
| 129 | A2: Data e ora | Dataeora1 | DATE_TIME | Data e ora combinate (legacy) |
| 135 | A2: Trattamenti | A2Trattamenti | TEXT | Elenco trattamenti |
| 141 | A2: Presente | A2Presente | YES_NO | Flag presenza |
| 151 | A2: Rinviato | A2Rinviato | YES_NO | Flag rinvio |
| 153 | A2: Annullato | A2Annullato | YES_NO | Flag annullamento |
| 177 | A2: Ora | A2Ora | TEXT | Orario appuntamento |
| 179 | A2: Data | A2Data | DATE | Data appuntamento |
| 193 | A2: Valore | A2Valore | DECIMAL_NUMBER | Valore economico |
| 199 | A2: KeapID | A2KeapID | TEXT | ID appuntamento Keap |
| 207 | A2: Data rinvio | A2Datarinvio | DATE | Data rinvio |
| 215 | A2: Data precedente | A2Dataprecedente | DATE | Data originale |

[Confermato da codice]

---

## 5. Gruppo 19 — A3 (Appuntamento 3)

| ID | Label | Field Name | Tipo | Descrizione |
|----|-------|------------|------|-------------|
| 131 | A3: Data e ora | A3Dataeora | DATE_TIME | Data e ora combinate (legacy) |
| 137 | A3: Trattamenti | A3Trattamenti | TEXT | Elenco trattamenti |
| 143 | A3: Presente | A3Presente | YES_NO | Flag presenza |
| 157 | A3: Rinviato | A3Rinviato | YES_NO | Flag rinvio |
| 159 | A3: Annullato | A3Annullato | YES_NO | Flag annullamento |
| 181 | A3: Ora | A3Ora | TEXT | Orario appuntamento |
| 187 | A3: Data | A3Data | DATE | Data appuntamento |
| 195 | A3: Valore | A3Valore | DECIMAL_NUMBER | Valore economico |
| 201 | A3: keapID | A3keapID | TEXT | ID appuntamento Keap |
| 209 | A3: Data rinvio | A3Datarinvio | DATE | Data rinvio |
| 217 | A3: Data precedente | A3Dataprecedente | DATE | Data originale |

[Confermato da codice]

---

## 6. Gruppo 23 — A4 (Appuntamento 4)

| ID | Label | Field Name | Tipo | Descrizione |
|----|-------|------------|------|-------------|
| 219 | A4: Trattamenti | A4Trattamenti | TEXT | Elenco trattamenti |
| 221 | A4: Ora | A4Ora | TEXT | Orario appuntamento |
| 225 | A4: Data | A4Data | DATE | Data appuntamento |

[Confermato da codice]

**Nota:** Il Gruppo 23 ha solo 3 campi (trattamenti, ora, data). Non include campi per Presente, Rinviato, Annullato, Valore, keapID, Data rinvio, Data precedente, a differenza dei Gruppi 15/17/19. Questo suggerisce che A4 e' stato aggiunto successivamente con una struttura ridotta. [Confermato da codice]

---

## 7. Gruppo 25 — A5 (Appuntamento 5)

| ID | Label | Field Name | Tipo | Descrizione |
|----|-------|------------|------|-------------|
| 227 | A5: Trattamenti | A5Trattamenti | TEXT | Elenco trattamenti |
| 229 | A5: Ora | A5Ora | TEXT | Orario appuntamento |
| 231 | A5: Data | A5Data | DATE | Data appuntamento |

[Confermato da codice]

**Nota:** Stessa struttura ridotta di A4. [Confermato da codice]

---

## 8. Gruppo 25 (aggiunto) — A6-A10 (Appuntamenti 6-10)

| ID | Label | Field Name | Tipo | Descrizione |
|----|-------|------------|------|-------------|
| 241 | A6: Trattamenti | A6Trattamenti | TEXT | Elenco trattamenti slot 6 |
| 243 | A6: Ora | A6Ora | TEXT | Orario appuntamento slot 6 |
| 245 | A6: Data | A6Data | DATE | Data appuntamento slot 6 |
| 247 | A7: Trattamenti | A7Trattamenti | TEXT | Elenco trattamenti slot 7 |
| 249 | A7: Ora | A7Ora | TEXT | Orario appuntamento slot 7 |
| 251 | A7: Data | A7Data | DATE | Data appuntamento slot 7 |
| 253 | A8: Trattamenti | A8Trattamenti | TEXT | Elenco trattamenti slot 8 |
| 255 | A8: Ora | A8Ora | TEXT | Orario appuntamento slot 8 |
| 257 | A8: Data | A8Data | DATE | Data appuntamento slot 8 |
| 259 | A9: Trattamenti | A9Trattamenti | TEXT | Elenco trattamenti slot 9 |
| 261 | A9: Ora | A9Ora | TEXT | Orario appuntamento slot 9 |
| 263 | A9: Data | A9Data | DATE | Data appuntamento slot 9 |
| 265 | A10: Trattamenti | A10Trattamenti | TEXT | Elenco trattamenti slot 10 |
| 267 | A10: Ora | A10Ora | TEXT | Orario appuntamento slot 10 |
| 269 | A10: Data | A10Data | DATE | Data appuntamento slot 10 |

**Nota:** Creati il 2026-05-13 tramite XML-RPC DataService.addCustomField, aggiunti al gruppo 25 (stesso gruppo di A5). Stessa struttura ridotta di A4/A5 (solo trattamenti, ora, data). Il campo ID 271 (`A8: Trattamenti`) e' un duplicato accidentale creato durante l'inserimento — non viene usato nel codice.

[Confermato da codice — creati 2026-05-13]

---

## 8. Gruppo 27 — Next Appointment

| ID | Label | Field Name | Tipo | Descrizione |
|----|-------|------------|------|-------------|
| 233 | NextAppointmentDate | NextAppointmentDate | DATE | Data del prossimo appuntamento |
| 235 | NextAppointmentTime | NextAppointmentTime | TEXT | Orario del prossimo appuntamento |
| 237 | NextAppointmentTreatments | NextAppointmentTreatments | TEXT | Trattamenti del prossimo appuntamento |

[Confermato da codice]

Questi campi vengono aggiornati dall'endpoint `/api/prebooking/sync-next-appointment` di `apertura-scheda`, calcolando quale dei 5 slot ha la data piu' vicina nel futuro. [Confermato da codice]

---

## 9. Gruppo 21 — Referral

| ID | Label | Field Name | Tipo | Descrizione |
|----|-------|------------|------|-------------|
| 189 | Numero referral | Numeroreferral | WHOLE_NUMBER | Contatore referral portati dal contatto |

[Confermato da codice]

---

## 10. Mapping APPOINTMENT_FIELDS (apertura-scheda CONFIG)

La configurazione `APPOINTMENT_FIELDS` nel worker `apertura-scheda` mappa i 3 campi operativi (trattamenti, data, ora) per ciascuno dei 5 slot:

| Slot | Campo | Custom Field ID | Label in Keap | Group |
|------|-------|----------------|---------------|-------|
| **1** | trattamenti | 133 | A1: Trattamenti | 15 |
| **1** | data | 185 | A1: Data | 15 |
| **1** | ora | 173 | A1: Ora | 15 |
| **2** | trattamenti | 135 | A2: Trattamenti | 17 |
| **2** | ora | 177 | A2: Ora | 17 |
| **2** | data | 179 | A2: Data | 17 |
| **3** | trattamenti | 137 | A3: Trattamenti | 19 |
| **3** | ora | 181 | A3: Ora | 19 |
| **3** | data | 187 | A3: Data | 19 |
| **4** | trattamenti | 219 | A4: Trattamenti | 23 |
| **4** | ora | 221 | A4: Ora | 23 |
| **4** | data | 225 | A4: Data | 23 |
| **5** | trattamenti | 227 | A5: Trattamenti | 25 |
| **5** | ora | 229 | A5: Ora | 25 |
| **5** | data | 231 | A5: Data | 25 |
| **6** | trattamenti | 241 | A6: Trattamenti | 25 |
| **6** | ora | 243 | A6: Ora | 25 |
| **6** | data | 245 | A6: Data | 25 |
| **7** | trattamenti | 247 | A7: Trattamenti | 25 |
| **7** | ora | 249 | A7: Ora | 25 |
| **7** | data | 251 | A7: Data | 25 |
| **8** | trattamenti | 253 | A8: Trattamenti | 25 |
| **8** | ora | 255 | A8: Ora | 25 |
| **8** | data | 257 | A8: Data | 25 |
| **9** | trattamenti | 259 | A9: Trattamenti | 25 |
| **9** | ora | 261 | A9: Ora | 25 |
| **9** | data | 263 | A9: Data | 25 |
| **10** | trattamenti | 265 | A10: Trattamenti | 25 |
| **10** | ora | 267 | A10: Ora | 25 |
| **10** | data | 269 | A10: Data | 25 |

[Confermato da codice]

**Nota importante:** I gruppi 15, 17, 19 (A1-A3) hanno 11 campi ciascuno (inclusi Presente, Rinviato, Annullato, Valore, keapID, Data rinvio, Data precedente, Data e ora legacy). I gruppi 23, 25 (A4-A5) hanno solo 3 campi ciascuno. Tuttavia, `APPOINTMENT_FIELDS` usa solo i 3 campi comuni (trattamenti, data, ora) per tutti e 5 gli slot. I campi aggiuntivi di A1-A3 vengono gestiti tramite codice separato nel worker. [Confermato da codice]

---

## 11. Mapping APPOINTMENT_TAGS (apertura-scheda CONFIG)

| Slot | Tag principale | Fusion | ProSkin | Cancel | Rinvio |
|------|---------------|--------|---------|--------|--------|
| A1 | 285 | 307 | 309 | 291 | 299 |
| A2 | 287 | 311 | 313 | 293 | 301 |
| A3 | 289 | 315 | 317 | 295 | 303 |
| A4 | 365 | 367 | 369 | 371 | 373 |
| A5 | 375 | 377 | 379 | 383 | 381 |
| A6 | 427 | 429 | 431 | 433 | 435 |
| A7 | 437 | 439 | 441 | 443 | 445 |
| A8 | 447 | 449 | 451 | 453 | 455 |
| A9 | 457 | 459 | 461 | 463 | 465 |
| A10 | 467 | 469 | 471 | 473 | 475 |

[Confermato da codice]

---

## 12. Custom Fields Appuntamento (ContactAction via XML-RPC)

Oltre ai custom fields del contatto, `apertura-scheda` scrive anche sui custom fields dell'oggetto appuntamento (ContactAction) tramite XML-RPC `DataService.update`:

| Suffisso | Descrizione | Tipo operazione |
|----------|-------------|-----------------|
| `_Trattamenti` | Elenco trattamenti dell'appuntamento | Scritto alla creazione |
| `_Note` | Note aggiuntive | Scritto alla creazione |
| `_Presente` | Flag presenza cliente | Scritto alla chiusura |
| `_Rinviato` | Flag rinvio | Scritto al rinvio |
| `_Annullato` | Flag annullamento | Scritto all'annullamento |
| `_DataRinvio` | Data del rinvio | Scritto al rinvio |

[Confermato da codice]

**Nota:** Questi campi usano un suffisso (es. `_Trattamenti`) perche' XML-RPC referenzia i custom fields di ContactAction con un prefisso implicito legato all'action set. Non sono gli stessi campi dei custom fields del contatto. [Inferito da contesto]

---

## 13. Matrice di utilizzo per worker/script

### Campi scritti per componente

| Componente | Custom Fields scritti (ID) |
|------------|---------------------------|
| `apertura-scheda` | 41, 133, 135, 137, 165, 171, 173, 177, 179, 181, 185, 187, 219, 221, 225, 227, 229, 231, 233, 235, 237 + campi ContactAction via XML-RPC |
| `leadgen` (lead-handler attivo) | 41, 165, 171 |
| Script `puntuale_e_premiata.js` | 239 (via Airtable, non direttamente Keap) [Da verificare] |

[Confermato da codice]

### Campi letti per componente

| Componente | Custom Fields letti (ID) |
|------------|--------------------------|
| `apertura-scheda` | 41 (Centro), 165 (IstanceIDSendapp), 171 (cleanPhone), 133/135/137/219/227 (Trattamenti slot), 185/179/187/225/231 (Date slot), 173/177/181/221/229 (Ore slot) |
| `getcontactinfo` | Tutti (restituisce `optional_properties=custom_fields`) |
| `keap-utility` / `getContactInfo` | Tutti (passa la risposta completa di Keap) |

[Confermato da codice]

---

## 14. Campi non utilizzati nel codice

I seguenti custom fields esistono nel modello contatti ma non sono stati trovati referenziati direttamente nel codice dei worker:

| ID | Label | Gruppo | Possibile utilizzo |
|----|-------|--------|-------------------|
| 127 | A1: Data e ora | 15 | Campo legacy DATE_TIME, sostituito dalla coppia Data(185) + Ora(173) [Inferito da contesto] |
| 129 | A2: Data e ora | 17 | Campo legacy DATE_TIME, sostituito da Data(179) + Ora(177) [Inferito da contesto] |
| 131 | A3: Data e ora | 19 | Campo legacy DATE_TIME, sostituito da Data(187) + Ora(181) [Inferito da contesto] |
| 139 | A1: Presente | 15 | Scritto via XML-RPC come `_Presente` sull'appuntamento, non come custom field contatto [Inferito da contesto] |
| 141 | A2: Presente | 17 | Idem |
| 143 | A3: Presente | 19 | Idem |
| 145 | A1: Rinviato | 15 | Possibile uso nelle automazioni Keap come condizione [Da verificare] |
| 147 | A1: Annullato | 15 | Idem |
| 151 | A2: Rinviato | 17 | Idem |
| 153 | A2: Annullato | 17 | Idem |
| 157 | A3: Rinviato | 19 | Idem |
| 159 | A3: Annullato | 19 | Idem |
| 163 | Rinvii | 3 | Possibile uso nelle automazioni (temperatura rinvii) [Da verificare] |
| 167 | No-Show | 3 | Possibile uso nelle automazioni [Da verificare] |
| 189 | Numero referral | 21 | Possibile uso nel flusso referral [Da verificare] |
| 191 | A1: Valore | 15 | Possibile uso nei report/automazioni [Da verificare] |
| 193 | A2: Valore | 17 | Idem |
| 195 | A3: Valore | 19 | Idem |
| 197 | A1: keapID | 15 | Memorizza ID appuntamento Keap nello slot contatto [Inferito da contesto] |
| 199 | A2: KeapID | 17 | Idem |
| 201 | A3: keapID | 19 | Idem |
| 203 | A1: Data rinvio | 15 | Usato dai Field Timer nelle automazioni Keap [Inferito da contesto] |
| 207 | A2: Data rinvio | 17 | Idem |
| 209 | A3: Data rinvio | 19 | Idem |
| 213 | A1: Data precedente | 15 | Storico data originale pre-rinvio [Inferito da contesto] |
| 215 | A2: Data precedente | 17 | Idem |
| 217 | A3: Data precedente | 19 | Idem |

**Nota:** Molti di questi campi sono probabilmente scritti dal worker `apertura-scheda` in sezioni di codice non esaminate in dettaglio (il worker e' ~1800 righe). La loro assenza dalla configurazione `APPOINTMENT_FIELDS` non significa che non siano usati. [Da verificare]
