# Inventario Progetti Cloudflare Workers

> Ultima revisione: 2026-03-26

## Tabella riepilogativa

| # | Worker | Stato | Linee (circa) | Descrizione | Route principali | Storage | Service Bindings |
|---|--------|-------|---------------|-------------|-----------------|---------|-----------------|
| 1 | **apertura-scheda** | Attivo | ~2759 | Core del ciclo di vita prebooking: apertura, chiusura, rinvio, annullamento appuntamenti | `POST /api/prebooking/*` | KV: KEAP_TOKENS, LOGS_KV | — |
| 2 | **keap-utility** | Attivo | ~246 | Proxy centralizzato per le API Keap. Espone endpoint per creazione contatti, info, tag, appuntamenti | `POST /createContact`, `GET /getContactInfo/:id`, ecc. | KV: KEAP_TOKENS | — |
| 3 | **lead-handler** | Attivo | ~544 | Cattura lead da Facebook (webhook Meta) e form generici. Crea contatti in Keap, salva su Airtable, invia WhatsApp | `POST /moduli`, `POST /form` | — | KEAP_UTILITY |
| 4 | **sendapp-monitor** | Attivo | ~2660 (di cui gran parte polyfill) | Proxy per invio messaggi WhatsApp via SendApp con logging D1, retry e reconnect automatico | `POST /send`, `GET /report` | D1 | — |
| 5 | **apt-monitor** | Attivo | ~318 | Monitor eventi appuntamento (rinvii, annullamenti). Notifiche Pushover istantanee e riepilogo giornaliero | `POST /event`, cron 20:00 | D1 | KEAP_UTILITY |
| 6 | **applytags** | Attivo | ~86 | Endpoint semplice per applicare tag Keap a un contatto | `GET /?keapID=X&tagIDs=1,2,3` | — | — |
| 7 | **find-contact-id** | Attivo | ~132 | Ricerca contatto Keap per nome, cognome e telefono | `POST /` | — | — |
| 8 | **getcontactinfo** | Attivo | ~91 | Recupera informazioni contatto Keap dato il keapID | `GET /?keapID=X` | — | — |
| 9 | **linkforreferral** | Attivo | ~208 | Crea link referral: trova/crea contatto, applica tag referrer e referred | `POST /` | — | APPLY_TAGS |
| 10 | **prebooking** | Legacy | ~216 | Vecchio handler appuntamenti. cancelAppointment e resetAppointment implementati, il resto sono stub vuoti | `POST /cancelAppointment/:id`, ecc. | — | KEAP_UTILITY |
| 11 | **leadgen** | Legacy | ~161 | Vecchio handler lead. Mai completato (messaggio WhatsApp placeholder) | `POST /` | — | — |

## Legenda stati

| Stato | Significato |
|-------|-------------|
| **Attivo** | Worker in produzione, utilizzato regolarmente [Confermato da codice] |
| **Legacy** | Worker obsoleto, potenzialmente da dismettere [Confermato da codice] |
| **Da verificare** | Stato operativo incerto, richiede verifica manuale [Inferito da contesto] |

## Note

- **sendapp-monitor** ha ~2660 linee, ma la maggior parte e un polyfill per compatibilita. La logica applicativa effettiva e significativamente piu contenuta. [Confermato da codice]
- **leadgen** contiene un placeholder hardcoded `"[INSERISCI QUI IL TUO MESSAGGIO WHATSAPP]"` che indica chiaramente che il worker non e mai stato completato. [Confermato da codice]
- **prebooking** ha `setAppointment` e `setOpportunity` come stub vuoti — le funzionalita sono state migrate in `apertura-scheda`. [Confermato da codice]
- **Pomigliano** e il centro piu recente e non e ancora coperto da tutti i worker (manca in `linkforreferral`). [Confermato da codice]
