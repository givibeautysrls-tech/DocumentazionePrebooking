# Documentazione Tecnica - GiVi Beauty / No Mas Vello

> Documentazione del sistema software che gestisce i centri estetici GiVi Beauty (brand No Mas Vello).
> Generata il 26/03/2026.

---

## Scopo

Questa documentazione descrive l'architettura, i componenti e i flussi operativi del sistema informatico che supporta i 4 centri estetici della rete GiVi Beauty. Il sistema copre l'intero ciclo di vita del cliente: dall'acquisizione lead via Facebook, alla gestione appuntamenti, fino al marketing automatizzato e al programma referral. [Confermato da codice]

---

## Come navigare la documentazione

| Documento | Contenuto |
|-----------|-----------|
| [00 - Indice Documentazione](./00-indice-documentazione.md) | Tabella dei contenuti completa con link |
| [01 - Panorama Sistema](./01-panorama-sistema.md) | Visione d'insieme dell'architettura e dei centri |
| [02 - Mappa Domini](./02-mappa-domini.md) | Inventario dettagliato per dominio tecnologico |
| [03 - Flussi End-to-End](./03-flussi-end-to-end.md) | Diagrammi e descrizioni dei flussi principali |
| [04 - Inventario Componenti](./04-inventario-componenti.md) | Tabella riassuntiva di tutti i worker e script |
| [05 - Glossario](./05-glossario.md) | Definizioni dei termini di dominio |
| [06 - Rischi e Debito Tecnico](./06-rischi-debito-tecnico.md) | Bug noti, fragilita, debt tecnico |
| [07 - Elementi da Verificare](./07-elementi-da-verificare.md) | Punti aperti che richiedono verifica manuale |

---

## I tre domini tecnologici

Il sistema e organizzato in tre domini principali:

1. **Cloudflare Workers** -- Layer API e logica di business. 11 worker attivi che gestiscono le chiamate Keap, l'elaborazione lead, il tagging e il monitoraggio. [Confermato da codice]
2. **Airtable Scripts** -- Interfaccia operativa per il personale dei centri. 8 script collegati a pulsanti nelle basi Airtable (una per centro). [Confermato da codice]
3. **Keap CRM** -- Database contatti, automazioni marketing, invio messaggi WhatsApp tramite HTTP Request verso i worker Cloudflare. [Confermato da codice]

---

## Convenzioni di classificazione

Ogni affermazione fattuale in questa documentazione e contrassegnata con uno dei seguenti tag:

- **[Confermato da codice]** -- L'informazione e stata verificata direttamente nel codice sorgente dei worker, degli script o nei file di configurazione.
- **[Inferito da contesto]** -- L'informazione e stata dedotta dalla struttura del codice, dai nomi delle variabili o dalla logica dei flussi, ma non e esplicitamente dichiarata.
- **[Da verificare]** -- L'informazione e plausibile ma richiede conferma manuale (es. stato di deployment, configurazioni live, dati runtime).
