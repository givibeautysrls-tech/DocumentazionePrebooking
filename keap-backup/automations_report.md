---

# REPORT CRM KEAP — NMV (No Mas Vello)
### Analisi completa automazioni — 24/03/2026

---

# 1. PANORAMICA GENERALE

## Elenco automazioni

| ID | Nome | Categoria | Scopo (1 riga) | Trigger principale | Tipo 
azioni |
|----|------|-----------|---------------|-------------------|-------------|
| 511 | NMV – Temperatura rinvii | — | Gestisce il follow-up su contatti 
che hanno rinviato un appuntamento | Tag applicato (3 tag di rinvio/A4-A5) 
| Tag add/remove, delay 30gg |
| 497 | Compleanni | No Mas Vello | Invia comunicazione di compleanno al 
contatto | Inferito: data compleanno del contatto | Email/messaggio, tag |
| 353 | NMV – Feedback trimestrale | No Mas Vello | Raccolta feedback 
periodica ogni 3 mesi | Inferito: tag o data | Email, tag |
| 343 | NMV – Referral – Richiesto messaggio invito | No Mas Vello | Invia 
il messaggio di invito referral quando richiesto | Tag applicato (evento 
referral) | Email/messaggio |
| 339 | NMV – Referral – Followup Adesione Referral | No Mas Vello | Segue 
il cliente che ha aderito al programma referral | Tag applicato (adesione 
referral) | Email, tag |
| 331 | NMV – Referral – Riattivazione Referral | No Mas Vello | Riattiva 
un referral dormiente o inattivo | Tag applicato (stato referral) | Email, 
tag |
| 329 | NMV – Referral – Temperatura | No Mas Vello | Scalda il contatto 
referral nel tempo | Tag applicato | Email, delay, tag |
| 327 | NMV – Referral – Invio link Referral + followup | No Mas Vello | 
Invia il link del programma referral e fa followup | Tag applicato | 
Email, tag |
| 325 | NMV – Referral – Invito al programma | No Mas Vello | Invita il 
contatto a partecipare al referral | Tag applicato | Email |
| 323 | NMV – Referral – Invio Premio | No Mas Vello | Invia il premio al 
referral che ha portato clienti | Tag applicato | Email, tag |
| 321 | NMV – Referral – Benvenuto nuovo referree + invio buono | No Mas 
Vello | Accoglie il nuovo contatto arrivato da referral + invia buono | 
Tag applicato (nuovo referree) | Email, tag |
| 319 | NMV – Referral – Grazie | No Mas Vello | Ringrazia il referral 
attivo | Tag applicato | Email |
| 205 | NMV – Closed Opportunity | No Mas Vello | Gestisce il contatto 
dopo chiusura di un'opportunità | Opportunity stage changed | Tag, update 
contatto |
| **201** | **NMV – Appuntamento Rimandato/Annullato** | No Mas Vello | 
Gestisce messaggi e pulizia tag per appuntamenti annullati o rimandati | 
Tag applicato (A1/A2 Annullato, A3 Rinviato) | Messaggi, tag remove |
| 185 | NMV – Recensioni | No Mas Vello | Raccoglie e stimola recensioni 
dopo la visita | Inferito: tag post-visita o appuntamento | Email, tag |
| **179** | **NMV – Nuovo Appuntamento** | No Mas Vello | Gestisce la 
comunicazione e i reminder per nuovi appuntamenti | Tag applicato 
(Appuntamento 1 o 2) | Messaggi HTTP, field timer, tag |
| 135 | Contatti NMV – WelcomeOptin | No Mas Vello | Sequenza di benvenuto 
per nuovi opt-in | Web Form / optin | Email, tag |
| 75 | NMV – PreBooking | No Mas Vello | Segue un contatto interessato ma 
non ancora prenotato | Tag applicato (interesse prenotazione) | Email, 
delay, tag |
| 69 | MH – Salon Startup – 24 Marzo – Temp | Salon Startup | 
Template/campagna temporanea Salon Startup (probabilmente disattivata) | 
Inferito: data o tag evento | Email |
| 17 | Contatti Salon Startup | — | Gestione contatti generici per marchio 
Salon Startup | Inferito: form o tag | Tag, email |
| 15 | NMV – Temperatura clienti | No Mas Vello | Mantiene calda la 
relazione con clienti esistenti nel tempo | Tag applicato (stato cliente) 
| Email, delay, tag |
| 13 | Pulizia Contatti | — | Rimuove tag obsoleti o normalizza lo stato 
dei contatti | Inferito: trigger periodico o manuale | Tag remove, update 
|
| 7 | Conferma Email | — | Invia email di conferma (optin o azione) | 
Inferito: form submit o tag | Email di conferma |

