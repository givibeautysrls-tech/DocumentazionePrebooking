/**
 * Script Airtable Semplificato
 * Raccoglie dati e chiama il Worker Cloudflare
 */
// === CONFIGURAZIONE ===
const INFO_RECORD_ID = "recZqxq5Uji0ZTO5z";   
const WORKER_URL = "https://apertura-scheda.notifichegielvi.workers.dev/api/prebooking";
const infoTable = base.getTable("KeapAPIVars")
const infoRecord = await infoTable.selectRecordAsync(INFO_RECORD_ID)
const CENTRO = infoRecord?.getCellValue("Centro") || "Arzano"; // Cambia in base alla base Airtable

// === INIZIO SCRIPT ===
const prebookingTable = base.getTable("Prebooking");
const clientiTable = base.getTable("Clienti");
const appuntamentiTable = base.getTable("Appuntamenti");
const trattamentiTable = base.getTable("Trattamenti");

// Recupera record corrente
const prebookingRecord = await input.recordAsync("Record cliccato", prebookingTable);

if (!prebookingRecord) {
    output.text("❌ ERRORE: Riprova");
    throw new Error("Record non trovato");
}

// === RACCOLTA DATI CLIENTE ===
const clienteLinked = prebookingRecord.getCellValue("Cliente");

if (!clienteLinked || clienteLinked.length === 0) {
    output.text("❌ ERRORE: Nessun cliente nel Prebooking");
    throw new Error("Cliente mancante");
}

const clienteRecordId = clienteLinked[0].id;
const clienteRecord = await clientiTable.selectRecordAsync(clienteRecordId);

const clienteData = {
    id: clienteRecordId,
    keapId: clienteRecord.getCellValue("KeapID"),
    nome: clienteRecord.getCellValue("Nome"),
    cognome: clienteRecord.getCellValue("Cognome"),
    email: clienteRecord.getCellValue("Email"),
    telefono: clienteRecord.getCellValue("Telefono")
};

// === RACCOLTA DATI APPUNTAMENTO ===
const appuntamentoLinked = prebookingRecord.getCellValue("Appuntamento");
let appuntamentoData = null;

if (appuntamentoLinked && appuntamentoLinked.length > 0) {
    const apptRecordId = appuntamentoLinked[0].id;
    const appuntamentoRecord = await appuntamentiTable.selectRecordAsync(apptRecordId);

    // Validazione promozione
    const promoCheck = appuntamentoRecord.getCellValue("Promozione");
    const prezzoPromo = appuntamentoRecord.getCellValue("Prezzo promozione");

    if (promoCheck && !prezzoPromo) {
        output.text("❌ ERRORE: Inserisci il prezzo scontato");
        throw new Error("Prezzo promozione mancante");
    }

    if (!promoCheck && prezzoPromo) {
        output.text("❌ ERRORE: Spunta 'Promozione' se inserisci un prezzo scontato");
        throw new Error("Configurazione promozione errata");
    }

    // Raccolta trattamenti
    const lookupDate = prebookingRecord.getCellValue("Data e ora");
    if (!lookupDate) {
        output.text("❌ ERRORE: Inserisci una data valida");
        throw new Error("Data mancante");
    }

    const trattamentiLinked = prebookingRecord.getCellValue("Trattamenti da eseguire");
    if (!trattamentiLinked) {
        output.text("❌ ERRORE: Inserisci almeno un trattamento");
        throw new Error("Trattamenti mancanti");
    }

    let trattamentiRecords = [];
    for (let t of trattamentiLinked) {
        let record = await trattamentiTable.selectRecordAsync(t.id);
        trattamentiRecords.push(record);
    }

    const trattamenti = trattamentiRecords
        .map(t => t?.getCellValueAsString("Nome"))
        .filter(Boolean)
        .join(", ");

    if (trattamenti === "") {
        output.text("❌ ERRORE: Nessun trattamento valido");
        throw new Error("Trattamenti non validi");
    }

    const operatrice = appuntamentoRecord.getCellValue("Appuntamento preso da");
    if (!operatrice) {
        output.text("❌ ERRORE: Seleziona l'operatrice che ha preso l'appuntamento");
        throw new Error("Operatrice mancante");
    }

    appuntamentoData = {
        id: apptRecordId,
        keapId: appuntamentoRecord.getCellValue("KeapID"),
        dataEOra: lookupDate[0],
        trattamenti: trattamenti,
        incassoPrevisto: appuntamentoRecord.getCellValue("Incasso previsto"),
        promozione: promoCheck || false,
        prezzoPromo: prezzoPromo,
        numeroAppuntamento: appuntamentoRecord.getCellValue("NumAptKeap")
    };
}

// === CHIAMATA AL WORKER ===
output.text("🔄 Invio dati al server...");

const payload = {
    centro: CENTRO,
    cliente: clienteData,
    appuntamento: appuntamentoData,
    prebooking: {
        id: prebookingRecord.id
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
const updates = [];

// Aggiorna KeapID cliente se necessario
if (result.cliente && result.cliente.keapId && !clienteData.keapId) {
    updates.push(
        clientiTable.updateRecordAsync(clienteRecordId, {
            "KeapID": result.cliente.keapId
        })
    );
}

// Aggiorna email/telefono se presenti nella risposta
if (result.cliente?.email && !clienteData.email) {
    updates.push(
        clientiTable.updateRecordAsync(clienteRecordId, {
            "Email": result.cliente.email
        })
    );
}

if (result.cliente?.telefono && !clienteData.telefono) {
    updates.push(
        clientiTable.updateRecordAsync(clienteRecordId, {
            "Telefono": result.cliente.telefono
        })
    );
}

// Aggiorna appuntamento se presente
if (appuntamentoData && result.appuntamento) {
    if (result.appuntamento.keapId && !appuntamentoData.keapId) {
        updates.push(
            appuntamentiTable.updateRecordAsync(appuntamentoData.id, {
                "KeapID": result.appuntamento.keapId
            })
        );
    }

    if (result.numeroAppuntamento && !appuntamentoData.numeroAppuntamento) {
        updates.push(
            appuntamentiTable.updateRecordAsync(appuntamentoData.id, {
                "NumAptKeap": result.numeroAppuntamento
            })
        );
    }
}

// Marca prebooking come aperto
updates.push(
    prebookingTable.updateRecordAsync(prebookingRecord.id, {
        "_aperta": 1
    })
);

// Esegui tutti gli aggiornamenti
await Promise.all(updates);

// === OUTPUT FINALE ===
output.text("✅ APERTURA SCHEDA COMPLETATA");
for (let msg of result.messages) {
    output.text(msg);
}

if (appuntamentoData && result.appuntamento) {
    output.markdown(`**Incasso previsto:** €${result.appuntamento.incassoPrevisto || 0}`);
}

