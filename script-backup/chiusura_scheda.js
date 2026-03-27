/**
 * Script Airtable - Chiusura Scheda
 * Parte del sistema Prebooking centralizzato
 * + Feature Rendiconto Automatico
 */

// === CONFIGURAZIONE ===
const INFO_RECORD_ID = "recZqxq5Uji0ZTO5z";   
const WORKER_URL = "https://apertura-scheda.notifichegielvi.workers.dev/api/prebooking/chiusura";
const infoTable = base.getTable("KeapAPIVars")
const infoRecord = await infoTable.selectRecordAsync(INFO_RECORD_ID)
const CENTRO = infoRecord?.getCellValue("Centro") || "Arzano";

// === FIELD IDS AIRTABLE ===
const prebookingFieldNames = {
    cliente: "fld05nAGn7hzGXE8K",
    appuntamento: "fld9xVPrOS1MwPQpk",
    prossimoAppuntamento: "fldZCd9ydPG3PIBfI",
    acquisto: "fld4yipezOekynfD0",
    esito_prebooking: "fldOIdDCLwYCJlwBM"
};

const clienteFieldNames = {
    keapid: "flduX9mOEmzFPNTtY",
    nome: "fldtD13XA83lWJ5aG",
    cognome: "fldUNF7DWN2YiXH0s",
    email: "fldYWYDOoGU1VHbuu",
    telefono: "fldboBaTDHYpY3j1P"
};

const appuntamentoFieldNames = {
    keapid: "fldvzDLWzL8RL1aLy",
    presente: "fld9Qq8FmixTn66nK",
    rinviato: "fldSFvsHEhGajIRnR",
    annullato: "fldgLrYjQ3fWM5Rw2",
    data_e_ora: "fldy0rOapheuBOwpY",
    trattamento: "fldWzEjFT7wUoCEDI",
    incassoPrevisto: "Incasso previsto",
    promozione: "Promozione",
    prezzoPromo: "Prezzo promozione",
    numaptkeap: "fld5nCiDy8X0o5ZHD"
};

const acquistoFieldNames = {
    totale: "fldsPsqmKzRGROEkE",
    importo_contanti: "fld2Q2iJvLi38m3Fn",
    importo_pos: "fldXjhoChD9JTxP9J",
    prodotti: "fldG8UcHREfmQdsai",
    trattamenti: "fldNARYFKLL3xDncR",
    data: "Data" // Campo data dell'acquisto
};