---

## Sintesi sistema

**Trigger più usati:** Il sistema usa quasi esclusivamente **tag 
applicati** come trigger. Quasi tutte le automazioni partono 
dall'applicazione di un tag specifico, che funge da segnale di stato. È un 
sistema basato su tagging intensivo.

**Azioni più usate:** tag apply/remove, invio messaggi (prevalentemente 
HTTP Request, verosimilmente verso un sistema esterno come WhatsApp o 
SMS), delay timer, field timer agganciati a campi data custom.

**Logica generale del sistema:** NMV usa Keap come orchestratore. I tag 
codificano lo stato del contatto (es: `AT -> AT – NMV – ...` per trigger, 
`S -> S – NMV – ...` per stato). Ogni evento chiave (appuntamento 
prenotato, rinviato, annullato, referral avviato, ecc.) scrive un tag, che 
poi avvia la relativa automazione. Le sequenze inviano messaggi 
(probabilmente via canale esterno), gestiscono tempi di attesa relativi a 
date custom (`a1: data`, `a2: data`), e al termine rimuovono i tag di 
stato.

---

# 2. AUTOMAZIONI APPUNTAMENTI — ANALISI APPROFONDITA

---

## NMV – Nuovo Appuntamento (ID 179)

### Scopo
Gestisce l'intero ciclo di comunicazione per un appuntamento prenotato: 
dalla conferma immediata ai reminder progressivi prima della data, con 
percorsi separati per tipo di servizio (Fusion vs ProSkin) e per slot 
temporale (Appuntamento 1 vs Appuntamento 2).

---

### Trigger
L'automazione ha **due trigger distinti e paralleli**:

- **Trigger 1 — "Applicato TAG App1"**: si attiva quando viene applicato 
il tag `AT -> AT – NMV – Appuntamenti – Appuntamento 1`
- **Trigger 2 — "Applicato TAG App2"**: si attiva quando viene applicato 
il tag `AT -> AT – NMV – Appuntamenti – Appuntamento 2`

I due percorsi sono identici nella struttura ma gestiscono due slot 
appuntamento distinti, con campi data differenti (`a1: data` per App1, 
`a2: data` per App2).

---

### Flusso generale

Quando un contatto prenota un appuntamento, viene applicato un tag (App1 o 
App2). L'automazione si avvia, attende 1 ora (probabilmente per lasciare 
stabilizzare il dato), poi verifica il tipo di servizio prenotato e il suo 
profilo per decidere quale sequenza di messaggi inviare. Da quel momento 
invia una conferma immediata, aspetta che ci si avvicini alla data 
dell'appuntamento, e invia uno o più reminder. Se l'appuntamento viene 
annullato o rinviato nel frattempo, un goal parallelo intercetta il 
contatto e lo porta su una sequenza di pulizia. Se invece si presenta 
puntuale, può entrare nel percorso "Puntuale e premiata".

---

### Struttura logica

**Step 1 — Attesa 1 ora:**
Sequenza "ATTESA 1h" con un Delay Timer di 1 ora esatta. Scopo probabile: 
attendere che il sistema esterno (es. gestionale appuntamenti) abbia 
aggiornato i campi data del contatto in Keap prima di procedere.

