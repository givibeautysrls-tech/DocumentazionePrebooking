# Infrastruttura Script Airtable -- Givi Beauty

## Panoramica

Il sistema Givi Beauty utilizza **script Airtable** attivati tramite pulsanti integrati nelle viste delle tabelle. [Confermato da codice] Ogni script raccoglie dati dal record corrente e dalle tabelle collegate, li invia a un **Cloudflare Worker** tramite `remoteFetchAsync`, e aggiorna i record Airtable in base alla risposta ricevuta. [Confermato da codice]

## Architettura multi-centro

Esistono **4 basi Airtable identiche**, una per ciascun centro: [Inferito da contesto]

| Centro             | Base Airtable dedicata |
|--------------------|------------------------|
| Portici            | Base separata          |
| Arzano             | Base separata          |
| Torre del Greco    | Base separata          |
| Pomigliano         | Base separata          |

Ogni base contiene le stesse tabelle, gli stessi script e la stessa struttura. [Inferito da contesto] Il centro di appartenenza viene determinato a runtime leggendo il campo `"Centro"` dalla tabella `KeapAPIVars` (record ID: `recZqxq5Uji0ZTO5z`), con fallback su `"Arzano"`. [Confermato da codice]

```js
const INFO_RECORD_ID = "recZqxq5Uji0ZTO5z";
const infoTable = base.getTable("KeapAPIVars");
const infoRecord = await infoTable.selectRecordAsync(INFO_RECORD_ID);
const CENTRO = infoRecord?.getCellValue("Centro") || "Arzano";
```

## Comunicazione con servizi esterni

Tutti gli script comunicano con l'esterno esclusivamente tramite **Cloudflare Workers**, utilizzando la funzione nativa di Airtable `remoteFetchAsync`. [Confermato da codice] Non esistono chiamate dirette alle API Keap dagli script: ogni interazione con Keap e' proxata tramite i worker. [Confermato da codice]

I due endpoint principali sono:

| Worker                                              | Funzione                                      |
|-----------------------------------------------------|-----------------------------------------------|
| `apertura-scheda.notifichegielvi.workers.dev`       | Gestione prebooking (apertura, chiusura, rinvio, annullamento, sync) |
| `applytags.notifichegielvi.workers.dev`             | Applicazione tag Keap ai contatti             |

## Elenco script

Gli script sono **8** in totale: [Confermato da codice]

1. `apertura_scheda.js` -- Apertura scheda prebooking
2. `chiusura_scheda.js` -- Chiusura scheda prebooking
3. `rinvio_appuntamento.js` -- Rinvio appuntamento
4. `annulla_appuntamento.js` -- Annullamento appuntamento
5. `puntuale_e_premiata.js` -- Promozione puntualita'
6. `referral_riscattato.js` -- Riscatto referral
7. `pacco_consegnato.js` -- Consegna pacco referral
8. `conferma_recensione.js` -- Conferma recensione inviata

Per i dettagli di ciascuno script, consultare:
- [Inventario script](inventario-script-airtable.md)
- [Mappa tabelle e relazioni](mappa-tabelle-campi-relazioni.md)
- [Dipendenze esterne](dipendenze-airtable-esterni.md)
- Documentazione individuale in [scripts/](scripts/)