// === FUNZIONE PER AGGIORNARE RENDICONTO ===
async function aggiornaRendiconto(acquistoRecordId) {
    try {
        const acquistiTable = base.getTable("Acquisti");
        const rendicontoTable = base.getTable("Rendiconto");
        
        // Recupera record acquisto
        const acquistoRecord = await acquistiTable.selectRecordAsync(acquistoRecordId);
        if (!acquistoRecord) {
            output.text("⚠️ Acquisto non trovato per il rendiconto");
            return false;
        }
        
        // Recupera data acquisto (campo Date di Airtable)
        const dataAcquisto = acquistoRecord.getCellValue(acquistoFieldNames.data);
        if (!dataAcquisto) {
            output.text("⚠️ Acquisto senza data, impossibile aggiornare rendiconto");
            return false;
        }
        
        // Airtable restituisce le date in formato ISO: "YYYY-MM-DD"
        // Estraiamo solo la parte della data
        const dataAcquistoISO = typeof dataAcquisto === 'string' 
            ? dataAcquisto.split('T')[0] 
            : dataAcquisto[0];

        console.log(dataAcquistoISO)
        
        // Convertiamo in formato gg/mm/aaaa per visualizzazione
        const [anno, mese, giorno] = dataAcquistoISO.split('-');
        const dataFormattata = `${giorno}/${mese}/${anno}`;
        
        output.text(`📊 Cerco record rendiconto per data: ${dataFormattata}`);
        
        // Cerca record rendiconto con la stessa data
        const queryResult = await rendicontoTable.selectRecordsAsync({
            fields: ["Data", "Incassi"]
        });
        
        let rendicontoRecord = null;
        for (let record of queryResult.records) {
            const recordData = record.getCellValue("Data");
            if (!recordData) continue;
            
            // Normalizza la data del rendiconto in formato ISO
            const recordDataISO = typeof recordData === 'string' 
                ? recordData.split('T')[0] 
                : recordData;
            
            // Confronta in formato ISO (YYYY-MM-DD)
            if (recordDataISO === dataAcquistoISO) {
                rendicontoRecord = record;
                break;
            }
        }
        
        if (!rendicontoRecord) {
            output.text(`⚠️ Nessun record rendiconto trovato per la data ${dataFormattata}`);
            output.text("ℹ️ Assicurati che esista un record Rendiconto per questa data");
            return false;
        }
        
        // Recupera incassi già collegati
        const incassiAttuali = rendicontoRecord.getCellValue("Incassi") || [];
        const incassiIds = incassiAttuali.map(inc => inc.id);
        
        // Verifica se l'acquisto è già collegato
        if (incassiIds.includes(acquistoRecordId)) {
            output.text("ℹ️ Acquisto già presente nel rendiconto");
            return true;
        }
        
        // Aggiungi nuovo acquisto agli incassi
        const nuoviIncassi = [...incassiIds, acquistoRecordId];
        
        await rendicontoTable.updateRecordAsync(rendicontoRecord.id, {
            "Incassi": nuoviIncassi.map(id => ({id}))
        });
        
        output.text(`✅ Acquisto collegato al rendiconto del ${dataFormattata}`);
        return true;
        
    } catch (error) {
        output.text(`❌ Errore aggiornamento rendiconto: ${error.message}`);
        return false;
    }
}

// === INIZIO SCRIPT ===
const prebookingTable = base.getTable("Prebooking");
const appuntamentiTable = base.getTable("Appuntamenti");
const clientiTable = base.getTable("Clienti");
const acquistiTable = base.getTable("Acquisti");

// Recupera record corrente
const prebookingRecord = await input.recordAsync("Record cliccato", prebookingTable);

if (!prebookingRecord) {
    output.text("❌ ERRORE: Riprova");
    throw new Error("Record non trovato");
}

// === CONTROLLO APPUNTAMENTO ===

const appuntamentoLinked = prebookingRecord.getCellValue(prebookingFieldNames.appuntamento);

if (appuntamentoLinked && appuntamentoLinked.length > 0) {
    const aptRecord = await appuntamentiTable.selectRecordAsync(appuntamentoLinked[0].id);
    
    if (aptRecord) {
        const rinviato = aptRecord.getCellValue(appuntamentoFieldNames.rinviato);
        const annullato = aptRecord.getCellValue(appuntamentoFieldNames.annullato);

        // ❌ BLOCCO: Se appuntamento rinviato o annullato, STOP
        if (rinviato) {
            output.text("⚠️ APPUNTAMENTO RINVIATO");
            
            await prebookingTable.updateRecordAsync(prebookingRecord.id, {
                [prebookingFieldNames.esito_prebooking]: "⚠️ Appuntamento rinviato"
            });
            
            return
        }

        if (annullato) {
            output.text("⚠️ APPUNTAMENTO ANNULLATO");
            
            await prebookingTable.updateRecordAsync(prebookingRecord.id, {
                [prebookingFieldNames.esito_prebooking]: "⚠️ Appuntamento annullato"
            });
            
            return 
        }
    }
}

// === RACCOLTA DATI ===

// Cliente
const clienteLinked = prebookingRecord.getCellValue(prebookingFieldNames.cliente);
if (!clienteLinked || clienteLinked.length === 0) {
    output.text("❌ ERRORE: Nessun cliente allegato al prebooking");
    throw new Error("Cliente mancante");
}

const clienteRecordId = clienteLinked[0].id;
const clienteRecord = await clientiTable.selectRecordAsync(clienteRecordId);

