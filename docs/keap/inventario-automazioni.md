# Inventario Automazioni Keap — GiVi Beauty / NMV

> Fonte: `keap-backup/automations_report.md` — Analisi del 24 marzo 2026

---

## 1. Elenco completo automazioni

| ID | Nome | Categoria | Trigger principale | Tipo azioni | Stato |
|----|------|-----------|--------------------|-------------|-------|
| 7 | Conferma Email | — | Form submit o tag [Inferito da contesto] | Email di conferma | [Da verificare] |
| 13 | Pulizia Contatti | — | Periodico o manuale [Inferito da contesto] | Tag remove, update | [Da verificare] |
| 15 | NMV – Temperatura clienti | NMV | Tag applicato (stato cliente) | Email, delay, tag | [Da verificare] |
| 17 | Contatti Salon Startup | — | Form o tag [Inferito da contesto] | Tag, email | [Da verificare] |
| 69 | MH – Salon Startup – 24 Marzo – Temp | Salon Startup | Data o tag evento [Inferito da contesto] | Email | [Da verificare] |
| 75 | NMV – PreBooking | NMV | Tag applicato (interesse prenotazione) | Email, delay, tag | [Da verificare] |
| 135 | Contatti NMV – WelcomeOptin | NMV | Web Form / optin | Email, tag | [Da verificare] |
| **179** | **NMV – Nuovo Appuntamento** | **NMV** | **Tag applicato (Appuntamento 1 o 2)** | **HTTP Request, field timer, tag** | **[Da verificare]** |
| 185 | NMV – Recensioni | NMV | Tag post-visita [Inferito da contesto] | Email, tag | [Da verificare] |
| **201** | **NMV – Appuntamento Rimandato/Annullato** | **NMV** | **Tag applicato (Annullato/Rinviato)** | **HTTP Request, tag remove** | **[Da verificare]** |
| 205 | NMV – Closed Opportunity | NMV | Opportunity stage changed | Tag, update contatto | [Da verificare] |
| 319 | NMV – Referral – Grazie | NMV | Tag applicato | Email | [Da verificare] |
| 321 | NMV – Referral – Benvenuto nuovo referree + invio buono | NMV | Tag applicato (nuovo referree) | Email, tag | [Da verificare] |
| 323 | NMV – Referral – Invio Premio | NMV | Tag applicato | Email, tag | [Da verificare] |
| 325 | NMV – Referral – Invito al programma | NMV | Tag applicato | Email | [Da verificare] |
| 327 | NMV – Referral – Invio link Referral + followup | NMV | Tag applicato | Email, tag | [Da verificare] |
| 329 | NMV – Referral – Temperatura | NMV | Tag applicato | Email, delay, tag | [Da verificare] |
| 331 | NMV – Referral – Riattivazione Referral | NMV | Tag applicato (stato referral) | Email, tag | [Da verificare] |
| 339 | NMV – Referral – Followup Adesione Referral | NMV | Tag applicato (adesione referral) | Email, tag | [Da verificare] |
| 343 | NMV – Referral – Richiesto messaggio invito | NMV | Tag applicato (evento referral) | Email/messaggio | [Da verificare] |
| 353 | NMV – Feedback trimestrale | NMV | Tag o data [Inferito da contesto] | Email, tag | [Da verificare] |
| 497 | Compleanni | NMV | Data compleanno contatto [Inferito da contesto] | Email/messaggio, tag | [Da verificare] |
| 511 | NMV – Temperatura rinvii | — | Tag applicato (3 tag rinvio/A4-A5) | Tag add/remove, delay 30gg | [Da verificare] |

---

## 2. Analisi approfondita — Automazione 179: NMV – Nuovo Appuntamento

### Scopo

Gestisce l'intero ciclo di comunicazione per un appuntamento prenotato: dalla conferma immediata ai reminder progressivi prima della data, con percorsi separati per tipo di servizio (Fusion vs ProSkin) e per slot temporale. [Confermato da codice]

### Trigger

L'automazione ha **due trigger distinti e paralleli** [Confermato da codice]:

| Trigger | Tag |
|---------|-----|
| Trigger 1 — "Applicato TAG App1" | `AT – NMV – Appuntamenti – Appuntamento 1` (ID 285) |
| Trigger 2 — "Applicato TAG App2" | `AT – NMV – Appuntamenti – Appuntamento 2` (ID 287) |

### Flusso dettagliato

