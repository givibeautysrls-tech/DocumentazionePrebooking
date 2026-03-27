# Keap CRM — Documentazione di Dominio per GiVi Beauty / No Mas Vello

> Ultimo aggiornamento: 26 marzo 2026

---

## 1. Panoramica

Keap (ex Infusionsoft) e' il CRM centrale del sistema GiVi Beauty / No Mas Vello (NMV). Funge da **orchestratore** per l'intero ciclo di vita del cliente: acquisizione lead, gestione appuntamenti, comunicazioni automatiche, referral e retention. [Confermato da codice]

Il sistema si basa su un'architettura a **tagging intensivo**: quasi tutte le automazioni vengono innescate dall'applicazione di tag specifici ai contatti, non da form o eventi nativi Keap. [Confermato da codice]

---

## 2. API utilizzate

### 2.1 REST API v1

| Aspetto | Dettaglio |
|---------|-----------|
| Base URL | `https://api.infusionsoft.com/crm/rest/v1` [Confermato da codice] |
| Autenticazione | OAuth 2.0 Bearer Token [Confermato da codice] |
| Endpoint principali | `/contacts`, `/appointments`, `/tags` [Confermato da codice] |
| Operazioni | GET contatti, PATCH contatti (custom fields), POST tag, DELETE tag [Confermato da codice] |
| Usato da | `apertura-scheda`, `keap-utility`, `getcontactinfo`, `applytags`, `leadgen` [Confermato da codice] |

La REST API v1 e' l'interfaccia principale per tutte le operazioni CRUD sui contatti, incluso l'aggiornamento dei custom fields e la gestione dei tag. [Confermato da codice]

### 2.2 REST API v2

| Aspetto | Dettaglio |
|---------|-----------|
| Base URL | `https://api.infusionsoft.com/crm/rest/v2/contacts` [Confermato da codice] |
| Usato da | `getcontactinfo` worker [Confermato da codice] |
| Operazioni | GET contatti con `optional_properties=custom_fields` [Confermato da codice] |

La v2 e' usata in modo limitato, principalmente per la lettura di contatti con proprieta' opzionali. [Confermato da codice]

### 2.3 XML-RPC

| Aspetto | Dettaglio |
|---------|-----------|
| Endpoint | `https://api.infusionsoft.com/crm/xmlrpc/v1` [Confermato da codice] |
| Metodo | `DataService.update` su tabella `ContactAction` [Confermato da codice] |
| Autenticazione | Bearer Token nello header (non API Key legacy) [Confermato da codice] |
| Scopo | Aggiornamento custom fields degli oggetti Appuntamento (ContactAction) [Confermato da codice] |
| Usato da | `apertura-scheda` worker — funzione `aggiornaCustomFieldsAppuntamento` [Confermato da codice] |

L'XML-RPC e' necessario perche' la REST API di Keap **non espone** i custom fields dell'oggetto `ContactAction` (appuntamento). Senza XML-RPC, non sarebbe possibile scrivere i campi Presente, Rinviato, Annullato sugli appuntamenti. [Confermato da codice]

### 2.4 OAuth Token Management

| Aspetto | Dettaglio |
|---------|-----------|
| Token URL | `https://api.infusionsoft.com/token` [Confermato da codice] |
| Gestione | Funzione `getValidKeapToken(env)` nel worker `apertura-scheda` [Confermato da codice] |
| Storage | Token memorizzato in variabili d'ambiente Cloudflare (KV o secrets) [Inferito da contesto] |
| Refresh | Automatico prima di ogni chiamata API [Inferito da contesto] |
| Criticita' | Se il refresh token scade, tutte le integrazioni Keap si fermano [Da verificare] |

---

## 3. Orchestrazione basata su Tag

Il cuore del sistema e' la **tag-based orchestration**:

```
Evento esterno (es. Airtable button click)
    -> Script Airtable chiama Worker Cloudflare
        -> Worker aggiorna contatto Keap + applica Tag
            -> Tag trigger automazione Keap
                -> Automazione invia messaggi (HTTP Request) e gestisce stato
```

[Confermato da codice]

### Convenzioni di naming dei tag

| Prefisso | Significato | Esempio |
|----------|-------------|---------|
| `AT –` | Automation Trigger — innesca un'automazione | `AT – NMV – Appuntamenti – Appuntamento 1` |
| `S –` | Status — stato corrente del contatto | `S – NMV – Bassa Frequenza Messaggi` |
| `A –` | Action/Attribute — azione eseguita o attributo del contatto | `A – NMV – Recensione inviata` |
| `NMV –` (senza prefisso) | Prodotto o trattamento | `NMV – Emulsione 100ml` |

[Confermato da codice]

### Ciclo di vita di un tag (pattern tipico)

1. Un Worker Cloudflare applica il tag al contatto via API REST [Confermato da codice]
2. Il tag innesca un'automazione Keap (trigger "Tag Applied") [Confermato da codice]
3. L'automazione esegue la sua logica (messaggi, delay, decision diamond) [Confermato da codice]
4. Al termine, l'automazione rimuove il tag trigger per evitare rientri involontari [Confermato da codice]

---

## 4. Struttura documentazione

| File | Contenuto |
|------|-----------|
| [inventario-tags.md](./inventario-tags.md) | Catalogo completo di tutti i tag con ID, categoria e uso nel codice |
| [inventario-automazioni.md](./inventario-automazioni.md) | Catalogo automazioni con trigger, azioni e analisi approfondita |
| [custom-fields-e-mapping.md](./custom-fields-e-mapping.md) | Mappa completa dei custom fields del modello Contatto |
| [relazioni-keap-airtable-cloudflare.md](./relazioni-keap-airtable-cloudflare.md) | Diagramma relazionale tra i tre sistemi |
| [elementi-inferiti-e-da-confermare.md](./elementi-inferiti-e-da-confermare.md) | Lista di tutti gli elementi non verificati |

---

## 5. Architettura di alto livello

```
+------------------+       +-------------------+       +------------------+
|    AIRTABLE      |       |   CLOUDFLARE      |       |     KEAP CRM     |
|                  |       |   WORKERS          |       |                  |
|  Clienti         | ----> | apertura-scheda    | ----> |  Contatti        |
|  Appuntamenti    | ----> | applytags          | ----> |  Tag             |
|  Trattamenti     |       | keap-utility       |       |  Automazioni     |
|  Info (centro)   |       | getcontactinfo     | <---- |  Appuntamenti    |
|                  |       | leadgen            |       |  Custom Fields   |
|  Scripts:        |       | linkforreferral    |       |                  |
|  - apertura      |       | lead-handler       |       |  XML-RPC:        |
|  - chiusura      |       | prebooking         |       |  ContactAction   |
|  - rinvio        |       | sendapp-monitor    |       |  custom fields   |
|  - annulla       |       | apt-monitor        |       |                  |
|  - puntuale      |       | find-contact-id    |       |                  |
|  - referral      |       |                    |       |                  |
|  - pacco         |       |                    |       |                  |
|  - conferma rec. |       |                    |       |                  |
+------------------+       +-------------------+       +------------------+
```

[Confermato da codice]

---

## 6. Centri operativi

| Centro | SendApp Instance ID |
|--------|-------------------|
| Portici | `67F7E1DA0EF73` [Confermato da codice] |
| Arzano | `67EFB424D2353` [Confermato da codice] |
| Torre del Greco | `67EFB605B93A1` [Confermato da codice] |
| Pomigliano | `6926D352155D3` [Confermato da codice] |