**Step 2 — Decision Diamond (primo):**
Controlla i tag del contatto e smista su 3 percorsi:
- Se ha tag `AT -> AT – NMV – Appuntamenti – A1: Fusion` **e non** ha `S 
-> S – NMV – Bassa Frequenza Messaggi` → **Sequenza messaggi A1 – 
Fusion**
- Se ha tag `AT -> AT – NMV – Appuntamenti – A1: ProSkin` **e non** ha `S 
-> S – NMV – Bassa Frequenza Messaggi` → **Sequenza messaggi A1 – 
ProSkin**
- Se ha tag `S -> S – NMV – Promo – Puntuale e premiata` → **Puntuale e 
premiata**
- Altrimenti: nessuna azione (non entra in nessuna sequenza)

**Step 3 — Sequenza messaggi (Fusion o ProSkin — pattern identico):**
- Invio immediato: **Messaggio di conferma** (HTTP Request — 
verosimilmente WhatsApp/SMS)
- Field Timer: attendi fino a **7 giorni prima** della data appuntamento 
del contatto (campo `a1: data`) alle ore 8:00
- Field Timer: attendi fino a **15 giorni lavorativi prima** della data 
appuntamento alle ore 8:00
- Invio: **Messaggio reminder 15gg** (HTTP Request)

**Step 4 — Goal "Puntuale e premiata":**
Intercetta il contatto se entra nel percorso promozionale (ha il tag promo 
attivo). Smista su ulteriore sequenza.

**Step 5 — Goal paralleli di uscita:**
- **"Rimuovi TAG apt1"**: goal che intercetta il contatto e rimuove il tag 
di ingresso dell'appuntamento (pulizia stato)
- **"Applicato TAG Annullato/Rinviato"**: goal che intercetta il contatto 
se durante l'attesa viene applicato un tag di annullamento/rinvio, 
portandolo fuori dalla sequenza reminder

**Il percorso App2 replica la stessa struttura** con tag e campo data `a2: 
data`.

---

### Azioni principali (per tipo)

- **HTTP Request (Messaggio)**: Invia il messaggio di conferma 
appuntamento immediatamente all'avvio. I messaggi sono raggruppati in 
sequenze chiamate "Sequenza messaggi", ciascuna contenente più step. La 
distinzione Fusion/ProSkin suggerisce che i contenuti dei messaggi sono 
diversi per tipo di servizio.

- **Field Timer**: Usato per sincronizzare i reminder con la data 
specifica dell'appuntamento del contatto (campo `a1: data` o `a2: data`). 
Esempio: "attendi fino a 7 giorni prima della data appuntamento alle 
8:00". Questo è il meccanismo chiave del timing dei reminder.

- **Tag (rimozione)**: Al termine del flusso, o in caso di uscita 
anticipata, vengono rimossi i tag di stato/trigger. Serve per "pulire" il 
contatto ed evitare rientri involontari nell'automazione.

- **Goal/Decision Diamond**: Usato come biforcazione condizionale per 
smistare i contatti in base al tipo di servizio prenotato e al profilo 
comunicativo.

---

### Logica inferita
Il sistema tratta ogni appuntamento come un "slot" numerato (1 o 2 — 
probabilmente corrispondenti a un secondo appuntamento nella serie, es. 
seduta di follow-up). Il tipo di servizio (Fusion vs ProSkin) determina il 
contenuto dei messaggi. Il flag "Bassa Frequenza Messaggi" è un filtro di 
silenzio per contatti che preferiscono meno comunicazioni. I messaggi 
vengono inviati probabilmente via canale esterno (HTTP Request verso 
WhatsApp Business o simile).

---

### Dipendenze evidenti

