# Appendice E — Checklist Onboarding Tecnico

> Guida passo-passo per un nuovo sviluppatore o tecnico che si approccia al sistema GiVi Beauty.
> Ogni punto include riferimenti alla documentazione e indicazioni pratiche.

---

## Prerequisiti

Prima di iniziare, assicurarsi di avere:

| Requisito | Dettaglio | Stato |
|-----------|-----------|-------|
| Account Cloudflare | Accesso al dashboard del progetto GiVi Beauty | [Confermato da codice] |
| Wrangler CLI | Installato e configurato (`npm install -g wrangler`) | [Inferito da contesto] |
| Account Airtable | Accesso alle 4 basi (una per centro) | [Confermato da codice] |
| Account Keap | Accesso CRM con permessi di visualizzazione automazioni e contatti | [Confermato da codice] |
| Node.js | Versione LTS per sviluppo locale dei worker | [Inferito da contesto] |

---

## Checklist

### Fase 1 — Comprensione dell'Architettura

#### 1.1 Comprendere l'architettura a 3 domini

- [ ] Leggere [01-panorama-sistema.md](../01-panorama-sistema.md)
- [ ] Comprendere il flusso dati: **Airtable** (interfaccia operativa) → **Workers** (logica e orchestrazione) → **Keap** (CRM e automazioni)

| Dominio | Ruolo | Tecnologia | Stato |
|---------|-------|------------|-------|
| Airtable | Interfaccia operatore, dati operativi, trigger manuali | Airtable + Script JS | [Confermato da codice] |
| Cloudflare Workers | Logica di business, routing, integrazione | Cloudflare Workers + KV + D1 | [Confermato da codice] |
| Keap CRM | Anagrafica contatti, automazioni, tag | Keap (Infusionsoft) | [Confermato da codice] |

#### 1.2 Ottenere gli accessi necessari

- [ ] **Cloudflare Dashboard**: chiedere l'invito al team
  - Verificare di vedere tutti i worker in `notifichegielvi.workers.dev`
  - Verificare accesso a KV Namespace e D1 Database
- [ ] **Airtable**: chiedere accesso a tutte e 4 le basi

| Base Airtable | Centro | Stato |
|---------------|--------|-------|
| Base 1 | Centro 1 | [Confermato da codice] |
| Base 2 | Centro 2 | [Confermato da codice] |
| Base 3 | Centro 3 | [Confermato da codice] |
| Base 4 | Centro 4 | [Confermato da codice] |

> **Nota**: I nomi esatti delle basi e dei centri vanno verificati nel dashboard Airtable. [Da verificare]

- [ ] **Keap CRM**: chiedere accesso con ruolo adeguato
  - Verificare di poter vedere: Contatti, Tag, Custom Field, Automazioni

#### 1.3 Comprendere il sistema di slot A1-A5

