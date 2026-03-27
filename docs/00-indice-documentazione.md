# 00 - Indice Documentazione

> Tabella dei contenuti completa della documentazione tecnica GiVi Beauty.

---

## Documenti

| # | Documento | Descrizione |
|---|-----------|-------------|
| -- | [README.md](./README.md) | Introduzione, navigazione e convenzioni |
| 00 | [Indice Documentazione](./00-indice-documentazione.md) | Questo file |
| 01 | [Panorama Sistema](./01-panorama-sistema.md) | Architettura generale, centri, servizi esterni |
| 02 | [Mappa Domini](./02-mappa-domini.md) | Dettaglio per dominio: Cloudflare, Airtable, Keap |
| 03 | [Flussi End-to-End](./03-flussi-end-to-end.md) | 7 flussi completi con diagrammi Mermaid |
| 04 | [Inventario Componenti](./04-inventario-componenti.md) | Tabella di tutti i worker e script con stato e dipendenze |
| 05 | [Glossario](./05-glossario.md) | Definizioni dei termini di dominio e tecnici |
| 06 | [Rischi e Debito Tecnico](./06-rischi-debito-tecnico.md) | Bug noti, fragilita architetturali, debt tecnico |
| 07 | [Elementi da Verificare](./07-elementi-da-verificare.md) | Punti aperti che richiedono verifica manuale |

---

## Sezioni per dominio

### Cloudflare Workers
- Architettura e service binding: [01-panorama-sistema.md](./01-panorama-sistema.md#architettura)
- Elenco worker: [02-mappa-domini.md](./02-mappa-domini.md#dominio-cloudflare-workers)
- Dettaglio componenti: [04-inventario-componenti.md](./04-inventario-componenti.md#cloudflare-workers)

### Airtable Scripts
- Basi e tabelle: [02-mappa-domini.md](./02-mappa-domini.md#dominio-airtable)
- Script operativi: [04-inventario-componenti.md](./04-inventario-componenti.md#airtable-scripts)

### Keap CRM
- Tag, custom fields, automazioni: [02-mappa-domini.md](./02-mappa-domini.md#dominio-keap-crm)
- Automazioni principali: [03-flussi-end-to-end.md](./03-flussi-end-to-end.md)

---

## Sezioni trasversali

| Argomento | Documento di riferimento |
|-----------|--------------------------|
| Flusso Lead Facebook | [03-flussi-end-to-end.md#1-nuovo-lead-da-facebook](./03-flussi-end-to-end.md#1-nuovo-lead-da-facebook) |
| Apertura Scheda (Prebooking) | [03-flussi-end-to-end.md#2-apertura-scheda-prebooking](./03-flussi-end-to-end.md#2-apertura-scheda-prebooking) |
| Chiusura Scheda | [03-flussi-end-to-end.md#3-chiusura-scheda](./03-flussi-end-to-end.md#3-chiusura-scheda) |
| Rinvio Appuntamento | [03-flussi-end-to-end.md#4-rinvio-appuntamento](./03-flussi-end-to-end.md#4-rinvio-appuntamento) |
| Annullamento | [03-flussi-end-to-end.md#5-annullamento-appuntamento](./03-flussi-end-to-end.md#5-annullamento-appuntamento) |
| Referral | [03-flussi-end-to-end.md#6-referral-flow](./03-flussi-end-to-end.md#6-referral-flow) |
| Sync Next Appointment | [03-flussi-end-to-end.md#7-sync-next-appointment](./03-flussi-end-to-end.md#7-sync-next-appointment) |
| Sistema Slot A1-A5 | [05-glossario.md#slot-appuntamento-a1-a5](./05-glossario.md) |
| Bug noti | [06-rischi-debito-tecnico.md](./06-rischi-debito-tecnico.md) |
| Verifica deployment | [07-elementi-da-verificare.md](./07-elementi-da-verificare.md) |