if (!clienteRecord) {
    output.text("❌ ERRORE CRITICO: Contattare assistenza");
    throw new Error("Cliente non trovato");
}

const customerKeapID = clienteRecord.getCellValue(clienteFieldNames.keapid);
if (!customerKeapID) {
    output.text("❌ ERRORE: Cliente non ha Keap ID");
    throw new Error("Cliente senza Keap ID");
}

// Dati cliente
const nomeCliente = clienteRecord.getCellValue(clienteFieldNames.nome);
const cognomeCliente = clienteRecord.getCellValue(clienteFieldNames.cognome);
const nomeCompleto = cognomeCliente 
    ? `${nomeCliente} ${cognomeCliente}` 
    : nomeCliente;
const emailCliente = clienteRecord.getCellValue(clienteFieldNames.email)
const telefonoCliente = clienteRecord.getCellValue(clienteFieldNames.telefono)

// Appuntamento (opzionale)
let appuntamentoData = null;
if (appuntamentoLinked && appuntamentoLinked.length > 0) {
    const aptRecord = await appuntamentiTable.selectRecordAsync(appuntamentoLinked[0].id);
    
    if (aptRecord) {
        const presente = aptRecord.getCellValue(appuntamentoFieldNames.presente);
        const aptKeapID = aptRecord.getCellValue(appuntamentoFieldNames.keapid);

        // Validazione presenza
        if (!presente) {
            output.text("❌ ERRORE: Cliente non presente");
            output.text("Segna la presenza oppure rinvia/annulla l'appuntamento");
            throw new Error("Cliente non presente");
        }

        appuntamentoData = {
            id: aptRecord.id,
            keapId: aptKeapID,
            presente: true
        };
    }
}

// Acquisto (opzionale)
let acquistoData = null;
let acquistoRecordId = null;
const acquistoLinked = prebookingRecord.getCellValue(prebookingFieldNames.acquisto);

if (acquistoLinked && acquistoLinked.length > 0) {
    acquistoRecordId = acquistoLinked[0].id;
    const acquistoRecord = await acquistiTable.selectRecordAsync(acquistoRecordId);
    
    if (acquistoRecord) {
        const totale = acquistoRecord.getCellValue(acquistoFieldNames.totale);
        const importoContanti = acquistoRecord.getCellValue(acquistoFieldNames.importo_contanti) || 0;
        const importoPos = acquistoRecord.getCellValue(acquistoFieldNames.importo_pos) || 0;
        const isGiftCard = acquistoRecord.getCellValue("Pagato con Gift Card");

        // Validazione acquisto
        if (!totale && !isGiftCard) {
            output.text("❌ ERRORE: Inserisci l'importo dell'acquisto o segna il pagamento con Gift Card");
            throw new Error("Totale acquisto mancante");
        }

        if (totale > 0 && isGiftCard) {
            output.text("❌ ERRORE: Se segni un pagamento con gift card, il totale deve essere 0");
            throw new Error("Conflitto totale/gift card");
        }

        // Prodotti
        const prodottiLinked = acquistoRecord.getCellValue(acquistoFieldNames.prodotti);
        let prodottiArray = [];
        if (prodottiLinked && prodottiLinked.length > 0) {
            const acquistiProdottiTable = base.getTable("Acquisti Prodotti");
            const prodottiTable = base.getTable("Prodotti");
            
            for (let ap of prodottiLinked) {
                const apRec = await acquistiProdottiTable.selectRecordAsync(ap.id);
                if (!apRec) continue;

                const prodottoLinked = apRec.getCellValue("Prodotto");
                if (!prodottoLinked || prodottoLinked.length === 0) continue;

                const prodRec = await prodottiTable.selectRecordAsync(prodottoLinked[0].id);
                if (!prodRec) continue;

                const nomeProdotto = prodRec.getCellValue("Nome");
                prodottiArray.push(nomeProdotto);
            }
        }

        // Trattamenti
        const trattamentiLinked = acquistoRecord.getCellValue(acquistoFieldNames.trattamenti);
        let trattamentiArray = [];
        if (trattamentiLinked && trattamentiLinked.length > 0) {
            trattamentiArray = trattamentiLinked.map(t => t.name);
        }

        // Validazione prodotti/trattamenti
        if (prodottiArray.length === 0 && trattamentiArray.length === 0) {
            output.text("❌ ERRORE: Inserisci i prodotti o i trattamenti acquistati");
            throw new Error("Acquisto senza prodotti/trattamenti");
        }

        acquistoData = {
            totale: totale || 0,
            importoContanti: importoContanti,
            importoPos: importoPos,
            prodotti: prodottiArray,
            trattamenti: trattamentiArray
        };
    }
}

