/*TODO:

    - metti tag referral entrato per inviare premio
    - aumenta conteggio referral riscattati in riepilogo mensile
*/

/******************************
 * CONFIGURA QUI I NOMI
 ******************************/
const CONFIG = {
  // Tabella dove si trova il pulsante
  MAIN_TABLE: 'Recensioni e Referral',                     // <-- cambia se diverso
  MAIN_LINKED_CLIENT_FIELD: 'Cliente',            // campo linked a "Clienti"

  // Tabella Clienti e relativi campi
  CLIENTS_TABLE: 'Clienti',                       // <-- cambia se diverso
  CLIENT_KEAPID_FIELD: 'KeapID',                  // campo testo/numero con KeapID
  CLIENT_REFERRER_FIELD: 'Presentata da',         // linked a Clienti (il referrer)

  // Tabella Riepilogo Mensile
  SUMMARY_TABLE: 'Riepilogo Mensile',             // <-- cambia se diverso
  SUMMARY_COUNTER_FIELD: 'Referral riscattati',   // campo numero da incrementare

  // API tagging
  TAG_ENDPOINT_BASE: 'https://applytags.notifichegielvi.workers.dev/',
  TAG_FOR_CLIENT: 337,
  TAG_FOR_REFERRER: 355,
};

/******************************
 * UTILS
 ******************************/
async function applyTag(keapID, tagIDs) {
  if (!keapID) throw new Error('KeapID mancante per applyTag');
  const url = 
`${CONFIG.TAG_ENDPOINT_BASE}?keapID=${encodeURIComponent(String(keapID))}&tagIDs=${encodeURIComponent(String(tagIDs))}`;
  const res = await remoteFetchAsync(url, { method: 'GET' });
  const body = await res.text();
  if (!res.ok) {
    throw new Error(`Tagging fallito (HTTP ${res.status}). Body: ${body}`);
  }
  
}

async function getSingleLinkedRecord(record, field) {
  const linked = record.getCellValue(field);
  if (!linked || linked.length === 0) return null;
  return linked[0];
}

/******************************
 * MAIN
 ******************************/
const mainTable = base.getTable(CONFIG.MAIN_TABLE);
const mainRecord = await input.recordAsync('Seleziona la riga su cui hai cliccato il pulsante:', mainTable);
if (!mainRecord) throw new Error('Nessuna riga selezionata.');

const clientsTable = base.getTable(CONFIG.CLIENTS_TABLE);

// 1) Recupera il Cliente collegato alla riga
const clientLinkedRec = await getSingleLinkedRecord(mainRecord, CONFIG.MAIN_LINKED_CLIENT_FIELD);
if (!clientLinkedRec) throw new Error(`La riga non ha un "${CONFIG.MAIN_LINKED_CLIENT_FIELD}" collegato.`);

// Per leggere i campi dal Cliente, serve la query al record effettivo
const clientQuery = await clientsTable.selectRecordsAsync({
  fields: [CONFIG.CLIENT_KEAPID_FIELD, CONFIG.CLIENT_REFERRER_FIELD],
});
const clientFull = clientQuery.getRecord(clientLinkedRec.id);
if (!clientFull) throw new Error('Impossibile leggere il record Cliente collegato.');

const clientKeapID = clientFull.getCellValueAsString(CONFIG.CLIENT_KEAPID_FIELD)?.trim();
if (!clientKeapID) throw new Error(`Il Cliente collegato non ha "${CONFIG.CLIENT_KEAPID_FIELD}" valorizzato.`);



// 3) Recupera il "Presentato da" (referrer)
const referrerLinked = await getSingleLinkedRecord(clientFull, CONFIG.CLIENT_REFERRER_FIELD);
if (!referrerLinked) {
  throw new Error(`⚠️ ERRORE: Nessun "${CONFIG.CLIENT_REFERRER_FIELD}" trovato.  
Inserisci un cliente nel campo **Presentato da** prima di procedere.`);
}

const referrerFull = clientQuery.getRecord(referrerLinked.id);
if (!referrerFull) {
  throw new Error(`⚠️ ERRORE: Il record collegato in "${CONFIG.CLIENT_REFERRER_FIELD}" non è valido.  
Verifica che sia effettivamente un cliente.`);
}

const referrerKeapID = referrerFull.getCellValueAsString(CONFIG.CLIENT_KEAPID_FIELD)?.trim();
if (!referrerKeapID) {
  throw new Error(`⚠️ ERRORE: Il cliente nel campo "${CONFIG.CLIENT_REFERRER_FIELD}" non ha un KeapID.  
Completa il dato prima di continuare.`);
}
// 2) Applica tag 337 al Cliente
await applyTag(clientKeapID, CONFIG.TAG_FOR_CLIENT);

console.log(`✅ Buono riscattato con successo`);

// Applica tag 355 al referrer
await applyTag(referrerKeapID, CONFIG.TAG_FOR_REFERRER);

console.log(`✅ Premio inviato al cliente collegato`);

// 4) Incrementa +1 "referral riscattati" sull'ULTIMA riga di "Riepilogo Mensile"
const summaryTable = base.getTable(CONFIG.SUMMARY_TABLE);

// Prende tutte le righe e usa l'ultima della lista
const summaryQuery = await summaryTable.selectRecordsAsync({
  fields: [CONFIG.SUMMARY_COUNTER_FIELD],
});

if (summaryQuery.records.length === 0) {
  throw new Error(`La tabella "${CONFIG.SUMMARY_TABLE}" è vuota: impossibile incrementare il contatore.`);
}

// ATTENZIONE: "ultima riga" = ultimo elemento dell'array corrente
const lastSummaryRecord = summaryQuery.records[summaryQuery.records.length - 1];

const currentValRaw = lastSummaryRecord.getCellValue(CONFIG.SUMMARY_COUNTER_FIELD);
const currentVal = typeof currentValRaw === 'number' ? currentValRaw : parseFloat(currentValRaw) || 0;

await summaryTable.updateRecordAsync(lastSummaryRecord, {
  [CONFIG.SUMMARY_COUNTER_FIELD]: currentVal + 1,
});

output.markdown('✅ **Operazione completata**:\n- Tag 337 al Cliente\n- Tag 355 al Presentato da\n- Incrementato **referral 
riscattati** di +1 sull’**ultima riga** di **Riepilogo Mensile**');