```
Tag Appuntamento 1/2 applicato (dal worker apertura-scheda)
    |
    v
[ATTESA 1h] -- Delay per stabilizzare dati in Keap
    |
    v
[Decision Diamond #1]
    |
    +-- Tag "A1: Fusion" + NO "Bassa Frequenza" --> Sequenza messaggi Fusion
    |       |
    |       +-- HTTP Request: conferma appuntamento (immediato)
    |       +-- Field Timer: 15gg lavorativi prima di a1:data alle 8:00
    |       +-- HTTP Request: reminder 15gg
    |       +-- Field Timer: 7gg prima di a1:data alle 8:00
    |       +-- HTTP Request: reminder 7gg
    |
    +-- Tag "A1: ProSkin" + NO "Bassa Frequenza" --> Sequenza messaggi ProSkin
    |       (stessa struttura, messaggi diversi)
    |
    +-- Tag "Puntuale e premiata" --> Percorso promozionale
    |
    +-- Default: nessuna azione
    |
    v
[Goal parallelo: "Rimuovi TAG apt1"] -- Pulizia tag a fine flusso
    |
[Goal parallelo: "Applicato TAG Annullato/Rinviato"] -- Exit path
```

[Confermato da codice]

### Azioni principali

| Tipo azione | Dettaglio | Fonte |
|-------------|-----------|-------|
| HTTP Request | Invio messaggio conferma appuntamento (WhatsApp via worker) | [Confermato da codice] |
| Field Timer | Attesa fino a N giorni prima della data appuntamento (campo `a1: data`) | [Confermato da codice] |
| HTTP Request | Invio reminder 15gg e 7gg prima | [Confermato da codice] |
| Tag remove | Rimozione tag trigger al termine del flusso | [Confermato da codice] |
| Goal | Exit anticipata se tag annullato/rinviato applicato | [Confermato da codice] |

### Workers/endpoints chiamati

| Azione | Endpoint | Fonte |
|--------|----------|-------|
| Conferma appuntamento | Worker Cloudflare (HTTP Request) — verosimilmente `sendapp-monitor` o endpoint WhatsApp diretto | [Inferito da contesto] |
| Reminder 15gg/7gg | Stesso pattern HTTP Request | [Inferito da contesto] |

### Dipendenze

| Dipendenza | Dettaglio |
|------------|-----------|
| Tag trigger | 285 (App1), 287 (App2) — applicati da `apertura-scheda` worker [Confermato da codice] |
| Tag servizio | 307/309 (Fusion/ProSkin A1), 311/313 (A2) — applicati da `apertura-scheda` [Confermato da codice] |
| Tag filtro | 347 (Bassa Frequenza Messaggi), 385 (Puntuale e premiata) [Confermato da codice] |
| Custom fields | `a1: data` (ID 185), `a2: data` (ID 179) — usati dai Field Timer [Confermato da codice] |
| Automazione correlata | 201 (Rimandato/Annullato) — exit path [Confermato da codice] |
| Automazione correlata | 511 (Temperatura rinvii) — follow-up post-rinvio [Confermato da codice] |

### Criticita'

1. **Tag come unico stato**: applicazione errata o mancante di un tag (es. manca A1:Fusion) fa cadere il contatto nel ramo "default" senza fallback o alert [Confermato da codice]
2. **Timing fragile**: i Field Timer dipendono dal campo `a1: data` valorizzato entro l'ora di attesa iniziale. Se il dato non arriva, comportamento imprevedibile [Confermato da codice]
3. **Duplicazione App1/App2**: struttura identica duplicata. Modifiche vanno applicate manualmente su entrambi i rami [Confermato da codice]
4. **Solo App1/App2 documentati**: l'automazione copre solo i primi 2 slot. Slot 3, 4, 5 non hanno automazione equivalente documentata [Inferito da contesto]

---

## 3. Analisi approfondita — Automazione 201: NMV – Appuntamento Rimandato/Annullato

### Scopo

Gestisce messaggi e pulizia tag per appuntamenti annullati o rimandati. Reazione immediata, senza delay. [Confermato da codice]

### Trigger

| Trigger | Tag | ID Tag |
|---------|-----|--------|
| A3 Rimandato | `AT – NMV – Appuntamenti – A3: Rinviato` | 303 |
| A1: Annullato | `AT – NMV – Appuntamenti – A1: Annullato` | 291 |
| A2: Annullato | `AT – NMV – Appuntamento – A2: Annullato` | 293 |

[Confermato da codice]

### Flusso dettagliato

```
Trigger A3:Rinviato
    |
    v
[Diamond] --> "Messaggi Rimandato" (HTTP Request)
    |
    v
"Rimuovi TAG Rimandato"

---

Trigger A1:Annullato + A2:Annullato (convergono)
    |
    v
[Diamond condiviso] --> "Messaggi Annullato" (HTTP Request)
    |
    v
"Rimuovi TAG Annullato"

---

Trigger A2:Annullato (terzo trigger separato)
    |
    v
[Diamond] --> "Messaggi Annullato" + "Rimuovi TAG Annullato"
```

[Confermato da codice]

### Workers/endpoints chiamati

| Azione | Endpoint | Fonte |
|--------|----------|-------|
| Messaggi Rimandato | HTTP Request verso worker Cloudflare (WhatsApp) | [Inferito da contesto] |
| Messaggi Annullato | HTTP Request verso worker Cloudflare (WhatsApp) | [Inferito da contesto] |

