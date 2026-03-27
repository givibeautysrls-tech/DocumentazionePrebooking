# Appendice D — Catalogo Eventi e Logging

> Catalogo completo di tutti i sistemi di logging, eventi tracciati e notifiche
> generati dal sistema GiVi Beauty.

---

## Sommario

1. [Panoramica Sistemi di Logging](#1-panoramica-sistemi-di-logging)
2. [apertura-scheda: Logging KV](#2-apertura-scheda-logging-kv)
3. [sendapp-monitor: Logging D1](#3-sendapp-monitor-logging-d1)
4. [apt-monitor: Logging D1](#4-apt-monitor-logging-d1)
5. [Notifiche Pushover](#5-notifiche-pushover)
6. [Matrice Evento-Azione](#6-matrice-evento-azione)

---

## 1. Panoramica Sistemi di Logging

| Worker | Storage | Tecnologia | Retention | Stato |
|--------|---------|------------|-----------|-------|
| `apertura-scheda` | KV Namespace (`LOGS_KV`) | Cloudflare Workers KV | 30 giorni (TTL) | [Confermato da codice] |
| `sendapp-monitor` | D1 Database (`DB`) | Cloudflare D1 (SQLite) | Permanente | [Confermato da codice] |
| `apt-monitor` | D1 Database (`DB`) | Cloudflare D1 (SQLite) | Permanente | [Confermato da codice] |
| `lead-handler` | Nessuno dedicato | — | — | [Inferito da contesto] |
| `prebooking` | Nessuno dedicato | — | — | [Inferito da contesto] |

---

## 2. apertura-scheda: Logging KV

### Configurazione

| Parametro | Valore | Stato |
|-----------|--------|-------|
| Namespace KV | `LOGS_KV` | [Confermato da codice] |
| TTL | 30 giorni (2.592.000 secondi) | [Confermato da codice] |
| Formato chiave | Specifico per operazione | [Da verificare] |

### Eventi Loggati

| Evento | Descrizione | Dati Registrati | Stato |
|--------|-------------|-----------------|-------|
| `apertura` | Apertura di una nuova scheda prebooking | ID contatto, centro, timestamp, slot A1-A5 | [Confermato da codice] |
| `chiusura` | Chiusura scheda dopo completamento appuntamento | ID contatto, esito, timestamp | [Confermato da codice] |
| `rinvio` | Rinvio di un appuntamento a nuova data | ID contatto, vecchia data, nuova data, timestamp | [Confermato da codice] |
| `annulla` | Annullamento di un appuntamento | ID contatto, motivo (se presente), timestamp | [Confermato da codice] |

### Formato della Chiave KV

| Componente | Descrizione | Stato |
|------------|-------------|-------|
| Pattern | Da determinare — potrebbe essere `{evento}:{contactId}:{timestamp}` o simile | [Da verificare] |
| Valore | JSON serializzato con dettagli dell'operazione | [Inferito da contesto] |

> **Nota**: I dati KV hanno una retention di 30 giorni grazie al TTL impostato. Dopo la scadenza, le entry vengono automaticamente rimosse da Cloudflare. Non esiste un meccanismo di backup o esportazione dei log. [Confermato da codice]

### Limitazioni KV per il Logging

| Limitazione | Impatto | Stato |
|-------------|---------|-------|
| Nessun indice di ricerca | Non è possibile fare query per data o contatto — solo lookup per chiave esatta | [Confermato da codice] |
| TTL fisso 30 giorni | Log storici oltre 30 giorni non disponibili | [Confermato da codice] |
| Eventual consistency | Le scritture KV possono impiegare fino a 60 secondi per propagarsi globalmente | [Confermato da codice] |

---

## 3. sendapp-monitor: Logging D1

### Configurazione

| Parametro | Valore | Stato |
|-----------|--------|-------|
| Binding D1 | `DB` | [Confermato da codice] |
| Retention | Permanente (nessun TTL automatico) | [Inferito da contesto] |

### Dati Tracciati

| Campo | Tipo | Descrizione | Stato |
|-------|------|-------------|-------|
| Status messaggio | Stringa | Stato della consegna WhatsApp (sent, delivered, read, failed) | [Confermato da codice] |
| Retry count | Intero | Numero di tentativi di invio | [Confermato da codice] |
| Timestamp invio | DateTime | Momento dell'invio iniziale | [Confermato da codice] |
| Timestamp ultimo aggiornamento | DateTime | Ultimo cambio di stato | [Confermato da codice] |
| ID istanza SendApp | Stringa | Identificativo dell'istanza SendApp (per centro) | [Inferito da contesto] |
| Destinatario | Stringa | Numero di telefono destinatario | [Inferito da contesto] |

### Schema Tabella D1

> Lo schema esatto delle tabelle D1 va verificato nel codice del worker o nella configurazione Cloudflare. [Da verificare]

| Tabella Presunta | Descrizione | Stato |
|------------------|-------------|-------|
| `messages` o simile | Log di tutti i messaggi WhatsApp inviati/ricevuti | [Da verificare] |

---

## 4. apt-monitor: Logging D1

### Configurazione

| Parametro | Valore | Stato |
|-----------|--------|-------|
| Binding D1 | `DB` | [Confermato da codice] |
| Retention | Permanente | [Inferito da contesto] |

### Eventi Tracciati

| Evento | Trigger | Dati Registrati | Stato |
|--------|---------|-----------------|-------|
| Rinvio appuntamento | Notifica da Keap/cron | ID contatto, data originale, nuova data, centro | [Confermato da codice] |
| Annullamento appuntamento | Notifica da Keap/cron | ID contatto, data appuntamento, centro, motivo | [Confermato da codice] |

### Riepilogo Giornaliero

| Parametro | Descrizione | Stato |
|-----------|-------------|-------|
| Frequenza | Giornaliero (via cron trigger Cloudflare) | [Confermato da codice] |
| Canale | Pushover notification | [Confermato da codice] |
| Contenuto | Conteggio rinvii e annullamenti del giorno, suddivisi per centro | [Inferito da contesto] |
| Destinatario | Device specificato in `PUSHOVER_DEVICE` | [Confermato da codice] |

---

## 5. Notifiche Pushover

### Worker che Inviano Notifiche

| Worker | Tipo Notifica | Quando | Priorità | Stato |
|--------|--------------|--------|----------|-------|
| `apertura-scheda` | Errore/Conferma | Errori nel flusso apertura/chiusura/rinvio/annulla | Normale | [Confermato da codice] |
| `apt-monitor` | Riepilogo giornaliero | Fine giornata (cron) | Normale | [Confermato da codice] |
| `apt-monitor` | Evento critico | Annullamenti multipli o anomalie | Alta | [Inferito da contesto] |
| `prebooking` | Errore | Fallimento sincronizzazione next appointment | Normale | [Confermato da codice] |
| `leadgen` | Nuovo lead | Arrivo di un nuovo lead | Normale | [Confermato da codice] |

### Parametri Pushover per Worker

| Worker | `PUSHOVER_TOKEN` | `PUSHOVER_USER` | `PUSHOVER_DEVICE` | `PUSHOVER_TITLE` | Stato |
|--------|-----------------|-----------------|-------------------|------------------|-------|
| `apertura-scheda` | Si | Si | No | No (hardcoded o dinamico) | [Confermato da codice] |
| `apt-monitor` | Si | Si | Si | Si | [Confermato da codice] |
| `prebooking` | Si | Si | No | No | [Confermato da codice] |
| `leadgen` | Si | Si | No | No | [Confermato da codice] |

---

## 6. Matrice Evento-Azione

### Ciclo di Vita Appuntamento

| Evento | Log KV | Log D1 | Pushover | Tag Keap | Aggiornamento Airtable | Stato |
|--------|--------|--------|----------|----------|----------------------|-------|
| Apertura scheda | Si (`LOGS_KV`) | — | Su errore | `AT–Apertura Scheda` | Si (Prebooking) | [Confermato da codice] |
| Chiusura scheda | Si (`LOGS_KV`) | — | Su errore | Tag di stato | Si (Appuntamenti, Clienti) | [Confermato da codice] |
| Rinvio appuntamento | Si (`LOGS_KV`) | Si (`apt-monitor` DB) | Si (riepilogo) | `AT–Rinvio` | Si (Appuntamenti) | [Confermato da codice] |
| Annullamento | Si (`LOGS_KV`) | Si (`apt-monitor` DB) | Si (riepilogo) | `AT–Annullamento` | Si (Appuntamenti) | [Confermato da codice] |
| Nuovo lead Facebook | — | — | Si (`leadgen`) | Creazione contatto | Si (Lead) | [Confermato da codice] |
| Messaggio WhatsApp | — | Si (`sendapp-monitor` DB) | — | — | — | [Confermato da codice] |
| Referral | — | — | — | Tag referral | Si (Referral) | [Inferito da contesto] |
| Sync next appointment | — | — | Su errore | Aggiornamento campo | — | [Confermato da codice] |

### Flusso Temporale degli Eventi (esempio appuntamento completo)

```
1. [Lead Facebook]     → leadgen logga in Airtable + Pushover
2. [Apertura Scheda]   → apertura-scheda logga in KV + tag AT– in Keap
3. [Messaggio WhatsApp] → sendapp-monitor logga in D1
4. [Sync Appointment]  → prebooking aggiorna Keap (Pushover solo su errore)
5. [Chiusura Scheda]   → apertura-scheda logga in KV + aggiornamento Keap/Airtable
   OPPURE
5a. [Rinvio]           → apertura-scheda logga in KV + apt-monitor logga in D1
5b. [Annullamento]     → apertura-scheda logga in KV + apt-monitor logga in D1
6. [Riepilogo Giorno]  → apt-monitor invia Pushover con totali
```

[Inferito da contesto]

---

> **Nota importante**: Non esiste un sistema di logging centralizzato. I log sono distribuiti tra KV (30 giorni, senza ricerca), D1 (permanente, queryable con SQL) e Pushover (notifiche real-time senza storico). Per un audit completo di un appuntamento, è necessario consultare almeno 3 fonti diverse. [Inferito da contesto]