- **Tag di trigger**: `AT -> AT – NMV – Appuntamenti – Appuntamento 1` e 
`Appuntamento 2`
- **Tag di servizio**: `AT -> AT – NMV – Appuntamenti – A1: Fusion`, `A1: 
ProSkin`
- **Tag di stato/filtro**: `S -> S – NMV – Bassa Frequenza Messaggi`, `S 
-> S – NMV – Promo – Puntuale e premiata`
- **Campi custom**: `a1: data` (data appuntamento 1), presumibilmente `a2: 
data` (data appuntamento 2)
- **Sistema esterno**: HTTP Request verso endpoint esterno (WhatsApp 
Business API o simile) — il tipo di blocco "Send HTTP Request" con 
etichetta "NEW" indica integrazione esterna
- **Automazione correlata**: NMV – Appuntamento Rimandato/Annullato 
(gestisce l'exit path in caso di rinvio/cancellazione)
- **Automazione correlata**: NMV – Temperatura rinvii (gestisce il 
follow-up post-rinvio)

---

### Criticità

- **Tag come stato**: L'intero sistema di routing si basa su tag. 
Un'applicazione errata o mancante di un tag (es. manca A1:Fusion) fa sì 
che il contatto non entri in nessuna sequenza dopo l'attesa di 1 ora, 
senza nessun fallback o alert.
- **Timing fragile**: I Field Timer agganciati a `a1: data` dipendono dal 
fatto che quel campo sia valorizzato prima dell'1 ora di attesa. Se il 
dato non arriva in tempo, il timer si comporta in modo imprevedibile.
- **Doppio percorso App1/App2**: La struttura è duplicata. Qualsiasi 
modifica al flusso va applicata manualmente in entrambi i rami, con 
rischio di disallineamento nel tempo.

---

## NMV – Appuntamento Rimandato/Annullato (ID 201)

### Scopo
Gestisce la reazione del sistema quando un appuntamento viene annullato o 
rinviato: invia messaggi appropriati (distinti per caso: annullato vs 
rimandato) e rimuove i tag di stato per "resettare" il contatto.

---

### Trigger
L'automazione ha **tre trigger distinti** (tutti tag applicati):

- **A3 Rimandato**: tag `AT -> AT – NMV – Appuntamenti – A3: Rinviato`
- **A1: Annullato**: tag `AT -> AT – NMV – Appuntamenti – A1: Annullato`
- **A2: Annullato**: tag `AT -> AT – NMV – Appuntamento – A2: Annullato`

I trigger per annullamento coprono due slot (A1 e A2), mentre il rinvio 
copre solo A3 (terzo evento, verosimilmente il caso in cui l'appuntamento 
viene spostato dopo essere già stato fissato).

---

### Flusso generale

Quando arriva il segnale di annullamento o rinvio (via tag), il sistema 
smista il contatto sul percorso corretto (rimandato vs annullato), invia i 
messaggi corrispondenti, e poi rimuove i tag di stato usati nel processo. 
La logica è di reazione rapida: nessuna attesa, azione immediata.

---

### Struttura logica

**Flusso "Rimandato" (trigger A3 Rimandato):**
- Trigger: `A3: Rinviato` → Diamond
- Diamond → "Messaggi Rimandato" (sequenza messaggi per rinvio)
- → "Rimuovi TAG Rimandato" (rimozione del tag di rinvio)

**Flusso "Annullato — primo livello" (trigger A1 + A2 Annullato 
insieme):**
- Trigger A1:Annullato e A2:Annullato convergono su un Diamond condiviso
- Diamond → "Messaggi Annullato" (due sequenze distinte per i due slot)
- → "Rimuovi TAG Annullato"

**Flusso "Annullato — terzo slot" (A2: Annullato terzo trigger):**
- Terzo trigger `A2: Annullato` (distinto dagli altri due) → Diamond
- → "Messaggi Annullato" + "Rimuovi TAG Annullato" (stesso pattern)

*Nota: la presenza di un terzo trigger A2:Annullato separato dagli altri 
due è anomala — potrebbe indicare un percorso ridisegnato nel tempo oppure 
un caso edge con logica leggermente diversa nel Diamond.*

---

### Azioni principali (per tipo)

- **Sequenza messaggi (HTTP Request)**: Invia messaggi distinti per il 
caso "rimandato" e per il caso "annullato". Esempio: sequenza "Messaggi 
Rimandato" contiene probabilmente un messaggio di tipo "ci dispiace, ti 
aiutiamo a riprogrammare" e la sequenza "Messaggi Annullato" un messaggio 
di tipo "abbiamo ricevuto la tua cancellazione".

- **Tag (rimozione)**: "Rimuovi TAG Rimandato" e "Rimuovi TAG Annullato" 
puliscono lo stato del contatto dopo la comunicazione, liberandolo per 
future automazioni.

---

### Logica inferita
L'automazione è puramente reattiva: riceve un segnale di stato, comunica 
la reazione al cliente (con messaggi differenziati per tipo di evento), e 
pulisce lo stato. Non contiene logica di re-engagement diretta — quella è 
gestita da automazioni separate (es. NMV – Temperatura rinvii che gestisce 
i rinvii successivi).

---

### Dipendenze evidenti

- **Tag di trigger**: `A3: Rinviato`, `A1: Annullato`, `A2: Annullato`
- **Sistema esterno**: HTTP Request per invio messaggi (stesso sistema di 
NMV – Nuovo Appuntamento)
- **Automazione collegata**: NMV – Temperatura rinvii (prende il controllo 
dopo il rinvio)
- **Automazione collegata**: NMV – Nuovo Appuntamento (produce i tag di 
annullamento/rinvio come exit goal)

---

### Criticità

- **Tre trigger per due casi**: la presenza di un terzo trigger 
A2:Annullato separato è ambigua. Non è chiaro se sia una duplicazione o un 
caso con logica diversa. Da verificare manualmente.
- **Nessun fallback esplicito**: se il Diamond non ha regole soddisfatte, 
il contatto non entra in nessuna sequenza — nessun messaggio, nessun 
cleanup del tag. Potenziale tag zombie.
- **Nessun re-engagement**: l'automazione comunica ma non avvia nessuna 
logica di recupero/riprenotazione (delegata evidentemente ad altri flussi, 
ma la connessione non è esplicita nell'interfaccia).

---

# 3. MAPPATURA SEMPLIFICATA

## Tag ricorrenti e possibile funzione

| Tag | Funzione probabile |
|-----|--------------------|
| `AT -> AT – NMV – Appuntamenti – Appuntamento 1` | Trigger: nuovo 
appuntamento slot 1 |
| `AT -> AT – NMV – Appuntamenti – Appuntamento 2` | Trigger: nuovo 
appuntamento slot 2 |
| `AT -> AT – NMV – Appuntamenti – A1: Fusion` | Tipo servizio: Fusion, 
slot 1 |
| `AT -> AT – NMV – Appuntamenti – A1: ProSkin` | Tipo servizio: ProSkin, 
slot 1 |
| `AT -> AT – NMV – Appuntamenti – A1: Annullato` | Evento: appuntamento 1 
annullato |
| `AT -> AT – NMV – Appuntamenti – A2: Annullato` | Evento: appuntamento 2 
annullato |
| `AT -> AT – NMV – Appuntamenti – A3: Rinviato` | Evento: appuntamento 3 
rinviato |
| `AT -> AT – NMV – Appuntamenti – A4: Rinviato` | Evento: appuntamento 4 
rinviato (usato in 511) |
| `AT -> AT – NMV – Appuntamenti – A5: Rinviato` | Evento: appuntamento 5 
rinviato (usato in 511) |
| `AT -> AT – NMV – Temperatura Rinvii – Inizio` | Trigger inizio 
temperatura post-rinvio |
| `AT -> AT – NMV – Start Puntuale a premiata` | Trigger segmento 
promozionale puntualità |
| `S -> S – NMV – Rinvio x1` | Stato: primo rinvio effettuato (usato in 
511) |
| `S -> S – NMV – Bassa Frequenza Messaggi` | Preferenza: contatto vuole 
meno messaggi |
| `S -> S – NMV – Promo – Puntuale e premiata` | Stato promo: idoneo a 
"Puntuale e premiata" |

**Prefissi naming convention identificati:**
- `AT -> AT –` : tag usati come trigger di automazione
- `S -> S –` : tag usati come stato/segmento del contatto

## Campi ricorrenti

| Campo | Uso probabile |
|-------|--------------|
| `a1: data` | Data dell'appuntamento 1 — usato dai Field Timer per 
scheduling reminder |
| `a2: data` | Data dell'appuntamento 2 — stesso uso per slot 2 (inferito) 
|

## Flussi principali identificati

**Flusso Appuntamento completo (happy path):**
`Appuntamento prenotato` → tag Appuntamento 1/2 → NMV Nuovo Appuntamento 
→ conferma + reminder → Appuntamento eseguito → (potenziale tag 
Puntuale e premiata → NMV Temperatura clienti / Recensioni)

**Flusso Appuntamento interrotto:**
`Appuntamento annullato/rinviato` → tag Annullato/Rinviato → NMV 
Appuntamento Rimandato/Annullato → messaggi + pulizia tag → NMV 
Temperatura Rinvii → follow-up nel tempo

**Flusso Referral (macro):**
Invito al programma → link referral → nuovo referree → benvenuto + 
buono → grazie/premio → follow-up adesione → riattivazione se dormiente

---

# 4. OSSERVAZIONI FINALI

**Pattern ricorrenti:**
- L'intero sistema usa i tag come unico meccanismo di comunicazione tra 
automazioni. Non ci sono trigger basati su form, acquisti o eventi nativi 
Keap per le automazioni NMV principali.
- I messaggi vengono inviati quasi certamente via canale esterno (HTTP 
Request), non via email nativa Keap. Questo è il componente più opaco dal 
punto di vista dell'analisi: il contenuto dei messaggi non è ispezionabile 
dall'interfaccia automazioni.
- Il pattern "campo data + Field Timer" è la soluzione usata per i 
reminder pre-appuntamento. È elegante ma fragile se il campo non viene 
popolato tempestivamente.

**Possibili sovrapposizioni:**
- `NMV – Temperatura rinvii` e `NMV – Appuntamento Rimandato/Annullato` 
lavorano sullo stesso contesto (rinvio appuntamento) in sequenza. Il 
passaggio di consegne tra le due non è esplicito nell'interfaccia: dipende 
dall'applicazione del tag di rinvio dal sistema esterno.
- Il tag `A2: Annullato` compare come trigger sia in combinazione con 
A1:Annullato che separatamente nella stessa automazione 201 — potenziale 
duplicazione o logica non documentata.

**Precisazioni:**
- Il numero di "slot appuntamento" (A1, A2, A3, A4, A5) sono gruppi di 
customfields dei contatti che identificano istanze di una singola visita 
nel centro. E stata preferita questa soluzione in quanto keap non 
permette la gestione di istanze appuntamento strutturate attraverso le 
automazioni (non si possono leggere/scrivere dati degli oggetti 
appuntamento)
- Il sistema esterno che riceve le HTTP Request è il cloudflare worker che si occupa di loggare e inoltrare i messaggi whatsapp, descritto nei file della cartella workers-backup 

- Le automazioni con 0 contatti attivi (es. tutte le Referral) non sono 
verificabili nel funzionamento reale — potrebbero essere in attesa di 
attivazione o legacy.

- `NMV – Feedback trimestrale` e `NMV – Recensioni` hanno trigger non 
visibili dall'elenco: richiedono ispezione interna per confermare il 
trigger.

- `Pulizia Contatti` e `Conferma Email` non hanno categoria assegnata e il 
trigger non è deducibile dal nome: da ispezionare separatamente.
