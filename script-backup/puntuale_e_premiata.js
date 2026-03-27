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
  CLIENT_PROMO_FIELD: 'Promo Fidelity',  // campo checkbox/booleano

  // Tabella Riepilogo Mensile
  SUMMARY_TABLE: 'Riepilogo Mensile',               // <-- cambia se diverso
  SUMMARY_COUNTER_FIELD: 'Pacchi Referral Consegnati',       // campo numero da incrementare

  // API tagging
  TAG_ENDPOINT_BASE: 'https://applytags.notifichegielvi.workers.dev/',
  TAG_FOR_PROMO: 387,


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

let newPreference = "Puntuale e Premiata";
// update the notes history value and reset the notes value
await clientsTable.updateRecordAsync(clientLinkedRec.id, {
    "Promo Fidelity": {name: newPreference}
})




try {
    const response = await 
remoteFetchAsync(`https://apertura-scheda.notifichegielvi.workers.dev/api/prebooking/sync-next-appointment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        cliente: {
          keapId: clientKeapID
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
  } catch (error) {
    console.error("❌ Errore chiamata remoteFetchSyncNextAppointment:", error.message);
    throw error;
  }


try {
  // 4) Applica tag 357 al Cliente
  await applyTag(clientKeapID, CONFIG.TAG_FOR_PROMO);

  output.markdown('✅ **Operazione completata**:\n- Promozione attivata per la cliente');

} catch (err) {
  // 🔁 Rollback del flag in caso di errore
  await clientsTable.updateRecordAsync(clientFull, {
    [CONFIG.CLIENT_PACKAGE_FIELD]: false,
  });
  throw err; // ripropaga l'errore per visibilità
}

