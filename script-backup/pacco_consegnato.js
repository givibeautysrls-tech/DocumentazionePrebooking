/*TODO:
    - Imposta check pacco ricevuto 
    - metti tag adesione referral 
    - aumenta conteggio pacchi consegnati in riepilogo mensile
*/
/******************************
 * CONFIGURA QUI I NOMI
 ******************************/
const CONFIG = {
  // Tabella dove si trova il pulsante
  MAIN_TABLE: 'Recensioni e Referral',                       // <-- cambia se diverso
  MAIN_LINKED_CLIENT_FIELD: 'Cliente',              // campo linked a "Clienti"

  // Tabella Clienti e relativi campi
  CLIENTS_TABLE: 'Clienti',                         // <-- cambia se diverso
  CLIENT_KEAPID_FIELD: 'KeapID',                    // campo testo/numero con KeapID
  CLIENT_PACKAGE_FIELD: 'Pacco Referral Ricevuto',  // campo checkbox/booleano

  // Tabella Riepilogo Mensile
  SUMMARY_TABLE: 'Riepilogo Mensile',               // <-- cambia se diverso
  SUMMARY_COUNTER_FIELD: 'Pacchi Referral Consegnati',       // campo numero da incrementare

  // API tagging
  TAG_ENDPOINT_BASE: 'https://applytags.notifichegielvi.workers.dev/',
  TAG_FOR_PACKAGE: 357,
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
  console.log(`✅ Tag applicato a KeapID=${keapID} (tagIDs=${tagIDs}). Risposta:`, body);
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

// Query dei clienti per leggere i campi
const clientQuery = await clientsTable.selectRecordsAsync({
  fields: [CONFIG.CLIENT_KEAPID_FIELD, CONFIG.CLIENT_PACKAGE_FIELD],
});
const clientFull = clientQuery.getRecord(clientLinkedRec.id);
if (!clientFull) throw new Error('Impossibile leggere il record Cliente collegato.');

const clientKeapID = clientFull.getCellValueAsString(CONFIG.CLIENT_KEAPID_FIELD)?.trim();
if (!clientKeapID) throw new Error(`Il Cliente collegato non ha "${CONFIG.CLIENT_KEAPID_FIELD}" valorizzato.`);

// 2) Verifica doppioni: se il pacco è già segnato come ricevuto, blocca
const alreadyReceived = !!clientFull.getCellValue(CONFIG.CLIENT_PACKAGE_FIELD);
if (alreadyReceived) {
  throw new Error(`⚠️ ERRORE: Il campo "${CONFIG.CLIENT_PACKAGE_FIELD}" è già TRUE per questo cliente.
Operazione annullata per evitare doppi conteggi. Verifica e riprova.`);
}

// 3) Imposta a true il campo "Pacco Referral Ricevuto" (con rollback se qualcosa va storto)
await clientsTable.updateRecordAsync(clientFull, {
  [CONFIG.CLIENT_PACKAGE_FIELD]: true,
});

try {
  // 4) Applica tag 357 al Cliente
  await applyTag(clientKeapID, CONFIG.TAG_FOR_PACKAGE);

  // 5) Incrementa +1 "Pacchi Consegnati" sull'ULTIMA riga di "Riepilogo Mensile"
  const summaryTable = base.getTable(CONFIG.SUMMARY_TABLE);
  const summaryQuery = await summaryTable.selectRecordsAsync({
    fields: [CONFIG.SUMMARY_COUNTER_FIELD],
  });

  if (summaryQuery.records.length === 0) {
    throw new Error(`La tabella "${CONFIG.SUMMARY_TABLE}" è vuota: impossibile incrementare il contatore.`);
  }

  const lastSummaryRecord = summaryQuery.records[summaryQuery.records.length - 1];

  const currentValRaw = lastSummaryRecord.getCellValue(CONFIG.SUMMARY_COUNTER_FIELD);
  const currentVal = typeof currentValRaw === 'number' ? currentValRaw : parseFloat(currentValRaw) || 0;

  await summaryTable.updateRecordAsync(lastSummaryRecord, {
    [CONFIG.SUMMARY_COUNTER_FIELD]: currentVal + 1,
  });

  output.markdown('✅ **Operazione completata**:\n- Campo "Pacco Referral Ricevuto" impostato a TRUE\n- Tag 357 applicato al 
Cliente\n- Incrementato **Pacchi Consegnati** di +1 sull’**ultima riga** di **Riepilogo Mensile**');

} catch (err) {
  // 🔁 Rollback del flag in caso di errore
  await clientsTable.updateRecordAsync(clientFull, {
    [CONFIG.CLIENT_PACKAGE_FIELD]: false,
  });
  throw err; // ripropaga l'errore per visibilità
}

