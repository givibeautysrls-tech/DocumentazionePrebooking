# Appendice F — Checklist per Modifiche Sicure

> Procedure operative da seguire PRIMA di apportare modifiche a qualsiasi componente del sistema
> GiVi Beauty. Ogni sezione copre un tipo di modifica e i controlli necessari per evitare
> regressioni o interruzioni di servizio.

---

## Sommario

1. [Modifica di un Worker Cloudflare](#1-modifica-di-un-worker-cloudflare)
2. [Modifica di uno Script Airtable](#2-modifica-di-uno-script-airtable)
3. [Modifica di Tag o Automazioni Keap](#3-modifica-di-tag-o-automazioni-keap)
4. [Aggiunta di un Nuovo Centro](#4-aggiunta-di-un-nuovo-centro)
5. [Modifica di ID Hardcoded](#5-modifica-di-id-hardcoded)
6. [Matrice di Impatto](#6-matrice-di-impatto)

---

## 1. Modifica di un Worker Cloudflare

### Pre-modifica: Analisi impatto

- [ ] **Identificare chi chiama questo worker**

| Sorgente Chiamata | Come Verificare | Stato |
|--------------------|----------------|-------|
| Script Airtable | Cercare l'URL del worker nei CONFIG degli script | [Confermato da codice] |
| Automazioni Keap | Cercare HTTP request nelle automazioni che puntano al worker | [Confermato da codice] |
| Service binding (altri worker) | Controllare `wrangler.toml` degli altri worker per binding verso questo | [Confermato da codice] |
| Chiamate dirette esterne | Verificare se l'URL è condiviso con servizi terzi | [Inferito da contesto] |

- [ ] **Verificare i service binding in uscita**

| Worker | Binding in Uscita | Stato |
|--------|-------------------|-------|
| `lead-handler` | → `keap-utility` | [Confermato da codice] |
| `apt-monitor` | → `keap-utility` | [Confermato da codice] |
| `prebooking` | → `keap-utility` | [Confermato da codice] |
| `linkforreferral` | → `applytags` | [Confermato da codice] |

> **Attenzione speciale per `keap-utility`**: è il worker con il maggior numero di dipendenti. Qualsiasi modifica alla sua interfaccia impatta `lead-handler`, `apt-monitor` e `prebooking`. [Confermato da codice]

- [ ] **Verificare ID hardcoded che potrebbero essere impattati**
- [ ] **Controllare se il worker usa KV o D1** (modifiche allo schema dati richiedono migrazione)

### Durante la modifica

- [ ] Testare con `wrangler dev` in locale prima del deploy [Inferito da contesto]
- [ ] Se il worker ha service binding, il test locale potrebbe non funzionare completamente [Inferito da contesto]
- [ ] Verificare che la signature della request/response non cambi (backward compatibility)

### Post-modifica

- [ ] Fare deploy con `wrangler deploy`
- [ ] Verificare i log real-time: `wrangler tail --name <nome-worker>` [Inferito da contesto]
- [ ] Testare un flusso end-to-end dal trigger originale (Airtable o Keap)
- [ ] Controllare che le notifiche Pushover funzionino (se applicabile)

---

## 2. Modifica di uno Script Airtable

### Pre-modifica: Analisi impatto

> **REGOLA CRITICA**: Ogni script Airtable gira su TUTTE e 4 le basi. Una modifica si propaga automaticamente a tutti i centri. [Confermato da codice]

- [ ] **Verificare su quale base testare prima**

| Strategia | Descrizione | Stato |
|-----------|-------------|-------|
| Test su un solo centro | Modificare lo script in una sola base, testare, poi propagare | [Inferito da contesto] |
| Rollback plan | Salvare una copia dello script originale prima della modifica | [Inferito da contesto] |

- [ ] **Verificare l'endpoint worker chiamato**

| Cosa Controllare | Come | Stato |
|------------------|------|-------|
| URL nel CONFIG | Leggere l'oggetto CONFIG all'inizio dello script | [Confermato da codice] |
| Formato del payload | Verificare la struttura del body inviato al worker | [Confermato da codice] |
| Gestione errori | Verificare che lo script gestisca risposte di errore dal worker | [Inferito da contesto] |

- [ ] **Verificare i nomi dei campi Airtable**

| Rischio | Dettaglio | Stato |
|---------|-----------|-------|
| Nomi campi diversi tra basi | I campi Airtable sono referenziati per nome nello script. Se un campo ha un nome diverso in una base, lo script fallirà su quella base | [Da verificare] |
| Field ID vs nome campo | Alcuni script usano field ID (`fld...`) invece del nome. I field ID sono specifici per base | [Confermato da codice] |

### Durante la modifica

- [ ] Modificare lo script in **una sola base** per il test
- [ ] Eseguire un test con dati reali ma non critici (se possibile)
- [ ] Verificare nel log del worker che la chiamata arrivi correttamente

### Post-modifica

- [ ] Propagare la modifica alle altre 3 basi
- [ ] Testare almeno un flusso per ciascuna base
- [ ] Verificare che gli ID nel CONFIG siano corretti per ciascuna base (se diversi)

---

## 3. Modifica di Tag o Automazioni Keap

### Pre-modifica: Analisi impatto

- [ ] **Verificare se il tag ID è hardcoded**

| Dove Cercare | Metodo | Stato |
|--------------|--------|-------|
| Worker Cloudflare | Cercare l'ID numerico del tag nel codice sorgente di tutti i worker | [Confermato da codice] |
| Script Airtable | Cercare l'ID nel CONFIG degli script referral e altri | [Confermato da codice] |
| Altre automazioni Keap | Verificare se altre automazioni dipendono dallo stesso tag | [Inferito da contesto] |

- [ ] **Per automazioni con HTTP request**

| Cosa Verificare | Dettaglio | Stato |
|-----------------|-----------|-------|
| URL di destinazione | Quale worker viene chiamato | [Confermato da codice] |
| Metodo HTTP | GET, POST, etc. | [Confermato da codice] |
| Body/Headers | Dati inviati al worker | [Confermato da codice] |
| Condizioni di trigger | Su quale tag o evento si attiva | [Confermato da codice] |

- [ ] **Verificare il flusso di rimozione tag AT–**
  - Le automazioni che usano tag `AT–` dovrebbero rimuovere il tag al termine [Inferito da contesto]
  - Se si modifica la logica, assicurarsi che il tag venga ancora rimosso per evitare loop

### Matrice Tag-Codice

| Tag (esempio) | Worker che lo Applica | Automazione che lo Consuma | Stato |
|---------------|----------------------|---------------------------|-------|
| `AT–Apertura Scheda` | `apertura-scheda` | Automation Keap "Apertura" | [Inferito da contesto] |
| `AT–Rinvio` | `apertura-scheda` | Automation Keap "Rinvio" | [Inferito da contesto] |
| `AT–Annullamento` | `apertura-scheda` | Automation Keap "Annullamento" | [Inferito da contesto] |
| Tag referral | `applytags` (via `linkforreferral`) | Automation Keap referral | [Confermato da codice] |

> **Nota**: La tabella sopra è indicativa. I nomi esatti dei tag e delle automazioni vanno verificati direttamente in Keap. [Da verificare]

---

## 4. Aggiunta di un Nuovo Centro

Procedura completa per aggiungere un nuovo centro al sistema.

### Checklist Operativa

| # | Azione | Componente | Dettaglio | Stato |
|---|--------|-----------|-----------|-------|
| 1 | Creare nuova base Airtable | Airtable | Copiare una base esistente (duplica struttura e script) | [Confermato da codice] |
| 2 | Verificare field ID | Airtable | La copia genera nuovi field ID — aggiornare i CONFIG degli script se usano `fld...` | [Confermato da codice] |
| 3 | Aggiungere instance ID SendApp | `apertura-scheda` | Aggiungere l'ID della nuova istanza SendApp nel CONFIG del worker | [Confermato da codice] |
| 4 | Aggiungere routing Airtable | `lead-handler` | Aggiungere base ID e table name nella mappa `AIRTABLE_ROUTES` | [Confermato da codice] |
| 5 | Aggiungere opzione centro in Keap | Keap | Aggiungere il nuovo centro come opzione nel custom field 41 | [Confermato da codice] |
| 6 | Aggiornare centri validi | `linkforreferral` | Aggiornare la lista dei centri validi nel codice | [Confermato da codice] |
| 7 | Configurare automazioni Keap | Keap | Verificare che le automazioni esistenti gestiscano il nuovo centro | [Inferito da contesto] |
| 8 | Configurare istanza SendApp | SendApp | Creare e configurare nuova istanza WhatsApp per il centro | [Inferito da contesto] |
| 9 | Testare flusso completo | Tutti | Eseguire un test end-to-end: lead → apertura → chiusura | [Inferito da contesto] |

### Dettaglio per Componente

#### Airtable — Nuova Base

```
1. Duplicare una base esistente
2. Verificare che tutti gli script siano copiati
3. Aggiornare i CONFIG degli script con i nuovi field ID (se necessario)
4. Verificare che i nomi delle tabelle siano identici
```

[Inferito da contesto]

#### lead-handler — AIRTABLE_ROUTES

```javascript
// Esempio struttura AIRTABLE_ROUTES (da verificare nel codice)
const AIRTABLE_ROUTES = {
  "centro1": { baseId: "app...", tableName: "Lead" },
  "centro2": { baseId: "app...", tableName: "Lead" },
  // Aggiungere qui il nuovo centro
  "centroNuovo": { baseId: "appNEW...", tableName: "Lead" }
};
```

[Confermato da codice]

#### apertura-scheda — CONFIG SendApp

```javascript
// Esempio struttura (da verificare nel codice)
const SENDAPP_INSTANCES = {
  "centro1": "instance-id-1",
  "centro2": "instance-id-2",
  // Aggiungere qui
  "centroNuovo": "instance-id-new"
};
```

[Confermato da codice]

---

## 5. Modifica di ID Hardcoded

### Procedura

| # | Azione | Dettaglio | Stato |
|---|--------|-----------|-------|
| 1 | **Cercare il vecchio ID OVUNQUE** | Cercare in tutti i worker e tutti gli script Airtable | [Confermato da codice] |
| 2 | Documentare tutte le occorrenze | Elencare file, riga, contesto per ogni occorrenza trovata | [Inferito da contesto] |
| 3 | Aggiornare ogni occorrenza | Sostituire con il nuovo ID in tutti i punti trovati | [Confermato da codice] |
| 4 | Aggiornare la documentazione | Aggiornare questa documentazione e i commenti nel codice | [Inferito da contesto] |
| 5 | Testare end-to-end | Verificare tutti i flussi che usano quell'ID | [Inferito da contesto] |

### Dove Cercare gli ID

| Tipo ID | Formato | Dove Cercare | Stato |
|---------|---------|-------------|-------|
| Airtable Record ID | `rec...` (17 caratteri) | Script Airtable CONFIG, Worker code | [Confermato da codice] |
| Airtable Field ID | `fld...` (17 caratteri) | Script Airtable CONFIG | [Confermato da codice] |
| Airtable Base ID | `app...` (17 caratteri) | Worker env vars, Script CONFIG | [Confermato da codice] |
| Airtable Table ID | `tbl...` (17 caratteri) | Script code | [Inferito da contesto] |
| Keap Tag ID | Numero intero | Worker code, Script CONFIG, Keap automations | [Confermato da codice] |
| Keap Custom Field ID | Numero intero | Worker code (es. `custom_fields[41]`) | [Confermato da codice] |
| SendApp Instance ID | Stringa | Worker CONFIG | [Confermato da codice] |

### Comandi di Ricerca Suggeriti

```bash
# Cercare un ID in tutti i file del progetto
grep -r "recZqxq5Uji0ZTO5z" --include="*.js" --include="*.toml" .

# Cercare un tag ID numerico (attenzione ai falsi positivi)
grep -r "12345" --include="*.js" .
```

[Inferito da contesto]

> **Attenzione**: I tag ID numerici sono particolarmente insidiosi perché un numero come `1234` potrebbe apparire in contesti diversi. Verificare sempre il contesto dell'occorrenza. [Inferito da contesto]

---

## 6. Matrice di Impatto

### Componente modificato → Cosa può rompersi

| Se Modifichi... | Potrebbe Rompere... | Gravità | Stato |
|-----------------|---------------------|---------|-------|
| `keap-utility` (interfaccia) | `lead-handler`, `apt-monitor`, `prebooking` | **CRITICA** | [Confermato da codice] |
| `applytags` (interfaccia) | `linkforreferral`, script referral Airtable | **ALTA** | [Confermato da codice] |
| `apertura-scheda` (endpoint) | Tutti gli script Airtable di gestione scheda | **CRITICA** | [Confermato da codice] |
| Script Airtable (qualsiasi) | Operatività di TUTTI i 4 centri | **CRITICA** | [Confermato da codice] |
| Tag ID Keap | Automazioni Keap + worker/script che lo referenziano | **ALTA** | [Confermato da codice] |
| Custom Field ID Keap | Worker che leggono/scrivono quel campo | **ALTA** | [Confermato da codice] |
| Field ID Airtable | Script che usano quel field ID | **MEDIA** (una base) | [Confermato da codice] |
| Variabile d'ambiente | Il worker specifico | **MEDIA** | [Inferito da contesto] |
| Struttura tabella Airtable | Script che referenziano i campi per nome | **ALTA** | [Inferito da contesto] |
| Nome tabella Airtable | Script e worker che usano quel nome | **ALTA** | [Inferito da contesto] |

### Ordine di Rischio dei Worker

| Worker | Rischio Modifica | Motivo |
|--------|------------------|--------|
| `keap-utility` | **Massimo** | 3 worker dipendono da esso via service binding |
| `apertura-scheda` | **Molto Alto** | Hub centrale per tutti i flussi prebooking |
| `applytags` | **Alto** | Usato da `linkforreferral` e script referral |
| `lead-handler` | **Medio-Alto** | Unico punto di ingresso lead Facebook |
| `apt-monitor` | **Medio** | Logging e monitoraggio, impatto su visibilità |
| `prebooking` | **Medio** | Sync appuntamenti |
| `sendapp-monitor` | **Medio** | Monitoraggio WhatsApp |
| `linkforreferral` | **Basso** | Solo flusso referral |
| `leadgen` | **Basso** | Flusso lead separato |
| `find-contact-id` | **Basso** | Utility di ricerca |
| `getcontactinfo` | **Basso** | Utility di lettura |

---

> **Regola d'oro**: in caso di dubbio, non modificare. Chiedere prima, agire poi. Il sistema ha molte dipendenze implicite che non sono immediatamente visibili. [Inferito da contesto]
