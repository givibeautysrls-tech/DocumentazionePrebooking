# CLAUDE.md — No Mas Vello

Questo file definisce come Claude Code deve lavorare su questo progetto.
Leggi tutto prima di eseguire qualsiasi operazione.

---

## Descrizione del sistema

Questo progetto gestisce gli appuntamenti per i centri epilazione del
franchising No Mas Vello. Il sistema e' composto da tre parti integrate:

- **Worker Cloudflare**: i server che lavorano in automatico dietro le
  quinte. Ricevono segnali, eseguono logica e comunicano con i sistemi
  esterni.
- **Script Airtable** (`/script-backup`): codice che si attiva quando
  un operatore preme un pulsante nelle tabelle (apertura scheda, rinvio,
  annullamento, chiusura appuntamento, ecc.).
- **Keap**: il CRM che gestisce contatti, tag e automazioni di marketing.

---

## Fonti di verita'

Ogni tipo di risorsa ha una fonte di verita' precisa. Usa SEMPRE la fonte
corretta per ogni tipo di operazione. Non mescolare mai le fonti.

### Documentazione e script -> repo GitHub (DocumentazionePrebooking)

**URL repo:** `https://github.com/givibeautysrls-tech/DocumentazionePrebooking`
**Branch principale:** `main`

Questa repo e' la fonte di verita' per:
- `/docs` -> documentazione tecnica completa del sistema (Cloudflare,
  Airtable, Keap). E' il riferimento da consultare nella Fase 1 per
  qualsiasi decisione.
- `/script-backup` -> codice degli script Airtable. Questa e' la copia
  aggiornata degli script su cui lavorare.
- `/changelogs` -> log cronologico di tutte le modifiche apportate al
  sistema. Viene creato al primo commit se non esiste ancora.
- `/keap-backup` -> IGNORARE. La documentazione Keap e' gia' in `/docs`.

```
/docs             -> documentazione (fonte di verita' per le decisioni)
/script-backup    -> script Airtable (fonte di verita' per il codice)
/workers-backup   -> SOLO backup di riferimento, non usare per operare
/changelogs       -> log modifiche (creato al primo commit se mancante)
/keap-backup      -> IGNORARE
```

**Lettura dei file:** avviene direttamente tramite il collegamento nativo
alla repo in Claude Code.

**Scrittura e commit:** il collegamento nativo e' in sola lettura.
Tutte le modifiche ai file (documentazione, script, changelog) devono
essere committate e pushate tramite il server MCP GitHub.
Non usare git da riga di comando per operazioni su questa repo.

### Codice Worker Cloudflare -> MCP Cloudflare

Il codice dei worker Cloudflare si legge, modifica e deploya
**esclusivamente tramite il server MCP Cloudflare**.
La cartella `/workers-backup` in questa repo e' solo un backup
di riferimento — non va mai usata come fonte operativa per i worker.

---

## Contesto delle azioni esterne

Il prompt di ogni richiesta puo' includere un sommario delle azioni gia'
eseguite manualmente dall'utente su sistemi esterni prima di richiedere
l'intervento del codice. Questo sommario puo' contenere, ad esempio:

- Automazioni create o modificate su Keap
- Tag aggiunti o rimossi su Keap
- Campi creati manualmente su Airtable (quelli che MCP Airtable
  non puo' creare autonomamente)
- Pulsanti aggiunti o rinominati su Airtable
- Qualsiasi altra modifica operativa gia' applicata sui sistemi

**Queste informazioni sono parte integrante della richiesta.**
Devono essere lette con attenzione e usate per:

1. Comprendere il contesto reale in cui si inserisce la modifica
2. Assicurarsi che il codice prodotto sia coerente con le modifiche
   gia' applicate (ad esempio, se l'utente ha gia' creato un campo con
   un certo nome, il codice deve usare esattamente quel nome)
3. Evitare di duplicare o contraddire quanto gia' fatto manualmente
4. Aggiornare la documentazione in /docs riflettendo anche le azioni
   esterne, non solo le modifiche al codice