### Dipendenze

| Dipendenza | Dettaglio |
|------------|-----------|
| Tag trigger | 303 (A3:Rinviato), 291 (A1:Annullato), 293 (A2:Annullato) — applicati da `apertura-scheda` [Confermato da codice] |
| Automazione collegata | 179 (Nuovo Appuntamento) — genera i tag come exit goal [Confermato da codice] |
| Automazione collegata | 511 (Temperatura rinvii) — prende il controllo dopo rinvio [Confermato da codice] |

### Criticita'

1. **Tre trigger per due casi**: la presenza di un terzo trigger A2:Annullato separato e' anomala. Possibile duplicazione o caso edge [Confermato da codice]
2. **Nessun fallback**: se il Diamond non ha regole soddisfatte, il contatto resta senza messaggio e senza cleanup tag (tag zombie) [Confermato da codice]
3. **Nessun re-engagement diretto**: la riprenotazione e' delegata ad altri flussi non esplicitamente connessi [Confermato da codice]
4. **Copertura parziale**: solo A1, A2, A3 coperti. Tag A4 (371) e A5 (383) esistono nel codice ma non hanno trigger in questa automazione [Inferito da contesto]

---

## 4. Flussi principali identificati

### Flusso Appuntamento — Happy path

```
Airtable: click "Apri Scheda"
    -> Script apertura_scheda.js -> Worker apertura-scheda
        -> Crea/aggiorna contatto Keap
        -> Scrive custom fields (trattamenti, data, ora)
        -> Applica tag Appuntamento N + Fusion/ProSkin
            -> Automazione 179 si attiva
                -> Conferma + reminder pre-appuntamento
                    -> Appuntamento eseguito
                        -> Puntuale e premiata / Recensione
```

[Confermato da codice]

### Flusso Appuntamento — Annullato

```
Airtable: click "Annulla Appuntamento"
    -> Script annulla_appuntamento.js -> Worker apertura-scheda
        -> Aggiorna ContactAction (XML-RPC: Annullato=1)
        -> Rimuove tag slot + ProSkin/Fusion
        -> Applica tag A{N}: Annullato
            -> Automazione 201 si attiva
                -> Invia messaggio annullamento
                -> Rimuove tag trigger
```

[Confermato da codice]

### Flusso Appuntamento — Rinviato

```
Airtable: click "Rinvia Appuntamento"
    -> Script rinvio_appuntamento.js -> Worker apertura-scheda
        -> Rimuove tag slot corrente + ProSkin/Fusion
        -> Applica tag A{N}: Rinviato
            -> Automazione 201 si attiva (per A3)
                -> Invia messaggio rinvio
            -> Automazione 511 si attiva (temperatura rinvii)
```

[Confermato da codice]

### Flusso Referral

```
Worker linkforreferral:
    -> Crea nuovo contatto (referree) in Keap
    -> Applica tag 333 al referrer (Nuovo Contatto Presentato)
    -> Applica tag 335 al referree (Contatto Referral)
        -> Automazioni Referral (321, 325, 327, etc.) si attivano

Script referral_riscattato.js:
    -> Applica tag 337 al cliente (Buono Usato)
    -> Applica tag 355 al referrer (Referree entrato)

Script pacco_consegnato.js:
    -> Applica tag 357 (Pacco Ricevuto)
```

[Confermato da codice]

---

## 5. Automazioni senza analisi approfondita

Le seguenti automazioni non hanno un'analisi dettagliata nel report. Il loro funzionamento e' inferito dal nome e dalla struttura generale del sistema.

| ID | Nome | Connessione con worker | Fonte |
|----|------|----------------------|-------|
| 7 | Conferma Email | Nessuna nota | [Da verificare] |
| 13 | Pulizia Contatti | Nessuna nota | [Da verificare] |
| 15 | Temperatura clienti | Nessuna nota | [Da verificare] |
| 75 | PreBooking | Possibile connessione con worker `prebooking` | [Da verificare] |
| 135 | WelcomeOptin | Nessuna nota | [Da verificare] |
| 185 | Recensioni | Tag 297 (Start) applicato da `apertura-scheda` [Confermato da codice] | [Confermato da codice] |
| 205 | Closed Opportunity | Tag 305 (Closed Opportunity) | [Da verificare] |
| 319-343 | Flussi Referral (8 automazioni) | Tag 333, 335, 337, 355, 357 applicati da worker/script [Confermato da codice] | Parzialmente [Confermato da codice] |
| 353 | Feedback trimestrale | Nessuna nota | [Da verificare] |
| 497 | Compleanni | Tag 399 (Compleanno) | [Da verificare] |
| 511 | Temperatura rinvii | Tag di rinvio A4/A5 | [Da verificare] |