// Prossimo Appuntamento (opzionale ma importante!)
let prossimoAppuntamentoData = null;
const prossimoAppoLinked = prebookingRecord.getCellValue(prebookingFieldNames.prossimoAppuntamento);

if (prossimoAppoLinked && prossimoAppoLinked.length > 0) {
    output.text("📅 Rilevato prossimo appuntamento...");
    
    for (let appoLink of prossimoAppoLinked) {
        const prossimoAppoRecord = await appuntamentiTable.selectRecordAsync(appoLink.id);
        
        if (!prossimoAppoRecord) continue;
        
        // Controlla se ha già Keap ID (evita duplicati)
        const hasKeapId = prossimoAppoRecord.getCellValue(appuntamentoFieldNames.keapid);
        if (hasKeapId) {
            output.text("ℹ️ Prossimo appuntamento già registrato su Keap");
            continue;
        }
        
        const dataEOra = prossimoAppoRecord.getCellValue(appuntamentoFieldNames.data_e_ora);
        const trattamentoLinked = prossimoAppoRecord.getCellValue(appuntamentoFieldNames.trattamento);
        const incassoPrevisto = prossimoAppoRecord.getCellValue(appuntamentoFieldNames.incassoPrevisto) || 0;
        const isPromozione = prossimoAppoRecord.getCellValue(appuntamentoFieldNames.promozione);
        const prezzoPromo = prossimoAppoRecord.getCellValue(appuntamentoFieldNames.prezzoPromo);
        
        if (!dataEOra) {
            output.text("⚠️ ATTENZIONE: Prossimo appuntamento senza data");
            throw new Error("Aggiungi data e ora del prossimo appuntamento e riprova")
        }
        
        if (!trattamentoLinked || trattamentoLinked.length === 0) {
            output.text("⚠️ ATTENZIONE: Prossimo appuntamento senza trattamenti");
            throw new Error("Aggiungi i trattamenti del prossimo appuntamento e riprova");
        }
        
        // Validazione promozione
        if (isPromozione && !prezzoPromo) {
            output.text("❌ ERRORE: Promozione senza prezzo scontato");
            throw new Error("Promozione richiede prezzo");
        }
        
        if (!isPromozione && prezzoPromo) {
            output.text("❌ ERRORE: Prezzo scontato senza flag promozione");
            throw new Error("Prezzo promo richiede flag");
        }
        
        const trattamentiString = trattamentoLinked.map(t => t.name).join(", ");
        
        prossimoAppuntamentoData = {
            id: prossimoAppoRecord.id,
            dataEOra: dataEOra,
            trattamenti: trattamentiString,
            incassoPrevisto: incassoPrevisto,
            promozione: isPromozione || false,
            prezzoPromo: prezzoPromo || null
        };
        
    }
}

// Determina presenza
let presente = false;
if (appuntamentoData) {
    presente = appuntamentoData.presente;
} else {
    // Se non c'è appuntamento, chiedi conferma
    if (acquistoData || prossimoAppuntamentoData) {
        const btn = await input.buttonsAsync(
            '⚠️ ATTENZIONE: Stai chiudendo la scheda senza un appuntamento completato.\n' +
            'Vuoi continuare?',
            ['Sì', 'No']
        );

        if (btn !== 'Sì') {
            output.text("❌ OPERAZIONE ANNULLATA");
            throw new Error("Chiusura annullata dall'utente");
        }
        presente = false;
    } else {
        output.text("❌ ERRORE: Nessun appuntamento, nessun acquisto, nessun prossimo appuntamento");
        throw new Error("Nessun dato da registrare");
    }
}

