# Inventario Completo Tag Keap — GiVi Beauty / NMV

> Fonte: `keap-backup/tags.json` — Estratto il 26 marzo 2026

---

## Indice per categoria

1. [AT – Automation Trigger (Category 11)](#1-at--automation-trigger-category-11)
2. [S – Status (Category 13)](#2-s--status-category-13)
3. [A – Action/Attribute (Category 15)](#3-a--actionattribute-category-15)
4. [NMV – Prodotti (Category 25)](#4-nmv--prodotti-category-25)
5. [Trattamenti / Zone corpo (Category 27)](#5-trattamenti--zone-corpo-category-27)
6. [Promozioni (Category 29)](#6-promozioni-category-29)
7. [Altre categorie](#7-altre-categorie)
8. [Tag auto-generati (date)](#8-tag-auto-generati-date)

---

## 1. AT – Automation Trigger (Category 11)

Tag che innescano automazioni. Applicati dai Worker Cloudflare o manualmente.

| ID | Nome | Descrizione / Scopo | Usato nel codice | Fonte |
|----|------|---------------------|------------------|-------|
| 103 | AT – MH – Conferma Mail – Inizia | Trigger automazione conferma email MH | No | [Da verificare] |
| 113 | AT – NMV – Temperatura Clienti – Inizio | Avvia automazione temperatura clienti | No | [Da verificare] |
| 135 | AT – MH – Salon Startup – inizia | Trigger automazione Salon Startup | No | [Da verificare] |
| 137 | AT – NMV – PreBooking – Inizia | Trigger automazione prebooking | No | [Da verificare] |
| **285** | **AT – NMV – Appuntamenti – Appuntamento 1** | Trigger: nuovo appuntamento slot 1 | **Si** — `apertura-scheda` CONFIG.APPOINTMENT_TAGS.A1 | [Confermato da codice] |
| **287** | **AT – NMV – Appuntamenti – Appuntamento 2** | Trigger: nuovo appuntamento slot 2 | **Si** — `apertura-scheda` CONFIG.APPOINTMENT_TAGS.A2 | [Confermato da codice] |
| **289** | **AT – NMV – Appuntamenti – Appuntamento 3** | Trigger: nuovo appuntamento slot 3 | **Si** — `apertura-scheda` CONFIG.APPOINTMENT_TAGS.A3 | [Confermato da codice] |
| **291** | **AT – NMV – Appuntamenti – A1: Annullato** | Annullamento appuntamento 1 | **Si** — `apertura-scheda` CONFIG.APPOINTMENT_TAGS.CANCEL.A1 | [Confermato da codice] |
| **293** | **AT – NMV – Appuntamento – A2: Annullato** | Annullamento appuntamento 2 | **Si** — `apertura-scheda` CONFIG.APPOINTMENT_TAGS.CANCEL.A2 | [Confermato da codice] |
| **295** | **AT – NMV – Appuntamenti – A3: Annullato** | Annullamento appuntamento 3 | **Si** — `apertura-scheda` CONFIG.APPOINTMENT_TAGS.CANCEL.A3 | [Confermato da codice] |
| **297** | **AT – NMV – Recensione – Start** | Avvia automazione raccolta recensione | **Si** — `apertura-scheda` applica tag 297 + `conferma_recensione.js` tagIDs=155 | [Confermato da codice] |
| **299** | **AT – NMV – Appuntamenti – A1: Rinviato** | Rinvio appuntamento 1 | **Si** — `apertura-scheda` CONFIG.APPOINTMENT_TAGS.RINVIO.A1 | [Confermato da codice] |
| **301** | **AT – NMV – Appuntamenti – A2: Rinviato** | Rinvio appuntamento 2 | **Si** — `apertura-scheda` CONFIG.APPOINTMENT_TAGS.RINVIO.A2 | [Confermato da codice] |
| **303** | **AT – NMV – Appuntamenti – A3: Rinviato** | Rinvio appuntamento 3 | **Si** — `apertura-scheda` CONFIG.APPOINTMENT_TAGS.RINVIO.A3 | [Confermato da codice] |
| 305 | AT – NMV – Opportunity – Closed Opportunity | Trigger per opportunita' chiusa | No | [Da verificare] |
| **307** | **AT – NMV – Appuntamenti – A1: Fusion** | Tipo servizio Fusion, slot 1 | **Si** — `apertura-scheda` CONFIG.APPOINTMENT_TAGS.FUSION.A1 | [Confermato da codice] |
| **309** | **AT – NMV – Appuntamenti – A1: ProSkin** | Tipo servizio ProSkin, slot 1 | **Si** — `apertura-scheda` CONFIG.APPOINTMENT_TAGS.PROSKIN.A1 | [Confermato da codice] |
| **311** | **AT – NMV – Appuntamenti – A2: Fusion** | Tipo servizio Fusion, slot 2 | **Si** — `apertura-scheda` CONFIG.APPOINTMENT_TAGS.FUSION.A2 | [Confermato da codice] |
| **313** | **AT – NMV – Appuntamenti – A2: ProSkin** | Tipo servizio ProSkin, slot 2 | **Si** — `apertura-scheda` CONFIG.APPOINTMENT_TAGS.PROSKIN.A2 | [Confermato da codice] |
| **315** | **AT – NMV – Appuntamenti – A3: Fusion** | Tipo servizio Fusion, slot 3 | **Si** — `apertura-scheda` CONFIG.APPOINTMENT_TAGS.FUSION.A3 | [Confermato da codice] |
| **317** | **AT – NMV – Appuntamenti – A3: ProSkin** | Tipo servizio ProSkin, slot 3 | **Si** — `apertura-scheda` CONFIG.APPOINTMENT_TAGS.PROSKIN.A3 | [Confermato da codice] |
| **333** | **AT – NMV – Referral – Nuovo Contatto Presentato** | Applicato al referrer quando presenta nuovo contatto | **Si** — `linkforreferral` worker applica tag 333 | [Confermato da codice] |
| 339 | AT – NMV – Temperatura Referral – Inizio | Avvia temperatura referral | No | [Da verificare] |
| 341 | AT – NMV – Temperatura Referral – Caldo | Stato caldo nel funnel referral | No | [Da verificare] |
| 343 | AT – NMV – Temperatura Referral – Tiepido | Stato tiepido nel funnel referral | No | [Da verificare] |
| 345 | AT – NMV – Temperatura Referral – Freddo | Stato freddo nel funnel referral | No | [Da verificare] |
| 349 | AT – NMV – Referral – (No PACCO) Inizio Richiesta Referral | Inizio flusso referral senza pacco | No | [Da verificare] |
| 351 | AT – Referral – Richiesto Messaggio Presentazione | Trigger invio messaggio presentazione | No | [Da verificare] |
| **353** | **AT – NMV – Feedback – Feedback lasciato** | Feedback trimestrale ricevuto | No (non trovato in worker/script) | [Da verificare] |
| **355** | **AT – NMV – Referral – Referree entrato** | Applicato al referrer quando referree entra | **Si** — `referral_riscattato.js` CONFIG.TAG_FOR_REFERRER = 355 | [Confermato da codice] |
| **357** | **AT – NMV – Referral – Pacco Ricevuto** | Pacco consegnato al cliente | **Si** — `pacco_consegnato.js` CONFIG.TAG_FOR_PACKAGE = 357 | [Confermato da codice] |
| 359 | AT – NMV – Rinvia senza messaggio | Rinvio senza invio messaggio al cliente | **Si** — `apertura-scheda` pushato a resetTags quando `noMsg=true` | [Confermato da codice] |
| **361** | **AT – NMV – Acquisizione – Nuovo Lead** | Trigger per nuovo lead acquisito | **Si** — `leadgen` worker applica tag 361 | [Confermato da codice] |
| 363 | AT – NMV – Temperatura Rinvii – Inizio | Avvia automazione temperatura rinvii | No | [Da verificare] |
| **365** | **AT – NMV – Appuntamenti – Appuntamento 4** | Trigger: nuovo appuntamento slot 4 | **Si** — `apertura-scheda` CONFIG.APPOINTMENT_TAGS.A4 | [Confermato da codice] |
| **367** | **AT – NMV – Appuntamenti – A4: Fusion** | Tipo servizio Fusion, slot 4 | **Si** — `apertura-scheda` CONFIG.APPOINTMENT_TAGS.FUSION.A4 | [Confermato da codice] |
| **369** | **AT – NMV – Appuntamenti – A4: ProSkin** | Tipo servizio ProSkin, slot 4 | **Si** — `apertura-scheda` CONFIG.APPOINTMENT_TAGS.PROSKIN.A4 | [Confermato da codice] |
| **371** | **AT – NMV – Appuntamenti – A4: Annullato** | Annullamento appuntamento 4 | **Si** — `apertura-scheda` CONFIG.APPOINTMENT_TAGS.CANCEL.A4 | [Confermato da codice] |
| **373** | **AT – NMV – Appuntamenti – A4: Rinviato** | Rinvio appuntamento 4 | **Si** — `apertura-scheda` CONFIG.APPOINTMENT_TAGS.RINVIO.A4 | [Confermato da codice] |
| **375** | **NMV – Appuntamenti – Appuntamento 5** | Trigger: nuovo appuntamento slot 5 | **Si** — `apertura-scheda` CONFIG.APPOINTMENT_TAGS.A5 | [Confermato da codice] |
| **377** | **NMV – Appuntamenti – A5: Fusion** | Tipo servizio Fusion, slot 5 | **Si** — `apertura-scheda` CONFIG.APPOINTMENT_TAGS.FUSION.A5 | [Confermato da codice] |
| **379** | **NMV – Appuntamenti – A5: ProSkin** | Tipo servizio ProSkin, slot 5 | **Si** — `apertura-scheda` CONFIG.APPOINTMENT_TAGS.PROSKIN.A5 | [Confermato da codice] |
| **381** | **NMV – Appuntamenti – A5: Rinviato** | Rinvio appuntamento 5 | **Si** — `apertura-scheda` CONFIG.APPOINTMENT_TAGS.RINVIO.A5 | [Confermato da codice] |
| **383** | **NMV – Appuntamenti – A5: Annullato** | Annullamento appuntamento 5 | **Si** — `apertura-scheda` CONFIG.APPOINTMENT_TAGS.CANCEL.A5 | [Confermato da codice] |
| **387** | **AT – NMV – Start Puntuale a premiata** | Avvia flusso promo puntualita' | **Si** — `puntuale_e_premiata.js` CONFIG.TAG_FOR_PROMO = 387 | [Confermato da codice] |
| 399 | AT – NMV – Compleanno | Trigger automazione compleanni | No | [Da verificare] |
| **427** | **NMV – Appuntamenti – Appuntamento 6** | Trigger: nuovo appuntamento slot 6 | **Si** — `apertura-scheda` CONFIG.APPOINTMENT_TAGS.A6 | [Confermato da codice — creato 2026-05-13] |
| **429** | **NMV – Appuntamenti – A6: Fusion** | Tipo servizio Fusion, slot 6 | **Si** — `apertura-scheda` CONFIG.APPOINTMENT_TAGS.FUSION.A6 | [Confermato da codice — creato 2026-05-13] |
| **431** | **NMV – Appuntamenti – A6: ProSkin** | Tipo servizio ProSkin, slot 6 | **Si** — `apertura-scheda` CONFIG.APPOINTMENT_TAGS.PROSKIN.A6 | [Confermato da codice — creato 2026-05-13] |
| **433** | **NMV – Appuntamenti – A6: Annullato** | Annullamento appuntamento 6 | **Si** — `apertura-scheda` CONFIG.APPOINTMENT_TAGS.CANCEL.A6 | [Confermato da codice — creato 2026-05-13] |
| **435** | **NMV – Appuntamenti – A6: Rinviato** | Rinvio appuntamento 6 | **Si** — `apertura-scheda` CONFIG.APPOINTMENT_TAGS.RINVIO.A6 | [Confermato da codice — creato 2026-05-13] |
| **437** | **NMV – Appuntamenti – Appuntamento 7** | Trigger: nuovo appuntamento slot 7 | **Si** — `apertura-scheda` CONFIG.APPOINTMENT_TAGS.A7 | [Confermato da codice — creato 2026-05-13] |
| **439** | **NMV – Appuntamenti – A7: Fusion** | Tipo servizio Fusion, slot 7 | **Si** — `apertura-scheda` CONFIG.APPOINTMENT_TAGS.FUSION.A7 | [Confermato da codice — creato 2026-05-13] |
| **441** | **NMV – Appuntamenti – A7: ProSkin** | Tipo servizio ProSkin, slot 7 | **Si** — `apertura-scheda` CONFIG.APPOINTMENT_TAGS.PROSKIN.A7 | [Confermato da codice — creato 2026-05-13] |
| **443** | **NMV – Appuntamenti – A7: Annullato** | Annullamento appuntamento 7 | **Si** — `apertura-scheda` CONFIG.APPOINTMENT_TAGS.CANCEL.A7 | [Confermato da codice — creato 2026-05-13] |
| **445** | **NMV – Appuntamenti – A7: Rinviato** | Rinvio appuntamento 7 | **Si** — `apertura-scheda` CONFIG.APPOINTMENT_TAGS.RINVIO.A7 | [Confermato da codice — creato 2026-05-13] |
| **447** | **NMV – Appuntamenti – Appuntamento 8** | Trigger: nuovo appuntamento slot 8 | **Si** — `apertura-scheda` CONFIG.APPOINTMENT_TAGS.A8 | [Confermato da codice — creato 2026-05-13] |
| **449** | **NMV – Appuntamenti – A8: Fusion** | Tipo servizio Fusion, slot 8 | **Si** — `apertura-scheda` CONFIG.APPOINTMENT_TAGS.FUSION.A8 | [Confermato da codice — creato 2026-05-13] |
| **451** | **NMV – Appuntamenti – A8: ProSkin** | Tipo servizio ProSkin, slot 8 | **Si** — `apertura-scheda` CONFIG.APPOINTMENT_TAGS.PROSKIN.A8 | [Confermato da codice — creato 2026-05-13] |
| **453** | **NMV – Appuntamenti – A8: Annullato** | Annullamento appuntamento 8 | **Si** — `apertura-scheda` CONFIG.APPOINTMENT_TAGS.CANCEL.A8 | [Confermato da codice — creato 2026-05-13] |
| **455** | **NMV – Appuntamenti – A8: Rinviato** | Rinvio appuntamento 8 | **Si** — `apertura-scheda` CONFIG.APPOINTMENT_TAGS.RINVIO.A8 | [Confermato da codice — creato 2026-05-13] |
| **457** | **NMV – Appuntamenti – Appuntamento 9** | Trigger: nuovo appuntamento slot 9 | **Si** — `apertura-scheda` CONFIG.APPOINTMENT_TAGS.A9 | [Confermato da codice — creato 2026-05-13] |
| **459** | **NMV – Appuntamenti – A9: Fusion** | Tipo servizio Fusion, slot 9 | **Si** — `apertura-scheda` CONFIG.APPOINTMENT_TAGS.FUSION.A9 | [Confermato da codice — creato 2026-05-13] |
| **461** | **NMV – Appuntamenti – A9: ProSkin** | Tipo servizio ProSkin, slot 9 | **Si** — `apertura-scheda` CONFIG.APPOINTMENT_TAGS.PROSKIN.A9 | [Confermato da codice — creato 2026-05-13] |
| **463** | **NMV – Appuntamenti – A9: Annullato** | Annullamento appuntamento 9 | **Si** — `apertura-scheda` CONFIG.APPOINTMENT_TAGS.CANCEL.A9 | [Confermato da codice — creato 2026-05-13] |
| **465** | **NMV – Appuntamenti – A9: Rinviato** | Rinvio appuntamento 9 | **Si** — `apertura-scheda` CONFIG.APPOINTMENT_TAGS.RINVIO.A9 | [Confermato da codice — creato 2026-05-13] |
| **467** | **NMV – Appuntamenti – Appuntamento 10** | Trigger: nuovo appuntamento slot 10 | **Si** — `apertura-scheda` CONFIG.APPOINTMENT_TAGS.A10 | [Confermato da codice — creato 2026-05-13] |
| **469** | **NMV – Appuntamenti – A10: Fusion** | Tipo servizio Fusion, slot 10 | **Si** — `apertura-scheda` CONFIG.APPOINTMENT_TAGS.FUSION.A10 | [Confermato da codice — creato 2026-05-13] |
| **471** | **NMV – Appuntamenti – A10: ProSkin** | Tipo servizio ProSkin, slot 10 | **Si** — `apertura-scheda` CONFIG.APPOINTMENT_TAGS.PROSKIN.A10 | [Confermato da codice — creato 2026-05-13] |
| **473** | **NMV – Appuntamenti – A10: Annullato** | Annullamento appuntamento 10 | **Si** — `apertura-scheda` CONFIG.APPOINTMENT_TAGS.CANCEL.A10 | [Confermato da codice — creato 2026-05-13] |
| **475** | **NMV – Appuntamenti – A10: Rinviato** | Rinvio appuntamento 10 | **Si** — `apertura-scheda` CONFIG.APPOINTMENT_TAGS.RINVIO.A10 | [Confermato da codice — creato 2026-05-13] |

---

## 2. S – Status (Category 13)

Tag che rappresentano lo stato corrente del contatto.

| ID | Nome | Descrizione / Scopo | Usato nel codice | Fonte |
|----|------|---------------------|------------------|-------|
| 107 | S – MH – Email da Confermare | Email in attesa conferma | No | [Da verificare] |
| 109 | S – MH – Email Confermata | Email confermata | No | [Da verificare] |
| 115 | S – NMV – Temperatura Clienti – Tiepido | Stato temperatura: tiepido | No | [Da verificare] |
| 117 | S – NMV – Temperatura Clienti – Freddo | Stato temperatura: freddo | No | [Da verificare] |
| 119 | S – NMV – Temperatura Clienti – Caldo | Stato temperatura: caldo | No | [Da verificare] |
| 133 | S – MH – Lead | Contatto e' un lead MH | No | [Da verificare] |
| **335** | **S – NMV – Referral – Contatto Referral** | Il contatto e' un referral | **Si** — `linkforreferral` worker applica tag 335 | [Confermato da codice] |
| 347 | S – NMV – Bassa Frequenza Messaggi | Contatto preferisce meno messaggi | No (usato nelle automazioni come filtro) | [Confermato da codice — referenziato nel report automazioni] |
| **385** | **S – NMV – Promo – Puntuale e premiata** | Contatto idoneo a promo puntualita' | No (usato come condizione in automazione 179) | [Confermato da codice — referenziato nel report automazioni] |

---

## 3. A – Action/Attribute (Category 15)

Tag che indicano un'azione compiuta o un attributo del contatto.

| ID | Nome | Descrizione / Scopo | Usato nel codice | Fonte |
|----|------|---------------------|------------------|-------|
| 92 | A – MH – Salon Startup – Iscritto | Iscritto a Salon Startup | No | [Da verificare] |
| 111 | A – MH – Disiscritto | Contatto disiscritto MH | No | [Da verificare] |
| 121 | A – MH – Privacy Policy Accettata | Accettata privacy policy | No | [Da verificare] |
| 139 | A – NMV – Proposta Rifiutata | Proposta commerciale rifiutata | No | [Da verificare] |
| 141 | A – NMV – Proposta Accettata | Proposta commerciale accettata | No | [Da verificare] |
| 143 | A – NMV – Show | Cliente si e' presentato | No | [Da verificare] |
| 145 | A – NMV – No Show | Cliente non si e' presentato | No | [Da verificare] |
| 151 | A – NMV – Proposta sospesa | Proposta in sospeso | No | [Da verificare] |
| **155** | **A – NMV – Recensione inviata** | Recensione confermata | **Si** — `conferma_recensione.js` tagIDs=155 | [Confermato da codice] |
| 157 | A – NMV – PromoOptin | Opt-in promozionale | No | [Da verificare] |
| 329 | A – NMV – Referral – LadingPageView | Visualizzata landing page referral | No | [Da verificare] |
| 331 | A – NMV – Referral – Aderito | Contatto ha aderito al programma referral | No | [Da verificare] |
| **337** | **A – NMV – Referral – Buono Referral Usato** | Il buono referral e' stato riscattato | **Si** — `referral_riscattato.js` CONFIG.TAG_FOR_CLIENT = 337 | [Confermato da codice] |
| 401 | A – NMV – Regalo riscattato | Regalo compleanno riscattato | No | [Da verificare] |

---

## 4. NMV – Prodotti (Category 25)

Tag associati a prodotti del catalogo NMV. Nessuno di questi risulta usato direttamente nel codice dei worker/script.

| ID | Nome | Fonte |
|----|------|-------|
| 159 | NMV – Deodorante Neutro Essenza | [Da verificare] |
| 161 | NMV – Acqua Liposomiale | [Da verificare] |
| 163 | NMV – Crema Corpo Anticellulite | [Da verificare] |
| 165 | NMV – Crema Corpo Gel Rassodante | [Da verificare] |
| 167 | NMV – Deodorante Neutro Essenza Base | [Da verificare] |
| 169 | NMV – Detergente Neutro Alta Tolleranza | [Da verificare] |
| 171 | NMV – Detergente Neutro Anti Imperfezioni | [Da verificare] |
| 173 | NMV – Emulsione 100ml | [Da verificare] |
| 175 | NMV – Emulsione 250ml | [Da verificare] |
| 177 | NMV – Emulsione da 50 ml | [Da verificare] |
| 179 | NMV – Scrub Corpo 450gr | [Da verificare] |
| 181 | NMV – Scrub Viso | [Da verificare] |
| 183 | NMV – Fiala Anti Imperfezioni | [Da verificare] |
| 185 | NMV – Fiala Idratante | [Da verificare] |
| 187 | NMV – Fluido Anti Aging | [Da verificare] |
| 189 | NMV – Fluido Rassodante DMAE | [Da verificare] |
| 191 | NMV – Fluido Anti Imperfezioni | [Da verificare] |
| 193 | NMV – Fluido Vitamita C | [Da verificare] |
| 195 | NMV – Fluido Vitamina C 475ml | [Da verificare] |
| 197 | NMV – Gel Cabina | [Da verificare] |
| 199 | NMV – Maschera idratante | [Da verificare] |
| 201 | NMV – Maschera Aloe Vera | [Da verificare] |
| 203 | NMV – Maschera Anti Imperfezioni | [Da verificare] |
| 205 | NMV – Maschera DMAE | [Da verificare] |
| 207 | NMV – Maschera Vitamina C | [Da verificare] |
| 209 | NMV – Pack Duo 100ml | [Da verificare] |
| 211 | NMV – Pack Duo 237ml | [Da verificare] |

---

## 5. Trattamenti / Zone corpo (Category 27)

Tag che identificano trattamenti e zone del corpo trattate. Nessuno di questi risulta usato nel codice worker/script.

| ID | Nome | Fonte |
|----|------|-------|
| 213 | ProSkin Basic | [Da verificare] |
| 215 | ProSkin Relax | [Da verificare] |
| 217 | ProSkin Complete | [Da verificare] |
| 219 | ProSkin Soft | [Da verificare] |
| 221 | Dorso | [Da verificare] |
| 223 | Glutei | [Da verificare] |
| 225 | Inguine | [Da verificare] |
| 227 | Gambe | [Da verificare] |
| 229 | Linea Alba | [Da verificare] |
| 231 | Orecchie | [Da verificare] |
| 233 | Mani | [Da verificare] |
| 235 | Lombare | [Da verificare] |
| 237 | Consulenza | [Da verificare] |
| 239 | Altro | [Da verificare] |
| 241 | Labbro Superiore | [Da verificare] |
| 243 | Mento | [Da verificare] |
| 245 | Spalle | [Da verificare] |
| 247 | Piedi | [Da verificare] |
| 249 | Petto | [Da verificare] |
| 251 | Perianale | [Da verificare] |
| 253 | Addome | [Da verificare] |
| 255 | Ascelle | [Da verificare] |
| 257 | Aureola del Seno | [Da verificare] |
| 259 | Collo Anteriore | [Da verificare] |
| 261 | Braccia | [Da verificare] |
| 263 | Collo Posteriore | [Da verificare] |
| 265 | Viso | [Da verificare] |

---

## 6. Promozioni (Category 29)

Tag associati a promozioni specifiche.

| ID | Nome | Fonte |
|----|------|-------|
| 267 | Intimo Plus | [Da verificare] |
| 269 | Estate 2025 | [Da verificare] |
| 271 | ProSkin Soft 13EUR | [Da verificare] |
| 273 | ProSkin For All | [Da verificare] |
| 275 | Promo Sportivi | [Da verificare] |
| 277 | Festa della donna | [Da verificare] |
| 279 | Experience 5 | [Da verificare] |
| 281 | Experience 7 | [Da verificare] |
| 283 | Experience 9 | [Da verificare] |
| 319 | NMV – 5 viso 125 EUR (interna) | [Da verificare] |
| 321 | Sun & Safe | [Da verificare] |
| 323 | Perianale 77EUR | [Da verificare] |

---

## 7. Altre categorie

| ID | Nome | Category ID | Fonte |
|----|------|-------------|-------|
| 125 | MH – Team | 21 | [Da verificare] |
| 153 | TEST–MANYCHATAPI | 23 | [Da verificare] |
| 325 | A->A – MYVEG – Metamorfosi Botanica – Iscritto | 35 | [Da verificare] |

---

## 8. Tag auto-generati (date)

Tag creati automaticamente da Keap durante test o invii. Non hanno significato operativo.

| ID | Nome | Category ID | Fonte |
|----|------|-------------|-------|
| 147 | 4/02/2025 5:04 AM | 19 | [Da verificare] |
| 149 | 4/02/2025 5:16 AM | 19 | [Da verificare] |
| 389 | 1/23/2026 10:19 AM | 37 | [Da verificare] |
| 391 | 1/23/2026 11:20 AM | 37 | [Da verificare] |
| 393 | 1/23/2026 11:32 AM | 19 | [Da verificare] |
| 395 | 2/03/2026 6:51 AM | 19 | [Da verificare] |
| 397 | 2/03/2026 8:34 AM | 37 | [Da verificare] |
| 403 | 2/11/2026 11:10 AM | 19 | [Da verificare] |
| 405 | 2/11/2026 11:12 AM | 37 | [Da verificare] |
| 407 | 2/12/2026 8:11 AM | 37 | [Da verificare] |
| 409 | 2/12/2026 8:15 AM | 19 | [Da verificare] |
| 411 | 2/12/2026 11:40 AM | 37 | [Da verificare] |

---

## Riepilogo: Tag confermati nel codice

| Tag ID | Nome (abbreviato) | Worker / Script | Funzione |
|--------|-------------------|-----------------|----------|
| 155 | Recensione inviata | `conferma_recensione.js` | Applicato dopo conferma recensione |
| 285 | Appuntamento 1 | `apertura-scheda` | Trigger nuovo apt slot 1 |
| 287 | Appuntamento 2 | `apertura-scheda` | Trigger nuovo apt slot 2 |
| 289 | Appuntamento 3 | `apertura-scheda` | Trigger nuovo apt slot 3 |
| 291 | A1: Annullato | `apertura-scheda` | Annullamento slot 1 |
| 293 | A2: Annullato | `apertura-scheda` | Annullamento slot 2 |
| 295 | A3: Annullato | `apertura-scheda` | Annullamento slot 3 |
| 297 | Recensione – Start | `apertura-scheda` | Avvia flusso recensione |
| 299 | A1: Rinviato | `apertura-scheda` | Rinvio slot 1 |
| 301 | A2: Rinviato | `apertura-scheda` | Rinvio slot 2 |
| 303 | A3: Rinviato | `apertura-scheda` | Rinvio slot 3 |
| 307 | A1: Fusion | `apertura-scheda` | Tipo servizio Fusion, slot 1 |
| 309 | A1: ProSkin | `apertura-scheda` | Tipo servizio ProSkin, slot 1 |
| 311 | A2: Fusion | `apertura-scheda` | Tipo servizio Fusion, slot 2 |
| 313 | A2: ProSkin | `apertura-scheda` | Tipo servizio ProSkin, slot 2 |
| 315 | A3: Fusion | `apertura-scheda` | Tipo servizio Fusion, slot 3 |
| 317 | A3: ProSkin | `apertura-scheda` | Tipo servizio ProSkin, slot 3 |
| 333 | Referral – Nuovo Contatto | `linkforreferral` | Applicato al referrer |
| 335 | Referral – Contatto Referral | `linkforreferral` | Stato referral al nuovo contatto |
| 337 | Buono Referral Usato | `referral_riscattato.js` | Riscatto buono da parte del cliente |
| 355 | Referree entrato | `referral_riscattato.js` | Applicato al referrer |
| 357 | Pacco Ricevuto | `pacco_consegnato.js` | Pacco consegnato al cliente |
| 359 | Rinvia senza messaggio | `apertura-scheda` | Flag per rinvio silenzioso |
| 361 | Nuovo Lead | `leadgen` | Trigger acquisizione nuovo lead |
| 365 | Appuntamento 4 | `apertura-scheda` | Trigger nuovo apt slot 4 |
| 367 | A4: Fusion | `apertura-scheda` | Tipo servizio Fusion, slot 4 |
| 369 | A4: ProSkin | `apertura-scheda` | Tipo servizio ProSkin, slot 4 |
| 371 | A4: Annullato | `apertura-scheda` | Annullamento slot 4 |
| 373 | A4: Rinviato | `apertura-scheda` | Rinvio slot 4 |
| 375 | Appuntamento 5 | `apertura-scheda` | Trigger nuovo apt slot 5 |
| 377 | A5: Fusion | `apertura-scheda` | Tipo servizio Fusion, slot 5 |
| 379 | A5: ProSkin | `apertura-scheda` | Tipo servizio ProSkin, slot 5 |
| 381 | A5: Rinviato | `apertura-scheda` | Rinvio slot 5 |
| 383 | A5: Annullato | `apertura-scheda` | Annullamento slot 5 |
| 387 | Start Puntuale a premiata | `puntuale_e_premiata.js` | Avvia promo puntualita' |