Se il sommario delle azioni esterne e' incompleto o ambiguo rispetto
a quanto necessario per produrre codice corretto, segnalalo prima
di procedere e chiedi le informazioni mancanti.

---

## FASE 1 — Pianificazione (obbligatoria per qualsiasi richiesta)

**Prima di eseguire qualsiasi operazione**, indipendentemente dal tipo
di richiesta (modifica a worker, script Airtable, documentazione o altro),
devi sempre:

1. Leggere la documentazione in `/docs` per comprendere il contesto
   completo della richiesta:
   - Quali componenti sono coinvolti
   - Quali dipendenze esistono tra i componenti
   - Quali flussi esistenti potrebbero essere impattati
   - Eventuali rischi: modifiche che potrebbero rompere altri flussi
     anche non direttamente coinvolti

2. Tenere conto del sommario delle azioni esterne fornito nel prompt,
   integrandolo con quanto trovato nella documentazione.

3. Costruire un piano e presentarlo all'utente in linguaggio semplice,
   senza termini tecnici, con questo formato:

---
### Piano di modifica

**Cosa cambiera':**
[descrizione semplice di cosa fara' il sistema dopo la modifica,
dal punto di vista dell'utente finale]

**Azioni esterne gia' applicate (dal sommario fornito):**
[riepilogo di quello che l'utente ha gia' fatto manualmente,
per confermare che e' stato recepito correttamente]

**Componenti coinvolti:**
[lista dei componenti che verranno modificati, con una riga di
spiegazione semplice per ciascuno — senza nomi tecnici]

**Possibili effetti collaterali:**
[cosa potrebbe essere impattato anche indirettamente —
se nulla, scrivere esplicitamente "Nessun effetto collaterale previsto"]

**Rischi identificati:**
[eventuali flussi che potrebbero rompersi o comportamenti inattesi —
se nessuno, scrivere "Nessun rischio identificato"]

**Operazioni che verranno eseguite in sequenza:**
1. [prima operazione in linguaggio semplice]
2. [seconda operazione]
3. ...

---

4. **Attendere approvazione esplicita** prima di procedere.
   Non iniziare nessuna modifica finche' l'utente non conferma
   (es. "ok", "procedi", "vai").

---

## FASE 2 — Esecuzione modifiche Worker Cloudflare

Segui questo processo nell'ordine esatto ogni volta che una modifica
coinvolge i worker Cloudflare.

1. **Lettura dell'ultima versione**
   Leggi il codice attuale dei worker coinvolti tramite MCP Cloudflare.
   Non usare `/workers-backup` come riferimento operativo.

2. **Modifica del codice**
   Apporta tutte le modifiche necessarie ai worker tramite MCP Cloudflare,
   assicurandoti che siano coerenti con le azioni esterne gia' applicate
   dall'utente (nomi di campi, tag, automazioni, ecc.).
   Se durante la modifica emergono problemi o dipendenze non previste
   nella Fase 1, fermati e segnala all'utente prima di continuare.

3. **Deploy su Cloudflare**
   Esegui il deploy di tutti i worker modificati tramite MCP Cloudflare.
   Verifica che ogni deploy sia andato a buon fine prima di procedere
   al successivo.
   Se un deploy fallisce, fermati e segnala il problema in linguaggio
   semplice prima di continuare con gli altri.

4. **Aggiornamento documentazione**
   Aggiorna i file rilevanti in `/docs` riportando:
   - Cosa e' stato modificato e perche'
   - L'impatto sugli altri sistemi collegati
   - Le azioni esterne gia' applicate dall'utente che hanno portato
     a questa modifica (es. nuovi campi Airtable, nuove automazioni
     Keap), in modo che la documentazione rifletta lo stato reale
     completo del sistema
   Committa e pusha le modifiche su main tramite MCP GitHub.

5. **Changelog**
   Crea o aggiorna il file di log in `/changelogs`.
   Se la cartella non esiste ancora, creala con questo primo commit.
   Usa un file per anno/mese (es. `2026-03.md`) e aggiungi ogni
   modifica in cima al file con questo formato:

---
#### [data e ora] — [titolo breve della modifica]

**Contesto — azioni esterne gia' applicate:**
[riepilogo delle modifiche manuali fatte dall'utente prima
di questa operazione, se presenti]

**Modifica richiesta:**
[descrizione in linguaggio semplice della modifica richiesta]

**Componenti modificati:**
- [nome componente]: [cosa e' cambiato e perche']

**Deploy effettuati:**
- [nome worker]: [esito — successo / fallimento]

**Documentazione aggiornata:**
- [file aggiornati con una riga di descrizione per ciascuno]

**Note:**
[eventuali problemi riscontrati, decisioni prese, cose da monitorare]

---

Committa e pusha il changelog su main tramite MCP GitHub.

---

## FASE 2 — Esecuzione modifiche Script Airtable

Gli script Airtable non possono essere modificati direttamente dal sistema:
il codice viene prodotto qui e deve essere copiato manualmente nelle basi
Airtable dall'utente. Questo passaggio manuale e' obbligatorio e non puo'
essere saltato. Esistono due sotto-processi distinti.

---

### Sotto-processo A — Modifica di script esistenti

1. **Lettura dell'ultima versione**
   Leggi il codice attuale dello script da `/script-backup`.

2. **Produzione del codice modificato**
   Apporta le modifiche necessarie producendo il codice aggiornato
   completo e pronto per essere incollato, assicurandoti che sia
   coerente con le azioni esterne gia' applicate dall'utente
   (nomi di campi, struttura delle tabelle, pulsanti, ecc.).

3. **Istruzioni per l'utente**
   Fornisci istruzioni esaustive e passo passo per copiare il codice
   nelle basi Airtable. Le istruzioni devono coprire tutte e 4 le basi
   (Arzano, Portici, Torre del Greco, Pomigliano) e seguire questo schema
   per ciascuna:

   1. Vai su airtable.com e accedi
   2. Apri la base [nome centro]
   3. Vai sulla tabella Appuntamenti
   4. Clicca su Extensions in alto a destra
   5. Trova lo script [nome script] e aprilo
   6. Seleziona tutto il testo nell'editor (Ctrl+A o Cmd+A) e cancellalo
   7. Incolla il nuovo codice
   8. Clicca Save
   9. Ripeti per la base successiva

   Le istruzioni devono essere precedute da questo disclaimer, sempre
   visibile e mai omesso:

   IMPORTANTE — Esegui la procedura di copia del codice nelle basi
   Airtable PRIMA di fare qualsiasi altra cosa, incluse eventuali
   correzioni o modifiche successive. Se esegui altre operazioni prima
   di completare questa procedura su tutte e 4 le basi, il sistema
   perdera' la copia corretta dei codici Airtable e potrebbe non
   funzionare correttamente.

4. **Aggiornamento script-backup**
   Aggiorna il file corrispondente in `/script-backup` con il nuovo
   codice prodotto e committa e pusha su main tramite MCP GitHub.

5. **Aggiornamento documentazione**
   Aggiorna i file rilevanti in `/docs` riportando:
   - Cosa e' stato modificato nello script e perche'
   - L'impatto sugli altri sistemi collegati
   - Le azioni esterne gia' applicate dall'utente collegate a questa
     modifica
   Committa e pusha su main tramite MCP GitHub.

6. **Changelog**
   Crea o aggiorna il file di log in `/changelogs` con questo formato
   e committa e pusha su main tramite MCP GitHub:

---
#### [data e ora] — [titolo breve della modifica]

**Contesto — azioni esterne gia' applicate:**
[riepilogo delle modifiche manuali fatte dall'utente prima
di questa operazione, se presenti]

**Modifica richiesta:**
[descrizione in linguaggio semplice della modifica richiesta]

**Script modificati:**
- [nome script]: [cosa e' cambiato e perche']

**Azione manuale richiesta:**
Copia del codice nelle 4 basi Airtable (Arzano, Portici,
Torre del Greco, Pomigliano) — da eseguire prima di qualsiasi
altra operazione.

**Documentazione aggiornata:**
- [file aggiornati con una riga di descrizione per ciascuno]

**Note:**
[eventuali problemi riscontrati, decisioni prese, cose da monitorare]

---

---

### Sotto-processo B — Creazione di nuovi script

1. **Creazione campi su Airtable via MCP**
   Crea tramite MCP Airtable tutti i campi necessari che non sono gia'
   presenti nelle basi e che MCP Airtable e' in grado di creare
   autonomamente. Fallo su tutte e 4 le basi (Arzano, Portici,
   Torre del Greco, Pomigliano).
   I campi gia' creati manualmente dall'utente e dichiarati nel sommario
   iniziale non vanno ricreati — usali cosi' come sono, rispettando
   esattamente i nomi indicati.
   Se durante questa fase emerge che un campo necessario non puo' essere
   creato via MCP e non e' stato dichiarato dall'utente nel sommario,
   annotalo: verra' segnalato all'utente dopo la produzione del codice.

2. **Produzione del codice del nuovo script**
   Scrivi il codice completo del nuovo script, pronto per essere
   incollato in Airtable, assicurandoti che faccia riferimento ai campi
   con gli stessi nomi esatti usati in fase di creazione (sia quelli
   creati via MCP che quelli dichiarati dall'utente nel sommario).

3. **Istruzioni per l'utente**
   Fornisci un'unica procedura guidata completa che copra tutte e 4 le
   basi (Arzano, Portici, Torre del Greco, Pomigliano) nell'ordine
   seguente:

   Se ci sono campi mancanti non creabili via MCP, segnalali per primi
   in questa sezione specificando per ciascuno:
   - Il nome del campo
   - Il tipo di campo necessario
   - Lo scopo che ha nel funzionamento dello script
   Chiedi all'utente se desidera ricevere istruzioni passo passo per
   crearli manualmente. Se la risposta e' positiva, includi le istruzioni
   per la creazione manuale di questi campi come primo step della
   procedura, prima delle istruzioni per incollare lo script.

   **Creazione dello script (per ogni base):**
   1. Vai su airtable.com e accedi
   2. Apri la base [nome centro]
   3. Vai sulla tabella Appuntamenti
   4. Clicca su Extensions in alto a destra
   5. Clicca su Add an extension
   6. Cerca "Scripting" e selezionalo
   7. Assegna allo script il nome [nome script]
   8. Incolla il codice nell'editor
   9. Clicca Save
   10. Ripeti per la base successiva

   **Collegamento dei pulsanti allo script (se necessario):**
   Per ogni pulsante da collegare allo script:
   1. Vai sulla tabella Appuntamenti
   2. Apri le impostazioni del campo pulsante [nome pulsante]
   3. In Action seleziona Run script
   4. Seleziona lo script [nome script] appena creato
   5. Salva

   Le istruzioni devono essere precedute da questo disclaimer, sempre
   visibile e mai omesso:

   IMPORTANTE — Esegui questa procedura completa (inclusa la creazione
   di eventuali campi mancanti) PRIMA di fare qualsiasi altra cosa,
   incluse eventuali correzioni o modifiche successive. Se esegui altre
   operazioni prima di completare questa procedura su tutte e 4 le basi,
   il sistema perdera' la copia corretta dei codici Airtable e potrebbe
   non funzionare correttamente.

4. **Inserimento nuovo script in script-backup**
   Crea il nuovo file in `/script-backup` con il codice prodotto
   e committa e pusha su main tramite MCP GitHub.

5. **Aggiornamento documentazione**
   Aggiorna i file rilevanti in `/docs` riportando:
   - Scopo del nuovo script
   - Tabelle e campi coinvolti (specificando quali sono stati creati
     via MCP, quali erano gia' esistenti, e quali sono stati creati
     manualmente dall'utente)
   - Come si attiva (pulsante, automatico, ecc.)
   - Dipendenze da altri componenti del sistema
   Committa e pusha su main tramite MCP GitHub.

6. **Changelog**
   Crea o aggiorna il file di log in `/changelogs` con questo formato
   e committa e pusha su main tramite MCP GitHub:

---
#### [data e ora] — [titolo breve]

**Contesto — azioni esterne gia' applicate:**
[riepilogo delle modifiche manuali fatte dall'utente prima
di questa operazione, se presenti]

**Nuovo script creato:**
[nome script] — [descrizione in linguaggio semplice di cosa fa]

**Campi creati via MCP Airtable:**
- [nome campo]: [tipo e scopo]

**Campi creati manualmente dall'utente (dal sommario):**
- [nome campo]: [tipo e scopo]

**Campi mancanti segnalati all'utente (non creabili via MCP):**
- [nome campo]: [tipo e scopo — da creare manualmente]

**Azione manuale richiesta:**
Creazione dello script nelle 4 basi Airtable (Arzano, Portici,
Torre del Greco, Pomigliano) e collegamento dei pulsanti —
da eseguire prima di qualsiasi altra operazione.

**Documentazione aggiornata:**
- [file aggiornati con una riga di descrizione per ciascuno]

**Note:**
[eventuali problemi riscontrati, decisioni prese, cose da monitorare]

---

---

## Modifiche Keap — solo documentazione

Le modifiche su Keap (tag, automazioni, custom field, ecc.) vengono
sempre eseguite manualmente dall'utente. Claude Code non interviene
mai direttamente su Keap.

Quando il prompt include nel sommario delle azioni esterne delle
modifiche fatte su Keap, Claude Code deve:

1. Aggiornare i file rilevanti in `/docs` riportando fedelmente
   le modifiche indicate, inclusi:
   - Tag creati, modificati o rimossi
   - Automazioni create o modificate, con trigger e azioni descritte
   - Custom field aggiunti o modificati
   - Qualsiasi altra modifica operativa su Keap indicata nel sommario
   La documentazione deve spiegare non solo cosa e' cambiato, ma anche
   perche' e quale impatto ha sugli altri sistemi (Airtable, worker).
   Committa e pusha su main tramite MCP GitHub.

2. Includere le modifiche Keap nel changelog in `/changelogs`,
   aggiungendo questa sezione al formato gia' definito,
   e committare su main:

**Modifiche Keap (eseguite manualmente):**
- [tag / automazione / custom field]: [cosa e' cambiato e perche']

---

## Regole generali

- Usa sempre la fonte di verita' corretta per ogni tipo di risorsa
  (vedi sezione "Fonti di verita'")
- Non procedere mai senza approvazione esplicita dopo la Fase 1
- Il sommario delle azioni esterne fornito nel prompt e' parte integrante
  della richiesta: deve essere recepito, usato per produrre codice
  coerente, e riflesso nella documentazione e nel changelog
- Se durante l'esecuzione emerge qualcosa di non previsto, fermati,
  segnala il problema in linguaggio semplice e attendi istruzioni
- Non saltare mai l'aggiornamento della documentazione e del changelog:
  fanno parte integrante di ogni modifica, non sono opzionali
- Ogni deploy Cloudflare deve essere verificato prima di passare
  al successivo
- La documentazione che produci deve includere sempre: cosa e' cambiato,
  perche', l'impatto sugli altri sistemi, e le azioni esterne collegate.
  Deve essere utile e comprensibile a chi la legge in futuro
- La cartella `/keap-backup` va ignorata in ogni operazione

---

## Variabili d'ambiente e secret

[PLACEHOLDER — lista variabili d'ambiente, secret e configurazioni
critiche da definire dopo analisi della codebase]

---

## Configurazione Wrangler

[PLACEHOLDER — comandi e configurazioni Wrangler specifici per
questo progetto da definire]

---

## Note operative

[PLACEHOLDER — note operative aggiuntive da aggiungere nel tempo]
