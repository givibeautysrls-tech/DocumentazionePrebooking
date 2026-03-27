/**
 * Script Airtable - Annulla Appuntamento
 * Parte del sistema Prebooking centralizzato
 */
// === CONFIGURAZIONE ===
const INFO_RECORD_ID = "recZqxq5Uji0ZTO5z";   
const WORKER_URL = "https://apertura-scheda.notifichegielvi.workers.dev/api/prebooking/annulla";
const infoTable = base.getTable("KeapAPIVars")
const infoRecord = await infoTable.selectRecordAsync(INFO_RECORD_ID)
const CENTRO = infoRecord?.getCellValue("Centro") || "Arzano"; // Cambia in base alla base Airtable

// === FIELD IDS AIRTABLE ===
const appuntamentoFieldNames = {
    cliente: "fldcmfKuP5JWhDLtn",
    keapid: "fldvzDLWzL8RL1aLy",
    numaptkeap: "fld5nCiDy8X0o5ZHD",
    annullato: "fldgLrYjQ3fWM5Rw2",
    data_e_ora: "fldy0rOapheuBOwpY",
    trattamento: "fldWzEjFT7wUoCEDI"
};

const clienteFieldNames = {
    keapid: "flduX9mOEmzFPNTtY",
    nome: "fldtD13XA83lWJ5aG",
    cognome: "fldUNF7DWN2YiXH0s"
};

// === INIZIO SCRIPT ===
const appuntamentiTable = base.getTable("Appuntamenti");
const clientiTable = base.getTable("Clienti");

// Recupera record corrente
const aptRecord = await input.recordAsync("Record cliccato", appuntamentiTable);

if (!aptRecord) {
    output.text("❌ ERRORE: Riprova");
    throw new Error("Record non trovato");
}

// === CONTROLLI PRELIMINARI ===

// Verifica appuntamento non già annullato
if (aptRecord.getCellValue("Annullato")) {
    output.text("❌ ERRORE: Appuntamento già annullato");
    throw new Error("Appuntamento già annullato");
}

// === RACCOLTA DATI ===

// Cliente
const clienteLinked = aptRecord.getCellValue("Cliente");
if (!clienteLinked || clienteLinked.length === 0) {
    output.text("❌ ERRORE: Nessun cliente allegato all'appuntamento");
    throw new Error("Cliente mancante");
}

const clienteRecordId = clienteLinked[0].id;
const clienteRecord = await clientiTable.selectRecordAsync(clienteRecordId);

if (!clienteRecord) {
    output.text("❌ ERRORE CRITICO: Contattare assistenza");
    throw new Error("Cliente non trovato");
}

const customerKeapID = clienteRecord.getCellValue("KeapID");
if (!customerKeapID) {
    output.text("❌ ERRORE: Cliente non ha Keap ID");
    throw new Error("Cliente senza Keap ID");
}

// Nome cliente
const nomeCliente = clienteRecord.getCellValue("Nome");
const cognomeCliente = clienteRecord.getCellValue("Cognome");
const nomeCompleto = cognomeCliente 
    ? `${nomeCliente} ${cognomeCliente}` 
    : nomeCliente;

// Appuntamento
const aptKeapID = aptRecord.getCellValue("KeapID");
if (!aptKeapID) {
    output.text("❌ ERRORE: Appuntamento non ha Keap ID");
    throw new Error("Appuntamento senza Keap ID");
}

const numeroAppuntamento = aptRecord.getCellValue("NumAptKeap");
if (!numeroAppuntamento) {
    output.text("❌ ERRORE: Numero appuntamento mancante");
    throw new Error("NumAptKeap mancante");
}

const dataEOra = aptRecord.getCellValue("Data e ora");
const trattamentoLinked = aptRecord.getCellValue("Trattamento");
const incassoPrevisto = aptRecord.getCellValue("Incasso previsto") || 0;

// Trattamenti
let trattamentiString = "N/D";
if (trattamentoLinked && trattamentoLinked.length > 0) {
    trattamentiString = trattamentoLinked.map(t => t.name).join(", ");
}

// === CHIAMATA AL WORKER ===
output.text("🔄 Invio dati al server...");

const payload = {
    centro: CENTRO,
    cliente: {
        id: clienteRecordId,
        keapId: customerKeapID,
        nome: nomeCompleto
    },
    appuntamento: {
        id: aptRecord.id,
        keapId: aptKeapID,
        numeroAppuntamento: numeroAppuntamento,
        dataEOra: dataEOra,
        trattamenti: trattamentiString,
        incassoPrevisto: incassoPrevisto
    }
};

let response;
try {
    response = await remoteFetchAsync(WORKER_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });
} catch (error) {
    output.text("❌ ERRORE CONNESSIONE: " + error.message);
    throw error;
}

if (!response.ok) {
    const errorText = await response.text();
    output.text("❌ ERRORE SERVER: " + errorText);
    throw new Error(errorText);
}

const result = await response.json();

// === GESTIONE RISPOSTA ===
if (!result.success) {
    output.text("❌ ERRORE:");
    if (result.errors) {
        for (let err of result.errors) {
            output.text("  • " + err);
        }
    } else {
        output.text(result.error || "Errore sconosciuto");
    }
    throw new Error(result.error);
}

// === AGGIORNAMENTO AIRTABLE ===

// Marca appuntamento come annullato
await appuntamentiTable.updateRecordAsync(aptRecord.id, {
    [appuntamentoFieldNames.annullato]: 1
});

// === OUTPUT FINALE ===
output.text("✅ ANNULLAMENTO COMPLETATO");
for (let msg of result.messages) {
    output.text(msg);
}

output.markdown(`**Cliente:** ${nomeCompleto}`);
output.markdown(`**Data appuntamento:** ${dataEOra}`);
output.markdown(`**Trattamenti:** ${trattamentiString}`);
output.markdown(`**Incasso previsto:** ${incassoPrevisto} €`);
output.markdown(`**Status:** ANNULLATO`);