// === CHIAMATA AL WORKER ===
output.text("🔄 Invio dati al server...");

const payload = {
    centro: CENTRO,
    cliente: {
        id: clienteRecordId,
        keapId: customerKeapID,
        nome: nomeCliente,
        cognome:cognomeCliente,
        email: emailCliente,
        telefono: telefonoCliente
    },
    presente: presente
};

// Aggiungi appuntamento se presente
if (appuntamentoData) {
    payload.appuntamento = appuntamentoData;
}

// Aggiungi acquisto se presente
if (acquistoData) {
    payload.acquisto = acquistoData;
}

// Aggiungi prossimo appuntamento se presente
if (prossimoAppuntamentoData) {
    payload.prossimoAppuntamento = prossimoAppuntamentoData;
}

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
    
    // Salva messaggio errore in Airtable
    await prebookingTable.updateRecordAsync(prebookingRecord.id, {
        [prebookingFieldNames.esito_prebooking]: "❌ ERRORE: " + (result.error || result.errors?.join(", "))
    });
    
    throw new Error(result.error);
}

// === AGGIORNAMENTO RENDICONTO ===
if (acquistoRecordId) {
    output.text("📊 Aggiornamento rendiconto...");
    await aggiornaRendiconto(acquistoRecordId);
}

// === AGGIORNAMENTO AIRTABLE ===

// Se prossimo appuntamento registrato, aggiorna Airtable
if (result.prossimoAppuntamentoRegistrato && prossimoAppuntamentoData) {
    output.text("✅ Aggiorno Airtable con dati prossimo appuntamento...");
    
    await appuntamentiTable.updateRecordAsync(prossimoAppuntamentoData.id, {
        [appuntamentoFieldNames.keapid]: result.prossimoAppuntamento.keapId,
        [appuntamentoFieldNames.numaptkeap]: result.prossimoAppuntamento.numeroAppuntamento
    });
    
    output.text("✅ Prossimo appuntamento aggiornato su Airtable");
}

// === OUTPUT FINALE ===
output.text("✅ CHIUSURA SCHEDA COMPLETATA");

for (let msg of result.messages) {
    output.text(msg);
}

output.markdown(`**Cliente:** ${nomeCompleto}`);

if (presente) {
    output.markdown(`**Presenza:** ✅ SÌ`);
} else {
    output.markdown(`**Presenza:** ❌ NO`);
}

if (acquistoData) {
    output.markdown(`**Acquisto registrato:** €${acquistoData.totale}`);
    
    if (acquistoData.prodotti.length > 0) {
        output.markdown(`**Prodotti:** ${acquistoData.prodotti.join(", ")}`);
    }
    
    if (acquistoData.trattamenti.length > 0) {
        output.markdown(`**Trattamenti:** ${acquistoData.trattamenti.join(", ")}`);
    }
}

if (result.prossimoAppuntamentoRegistrato) {
    output.markdown(`**Prossimo Appuntamento Registrato:**`);
    output.markdown(`  - Keap ID: ${result.prossimoAppuntamento.keapId}`);
    output.markdown(`  - Slot: A${result.prossimoAppuntamento.numeroAppuntamento}`);
    output.markdown(`  - Data: ${result.prossimoAppuntamento.dataEOra}`);
    output.markdown(`  - Trattamenti: ${result.prossimoAppuntamento.trattamenti}`);
}

// Salva esito in Airtable
const esitoMsg = result.messages.join("\n");
await prebookingTable.updateRecordAsync(prebookingRecord.id, {
    [prebookingFieldNames.esito_prebooking]: "✅ " + esitoMsg
});

output.markdown(`**Status:** SCHEDA CHIUSA`);