- [ ] Leggere [05-glossario.md](../05-glossario.md) (sezione Slot Appuntamento)
- [ ] Leggere [convenzioni-naming.md](./convenzioni-naming.md#3-slot-appuntamento)

| Slot | Campo | Contenuto | Stato |
|------|-------|-----------|-------|
| A1 | `A1Trattamenti` | Trattamento prenotato | [Confermato da codice] |
| A2 | `A2Data` | Data appuntamento | [Confermato da codice] |
| A3 | `A3Ora` | Orario | [Confermato da codice] |
| A4 | `A4Durata` | Durata | [Confermato da codice] |
| A5 | `A5Note` | Note | [Confermato da codice] |

- [ ] Comprendere che gli slot sono replicati sia in Keap (custom field) che in Airtable (campi tabella)

---

### Fase 2 — Comprensione dei Flussi

#### 2.1 Orchestrazione basata su tag

- [ ] Leggere [02-mappa-domini.md](../02-mappa-domini.md) (sezione Keap)
- [ ] Comprendere il meccanismo:

```
1. Worker/Script applica tag AT– al contatto Keap
2. Keap Automation si attiva sul tag
3. Automation esegue azioni (email, HTTP request, etc.)
4. Automation rimuove il tag AT– al termine
```

[Confermato da codice]

| Tipo Tag | Scopo | Ciclo di Vita | Stato |
|----------|-------|---------------|-------|
| `AT–` | Trigger automazione | Applicato → Consumato → Rimosso | [Confermato da codice] |
| `S–` | Stato contatto | Applicato → Sostituito da nuovo stato | [Inferito da contesto] |
| `A–` | Attributo/azione | Applicato → Persistente | [Inferito da contesto] |

#### 2.2 Ciclo di vita del prebooking

- [ ] Leggere [03-flussi-end-to-end.md](../03-flussi-end-to-end.md)
- [ ] Tracciare il flusso completo:

| Fase | Azione | Attore | Worker Coinvolto | Stato |
|------|--------|--------|-----------------|-------|
| 1 | Apertura scheda | Operatore in Airtable | `apertura-scheda` | [Confermato da codice] |
| 2 | Compilazione slot A1-A5 | Operatore in Airtable | — | [Confermato da codice] |
| 3 | Sync appuntamento | Automatico/manuale | `prebooking` | [Confermato da codice] |
| 4a | Chiusura (completato) | Operatore in Airtable | `apertura-scheda` | [Confermato da codice] |
| 4b | Rinvio (posticipo) | Operatore in Airtable | `apertura-scheda` + `apt-monitor` | [Confermato da codice] |
| 4c | Annullamento | Operatore in Airtable | `apertura-scheda` + `apt-monitor` | [Confermato da codice] |

#### 2.3 Flusso referral

- [ ] Leggere [03-flussi-end-to-end.md](../03-flussi-end-to-end.md) (sezione Referral)
- [ ] Comprendere la catena: Script Airtable → `linkforreferral` → `applytags` (via service binding) → Keap

#### 2.4 Integrazione SendApp

- [ ] Comprendere che ogni centro ha la propria istanza SendApp [Inferito da contesto]
- [ ] Verificare gli instance ID nel CONFIG di `apertura-scheda`

| Centro | Instance ID SendApp | Stato |
|--------|-------------------|-------|
| Centro 1-4 | Configurato nel worker | [Da verificare] |

---

### Fase 3 — Setup Tecnico

#### 3.1 Variabili d'ambiente e secrets

- [ ] Leggere [variabili-configurazioni.md](./variabili-configurazioni.md)
- [ ] Per ogni worker, verificare che i secrets siano configurati:

```bash
# Elenco secrets di un worker
wrangler secret list --name <nome-worker>
```

- [ ] **NON** inserire mai secrets nel `wrangler.toml`

#### 3.2 ID hardcoded

- [ ] Identificare gli ID hardcoded critici:

| Tipo ID | Esempio | Dove si Trova | Stato |
|---------|---------|---------------|-------|
| Airtable Record ID | `recZqxq5Uji0ZTO5z` | Script CONFIG | [Confermato da codice] |
| Airtable Field ID | `fld...` | Script CONFIG | [Confermato da codice] |
| Keap Tag ID | Numeri interi | Script/Worker CONFIG | [Confermato da codice] |
| Keap Custom Field ID | es. `41` (centro) | Worker code | [Confermato da codice] |

- [ ] Comprendere che gli ID non hanno nomi leggibili — documentarli sempre

#### 3.3 Ambiente di test

- [ ] Verificare se esiste un ambiente di test/staging [Da verificare — potrebbe non esistere]
- [ ] Se non esiste, usare estrema cautela:
  - Testare modifiche su un singolo centro prima di propagare
  - Usare `wrangler dev` per test locali dove possibile
  - Non modificare tag o automazioni Keap senza backup del flusso

---

### Fase 4 — Verifica Comprensione

Prima di operare autonomamente, verificare di saper rispondere a queste domande:

| # | Domanda di Verifica | Risposta Attesa |
|---|---------------------|-----------------|
| 1 | Cosa succede quando un operatore clicca "Apri Scheda" in Airtable? | Lo script chiama `apertura-scheda` worker che crea/aggiorna il contatto Keap |
| 2 | Come fa Keap a sapere che deve avviare un'automazione? | Tramite l'applicazione di un tag `AT–` |
| 3 | Perché `keap-utility` esiste come worker separato? | Per centralizzare l'accesso a Keap e condividere il token via service binding |
| 4 | Cosa succede se modifico un field ID in uno script? | La modifica si applica a TUTTE le 4 basi — testare prima su una |
| 5 | Dove trovo i log di un'operazione di ieri? | KV (`LOGS_KV`) per operazioni scheda, D1 per apt-monitor e sendapp-monitor |
| 6 | Come aggiungo un nuovo centro? | Vedere [checklist-modifica-sicura.md](./checklist-modifica-sicura.md#4-aggiunta-nuovo-centro) |

---

### Documenti di Riferimento

| Documento | Contenuto | Priorità Lettura |
|-----------|-----------|------------------|
| [01-panorama-sistema.md](../01-panorama-sistema.md) | Architettura generale | Alta |
| [02-mappa-domini.md](../02-mappa-domini.md) | Dettaglio per dominio | Alta |
| [03-flussi-end-to-end.md](../03-flussi-end-to-end.md) | Flussi completi | Alta |
| [04-inventario-componenti.md](../04-inventario-componenti.md) | Lista componenti | Media |
| [05-glossario.md](../05-glossario.md) | Terminologia | Media |
| [06-rischi-debito-tecnico.md](../06-rischi-debito-tecnico.md) | Rischi noti | Alta |
| [convenzioni-naming.md](./convenzioni-naming.md) | Convenzioni di naming | Media |
| [variabili-configurazioni.md](./variabili-configurazioni.md) | Variabili e config | Media |
| [catalogo-endpoint.md](./catalogo-endpoint.md) | Endpoint | Media |
| [checklist-modifica-sicura.md](./checklist-modifica-sicura.md) | Checklist modifiche | Alta |

---

> **Tempo stimato per l'onboarding completo**: 2-3 giorni per la comprensione teorica, 1-2 settimane per l'operatività autonoma. [Inferito da contesto]
