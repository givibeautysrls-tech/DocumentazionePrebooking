/**
 * Script Airtable - Rinvio Appuntamento
 * Parte del sistema Prebooking centralizzato
 */

// === CONFIGURAZIONE ===
const INFO_RECORD_ID = "recZqxq5Uji0ZTO5z";   
const WORKER_URL = "https://apertura-scheda.notifichegielvi.workers.dev/api/prebooking/rinvio";
const infoTable = base.getTable("KeapAPIVars")
const infoRecord = await infoTable.selectRecordAsync(INFO_RECORD_ID)
const CENTRO = infoRecord?.getCellValue("Centro") || "Arzano"; // Cambia in base alla base Airtable

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

// Verifica appuntamento non già rinviato
if (aptRecord.getCellValue("Rinviato")) {
    const dataRinvio = aptRecord.getCellValue("Data Rinvio");
    output.text(`❌ ERRORE: Appuntamento già rinviato al ${dataRinvio}`);
    output.text("Non è quello che vuoi? Chiedi assistenza");
    throw new Error("Appuntamento già rinviato");
}

// Verifica data rinvio presente
const dataRinvio = aptRecord.getCellValue("Data Rinvio");
if (!dataRinvio) {
    output.text("❌ ERRORE: Data di rinvio non presente");
    output.text("Inserisci una data nel campo 'Data Rinvio' e riprova");
    throw new Error("Data rinvio mancante");
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
    output.text("❌ ERRORE: Cliente non ha Keap ID, controlla che la scheda sia aperta");
    throw new Error("Cliente senza Keap ID");
}

// Appuntamento
const aptKeapID = aptRecord.getCellValue("KeapID");
if (!aptKeapID) {
    output.text("❌ ERRORE: Appuntamento non ha Keap ID, controlla che la scheda sia aperta");
    throw new Error("Appuntamento senza Keap ID");
}

const numeroAppuntamento = aptRecord.getCellValue("NumAptKeap");
if (!numeroAppuntamento) {
    output.text("❌ ERRORE: Numero appuntamento mancante, controlla che la scheda sia aperta");
    throw new Error("NumAptKeap mancante");
}


let reason = await input.textAsync('Specifica il motivo del rinvio');
let prebooking = aptRecord.getCellValue("Prebooking (Apertura Scheda)")[0]
let prebookingTable = base.getTable("Prebooking")

prebookingTable.updateRecordAsync(prebooking.id,{ "Feedback Cliente" : "RINVIATO: "+reason })

const dataVecchia = aptRecord.getCellValue("Data e ora");
const trattamentoLinked = aptRecord.getCellValue("Trattamento");
const incassoPrevisto = aptRecord.getCellValue("Incasso previsto");
const isPromozione = aptRecord.getCellValue("Promozione")
const prezzoPromozionale = aptRecord.getCellValue("Prezzo promozione")
const noMsgCheck = aptRecord.getCellValue("Rinvia senza messaggio");
const isPrepagato = aptRecord.getCellValue("Prepagato");
const operatrice = aptRecord.getCellValue("Appuntamento preso da")

// Trattamenti
if (!trattamentoLinked || trattamentoLinked.length === 0) {
    output.text("❌ ERRORE: Nessun trattamento associato");
    throw new Error("Trattamenti mancanti");
}

const trattamentiString = trattamentoLinked.map(t => t.name).join(", ");

// === CHIAMATA AL WORKER ===
output.text("🔄 Invio dati al server...");

const payload = {
    centro: CENTRO,
    cliente: {
        id: clienteRecordId,
        keapId: customerKeapID,
        nome: clienteRecord.getCellValue("Nome") + " " + clienteRecord.getCellValue("Cognome")
    },
    appuntamento: {
        id: aptRecord.id,
        keapId: aptKeapID,
        numeroAppuntamento: numeroAppuntamento,
        dataVecchia: dataVecchia,
        trattamenti: trattamentiString,
        incassoPrevisto: incassoPrevisto || 0
    },
    rinvio: {
        nuovaDataEOra: dataRinvio,
        motivoRinvio: "Non specificato",
        noMessaggio: noMsgCheck || false,
    },
    motivazione: reason
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
const updates = [];

// Marca vecchio appuntamento come rinviato
updates.push(
    appuntamentiTable.updateRecordAsync(aptRecord.id, {
        "Rinviato": 1
    })
);

// Crea nuovo appuntamento
if (result.appuntamentoNuovo) {
    const nuovoApptId = await appuntamentiTable.createRecordAsync({
        "Cliente": [{ id: clienteRecordId }],
        "Data e ora": dataRinvio,
        "Trattamento": trattamentoLinked,
        "KeapID": result.appuntamentoNuovo.keapId,
        "NumAptKeap": result.appuntamentoNuovo.numeroAppuntamento,
        "Promozione" : isPromozione,
        // ✅ Aggiungi prezzo promozione solo se promozione attiva
        ...(isPromozione && { "Prezzo promozione": prezzoPromozionale }),
        "Prepagato": isPrepagato,
        "Presente": false,
        "Rinviato": 0,
        "Annullato": 0,
        "Appuntamento preso da": operatrice
    });
    
    // Crea prebooking per nuovo appuntamento
    const prebookingTable = base.getTable("Prebooking");
    await prebookingTable.createRecordAsync({
        "Cliente": [{ id: clienteRecordId }],
        "Appuntamento": [{ id: nuovoApptId }]
    });
    
    output.text("✅ Nuovo appuntamento e prebooking creati");
}

// Esegui tutti gli aggiornamenti
await Promise.all(updates);

// === OUTPUT FINALE ===
output.text("✅ RINVIO COMPLETATO");
for (let msg of result.messages) {
    output.text(msg);
}

output.markdown(`**Data vecchia:** ${dataVecchia}`);
output.markdown(`**Nuova data:** ${dataRinvio}`);
if (result.appuntamentoNuovo) {
    output.markdown(`**Nuovo Keap ID:** ${result.appuntamentoNuovo.keapId}`);
    output.markdown(`**Numero Slot:** ${result.appuntamentoNuovo.numeroAppuntamento}`);
}

