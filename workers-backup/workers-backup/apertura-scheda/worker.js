--3ba1c458086ae34c4fc9cf34aa510c282aace96ce6d9087d15f440e92e81
Content-Disposition: form-data; name="index.js"

var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/index.js
var __defProp2 = Object.defineProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
var __defProp22 = Object.defineProperty;
var __name22 = /* @__PURE__ */ __name2((target, value) => __defProp22(target, "name", { value, configurable: true }), "__name");
var COLOR = {
  reset: "\x1B[0m",
  bold: "\x1B[1m",
  green: "\x1B[32m",
  red: "\x1B[31m",
  yellow: "\x1B[33m",
  cyan: "\x1B[36m",
  magenta: "\x1B[35m"
};
function divider() {
  console.log("\n" + "=".repeat(80));
}
__name(divider, "divider");
function validatePrebookingRequest(data) {
  const errors = [];
  if (!data) {
    return {
      valid: false,
      errors: ["Payload mancante"]
    };
  }
  if (!data.centro || data.centro.trim() === "") {
    errors.push("Centro mancante");
  }
  if (!data.cliente) {
    errors.push("Cliente mancante");
  } else {
    if (!data.cliente.id) errors.push("cliente.id mancante");
    if (!data.cliente.nome) errors.push("cliente.nome mancante");
    if (!data.cliente.cognome) errors.push("cliente.cognome mancante");
    if (!data.cliente.telefono) {
      errors.push("Numero di telefono obbligatorio");
    }
  }
  if (!data.prebooking || !data.prebooking.id) {
    errors.push("prebooking.id mancante");
  }
  if (data.appuntamento) {
    if (data.appuntamento.promozione && !data.appuntamento.prezzoPromo) {
      errors.push("Prezzo promozione mancante");
    }
    if (!data.appuntamento.promozione && data.appuntamento.prezzoPromo) {
      errors.push("Prezzo promozione senza flag promozione");
    }
  }
  return {
    valid: errors.length === 0,
    errors
  };
}
__name(validatePrebookingRequest, "validatePrebookingRequest");
__name2(validatePrebookingRequest, "validatePrebookingRequest");
__name22(validatePrebookingRequest, "validatePrebookingRequest");
function normalizePhoneNumber(telefono) {
  if (!telefono) return null;
  let cleaned = telefono.replace(/\D/g, "");
  if (cleaned.length === 10) {
    cleaned = "39" + cleaned;
  }
  if (cleaned.length !== 12 || !cleaned.startsWith("39")) {
    throw new Error(`Numero telefono non valido: ${telefono}`);
  }
  return cleaned;
}
__name(normalizePhoneNumber, "normalizePhoneNumber");
__name2(normalizePhoneNumber, "normalizePhoneNumber");
__name22(normalizePhoneNumber, "normalizePhoneNumber");
function validateRinvioRequest(data) {
  const errors = [];
  if (!data || typeof data !== "object") {
    return {
      valid: false,
      errors: ["Payload mancante o non valido"]
    };
  }
  if (!data.centro || typeof data.centro !== "string" || data.centro.trim() === "") {
    errors.push("Campo 'centro' obbligatorio");
  }
  if (!data.cliente || typeof data.cliente !== "object") {
    errors.push("Campo 'cliente' obbligatorio");
  } else {
    if (!data.cliente.id || typeof data.cliente.id !== "string") {
      errors.push("cliente.id obbligatorio");
    }
    if (!data.cliente.keapId) {
      errors.push("cliente.keapId obbligatorio");
    }
    if (!data.cliente.nome || data.cliente.nome.trim() === "") {
      errors.push("cliente.nome obbligatorio");
    }
  }
  if (!data.appuntamento || typeof data.appuntamento !== "object") {
    errors.push("Campo 'appuntamento' obbligatorio");
  } else {
    const a = data.appuntamento;
    if (!a.id || typeof a.id !== "string") {
      errors.push("appuntamento.id obbligatorio");
    }
    if (!a.keapId || typeof a.keapId !== "string" && typeof a.keapId !== "number") {
      errors.push("appuntamento.keapId obbligatorio");
    }
    if (!a.numeroAppuntamento || isNaN(Number(a.numeroAppuntamento))) {
      errors.push("appuntamento.numeroAppuntamento obbligatorio (numero valido)");
    }
    if (!a.dataVecchia || a.dataVecchia.toString().trim() === "") {
      errors.push("appuntamento.dataVecchia obbligatorio");
    }
    if (!a.trattamenti || typeof a.trattamenti !== "string" || a.trattamenti.trim() === "") {
      errors.push("appuntamento.trattamenti obbligatorio");
    }
  }
  if (!data.rinvio || typeof data.rinvio !== "object") {
    errors.push("Campo 'rinvio' obbligatorio");
  } else {
    if (!data.rinvio.nuovaDataEOra || data.rinvio.nuovaDataEOra.toString().trim() === "") {
      errors.push("Data e Ora Rinvio obbligatorio");
    }
  }
  return {
    valid: errors.length === 0,
    errors
  };
}
__name(validateRinvioRequest, "validateRinvioRequest");
__name2(validateRinvioRequest, "validateRinvioRequest");
__name22(validateRinvioRequest, "validateRinvioRequest");
function validateAnnullaRequest(data) {
  const errors = [];
  if (!data || typeof data !== "object") {
    return {
      valid: false,
      errors: ["Payload mancante o non valido"]
    };
  }
  if (!data.centro || typeof data.centro !== "string" || data.centro.trim() === "") {
    errors.push("Campo 'centro' obbligatorio");
  }
  if (!data.cliente || typeof data.cliente !== "object") {
    errors.push("Campo 'cliente' obbligatorio");
  } else {
    if (!data.cliente.keapId || data.cliente.keapId.toString().trim() === "") {
      errors.push("cliente.keapId obbligatorio");
    }
    if (!data.cliente.id || data.cliente.id.toString().trim() === "") {
      errors.push("cliente.id obbligatorio");
    }
  }
  if (!data.appuntamento || typeof data.appuntamento !== "object") {
    errors.push("Campo 'appuntamento' obbligatorio");
  } else {
    const a = data.appuntamento;
    if (!a.id || typeof a.id !== "string") {
      errors.push("appuntamento.id obbligatorio");
    }
    if (!a.keapId || typeof a.keapId !== "string" && typeof a.keapId !== "number") {
      errors.push("appuntamento.keapId obbligatorio");
    }
    if (!a.numeroAppuntamento || isNaN(Number(a.numeroAppuntamento)) || Number(a.numeroAppuntamento) < 1 || Number(a.numeroAppuntamento) > 4) {
      errors.push("appuntamento.numeroAppuntamento obbligatorio (1, 2, 3 o 4)");
    }
  }
  return {
    valid: errors.length === 0,
    errors
  };
}
__name(validateAnnullaRequest, "validateAnnullaRequest");
__name2(validateAnnullaRequest, "validateAnnullaRequest");
__name22(validateAnnullaRequest, "validateAnnullaRequest");
function validateSyncNextAppointmentRequest(data) {
  const errors = [];
  if (!data || typeof data !== "object") {
    return {
      valid: false,
      errors: ["Payload mancante o non valido"]
    };
  }
  if (!data.cliente || typeof data.cliente !== "object") {
    errors.push("Campo 'cliente' obbligatorio");
  } else {
    if (!data.cliente.keapId || data.cliente.keapId.toString().trim() === "") {
      errors.push("cliente.keapId obbligatorio");
    }
  }
  return {
    valid: errors.length === 0,
    errors
  };
}
__name(validateSyncNextAppointmentRequest, "validateSyncNextAppointmentRequest");
__name2(validateSyncNextAppointmentRequest, "validateSyncNextAppointmentRequest");
__name22(validateSyncNextAppointmentRequest, "validateSyncNextAppointmentRequest");
function validateChiusuraRequest(data) {
  const errors = [];
  if (!data || typeof data !== "object") {
    return {
      valid: false,
      errors: ["Payload mancante o non valido"]
    };
  }
  if (!data.centro || typeof data.centro !== "string" || data.centro.trim() === "") {
    errors.push("Campo 'centro' obbligatorio");
  }
  if (!data.cliente || typeof data.cliente !== "object") {
    errors.push("Campo 'cliente' obbligatorio");
  } else {
    if (!data.cliente.keapId || data.cliente.keapId.toString().trim() === "") {
      errors.push("cliente.keapId obbligatorio");
    }
    if (!data.cliente.id || data.cliente.id.toString().trim() === "") {
      errors.push("cliente.id obbligatorio");
    }
    if (!data.cliente.nome || data.cliente.nome.trim() === "") {
      errors.push("cliente.nome obbligatorio");
    }
  }
  if (data.presente === void 0 || data.presente === null) {
    errors.push("Campo 'presente' obbligatorio (true/false)");
  }
  if (data.appuntamento) {
    const a = data.appuntamento;
    if (!a.keapId || typeof a.keapId !== "string" && typeof a.keapId !== "number") {
      errors.push("appuntamento.keapId obbligatorio se presente");
    }
    if (!a.id || typeof a.id !== "string") {
      errors.push("appuntamento.id obbligatorio se presente");
    }
  }
  if (data.acquisto) {
    const acq = data.acquisto;
    if (acq.totale === void 0 || acq.totale === null) {
      errors.push("acquisto.totale obbligatorio se presente");
    }
    if (!Array.isArray(acq.prodotti)) {
      errors.push("acquisto.prodotti deve essere un array");
    }
    if (!Array.isArray(acq.trattamenti)) {
      errors.push("acquisto.trattamenti deve essere un array");
    }
  }
  if (data.prossimoAppuntamento) {
    const pa = data.prossimoAppuntamento;
    if (!pa.dataEOra || pa.dataEOra.toString().trim() === "") {
      errors.push("prossimoAppuntamento.dataEOra obbligatorio se presente");
    }
    if (!pa.trattamenti || pa.trattamenti.toString().trim() === "") {
      errors.push("prossimoAppuntamento.trattamenti obbligatorio se presente");
    }
    if (pa.promozione && !pa.prezzoPromo) {
      errors.push("Se promozione=true, prezzoPromo \xE8 obbligatorio");
    }
    if (!pa.promozione && pa.prezzoPromo) {
      errors.push("Se prezzoPromo \xE8 presente, promozione deve essere true");
    }
  }
  return {
    valid: errors.length === 0,
    errors
  };
}
__name(validateChiusuraRequest, "validateChiusuraRequest");
__name2(validateChiusuraRequest, "validateChiusuraRequest");
__name22(validateChiusuraRequest, "validateChiusuraRequest");
function formatDateTime(date = /* @__PURE__ */ new Date()) {
  const giorno = String(date.getDate()).padStart(2, "0");
  const mese = String(date.getMonth() + 1).padStart(2, "0");
  const anno = date.getFullYear();
  const ore = String(date.getHours()).padStart(2, "0");
  const minuti = String(date.getMinutes()).padStart(2, "0");
  const secondi = String(date.getSeconds()).padStart(2, "0");
  return `${giorno}/${mese}/${anno} ${ore}:${minuti}:${secondi}`;
}
__name(formatDateTime, "formatDateTime");
__name2(formatDateTime, "formatDateTime");
__name22(formatDateTime, "formatDateTime");
function getClientIP(request) {
  return request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For")?.split(",")[0] || request.headers.get("X-Real-IP") || "IP non disponibile";
}
__name(getClientIP, "getClientIP");
__name2(getClientIP, "getClientIP");
__name22(getClientIP, "getClientIP");
function createBaseLog(request, data, result, tipo) {
  const now = /* @__PURE__ */ new Date();
  return {
    timestamp: now.toISOString(),
    dataOra: formatDateTime(now),
    tipo,
    // apertura | rinvio | annulla | chiusura
    centro: data.centro || "N/D",
    ip: getClientIP(request),
    cliente: {
      airtableId: data.cliente?.id || "N/D",
      keapId: result.cliente?.keapId || data.cliente?.keapId || "N/D",
      nome: data.cliente?.nome || "N/D",
      cognome: data.cliente?.cognome || "N/D",
      nomeCompleto: `${data.cliente?.nome || ""} ${data.cliente?.cognome || ""}`.trim(),
      email: data.cliente?.email || "N/D",
      telefono: data.cliente?.telefono || "N/D"
    },
    esito: {
      success: result.success || false,
      messaggi: result.messages || [],
      errori: result.errors || (result.error ? [result.error] : []),
      tagApplicati: result.tagApplicati || [],
      numeroAppuntamento: result.numeroAppuntamento || null
    },
    // Placeholder per blocchi custom
    apertura: null,
    rinvio: null,
    annulla: null,
    chiusura: null
  };
}
__name(createBaseLog, "createBaseLog");
__name2(createBaseLog, "createBaseLog");
function printBase(log) {
  divider();
  console.log(`${COLOR.bold}${COLOR.cyan} LOG OPERAZIONE: ${log.tipo.toUpperCase()} ${COLOR.reset}`);
  divider();
  console.log(`${COLOR.bold}Data/Ora:${COLOR.reset} ${log.dataOra}`);
  console.log(`${COLOR.bold}Centro:${COLOR.reset} ${log.centro}`);
  console.log(`${COLOR.bold}IP Client:${COLOR.reset} ${log.ip}`);
  console.log(`
${COLOR.bold}CLIENTE:${COLOR.reset}`);
  console.log(`  - Nome: ${log.cliente.nomeCompleto}`);
  console.log(`  - Email: ${log.cliente.email}`);
  console.log(`  - Telefono: ${log.cliente.telefono}`);
  console.log(`  - Airtable ID: ${log.cliente.airtableId}`);
  console.log(`  - Keap ID: ${log.cliente.keapId}`);
  console.log(`
${COLOR.bold}ESITO:${COLOR.reset}`);
  console.log(`  - Success: ${log.esito.success ? COLOR.green + "SI" : COLOR.red + "NO"}${COLOR.reset}`);
  if (log.esito.messaggi?.length) {
    console.log("  - Messaggi:");
    log.esito.messaggi.forEach((m) => console.log(`     \u2022 ${m}`));
  }
  if (log.esito.errori?.length) {
    console.log(`  - Errori:`);
    log.esito.errori.forEach((e) => console.log(`     \u2022 ${COLOR.red}${e}${COLOR.reset}`));
  }
  if (log.esito.tagApplicati?.length) {
    console.log(`  - Tag Applicati: ${log.esito.tagApplicati.join(", ")}`);
  }
  if (log.esito.numeroAppuntamento) {
    console.log(`  - Numero Appuntamento: ${log.esito.numeroAppuntamento}`);
  }
  divider();
}
__name(printBase, "printBase");
__name2(printBase, "printBase");
function printApertura(log) {
  const ap = log.apertura;
  if (!ap) return;
  console.log(`${COLOR.bold}${COLOR.green}APERTURA SCHEDA${COLOR.reset}`);
  console.log(`  Prebooking ID: ${ap.prebookingId}`);
  if (ap.appuntamento) {
    console.log(`
${COLOR.bold}APPUNTAMENTO:${COLOR.reset}`);
    console.log(`  - Data/Ora: ${ap.appuntamento.dataEOraFormattata}`);
    console.log(`  - Trattamenti: ${ap.appuntamento.trattamenti}`);
    console.log(`  - Incasso Previsto: \u20AC${ap.appuntamento.incassoPrevisto}`);
    console.log(`  - Promozione: ${ap.appuntamento.promozione ? "SI" : "NO"}`);
    if (ap.appuntamento.prezzoPromo) {
      console.log(`  - Prezzo Promo: \u20AC${ap.appuntamento.prezzoPromo}`);
    }
    console.log(`  - Airtable ID: ${ap.appuntamento.airtableId}`);
    console.log(`  - Keap ID: ${ap.appuntamento.keapId}`);
  }
  divider();
}
__name(printApertura, "printApertura");
__name2(printApertura, "printApertura");
function printRinvio(log) {
  const r = log.rinvio;
  if (!r) return;
  console.log(`${COLOR.bold}${COLOR.yellow}RINVIO APPUNTAMENTO${COLOR.reset}`);
  if (r.appuntamentoVecchio) {
    console.log(`
${COLOR.bold}VECCHIO APPUNTAMENTO:${COLOR.reset}`);
    console.log(`  - Data: ${r.appuntamentoVecchio.dataVecchiaFormattata}`);
    console.log(`  - Trattamenti: ${r.appuntamentoVecchio.trattamenti}`);
    console.log(`  - Numero Slot: ${r.appuntamentoVecchio.numeroAppuntamento}`);
    console.log(`  - Incasso Previsto: \u20AC${r.appuntamentoVecchio.incassoPrevisto}`);
  }
  if (r.nuovoAppuntamento) {
    console.log(`
${COLOR.bold}NUOVO APPUNTAMENTO:${COLOR.reset}`);
    console.log(`  - Data: ${r.nuovoAppuntamento.dataEOraFormattata}`);
    console.log(`  - Numero Slot: ${r.nuovoAppuntamento.numeroAppuntamento}`);
    console.log(`  - Keap ID: ${r.nuovoAppuntamento.keapId}`);
  }
  if (r.motivazione) {
    console.log(`
${COLOR.bold}MOTIVAZIONE:${COLOR.reset} ${r.motivazione}`);
  }
  console.log(`${COLOR.bold}Motivo (sistema):${COLOR.reset} ${r.motivo}`);
  console.log(`${COLOR.bold}Messaggio Cliente:${COLOR.reset} ${r.noMessaggio ? "NO" : "SI"}`);
  divider();
}
__name(printRinvio, "printRinvio");
__name2(printRinvio, "printRinvio");
function printAnnulla(log) {
  const a = log.annulla;
  if (!a) return;
  console.log(`${COLOR.bold}${COLOR.red}ANNULLA APPUNTAMENTO${COLOR.reset}`);
  if (a.appuntamento) {
    console.log(`
${COLOR.bold}APPUNTAMENTO:${COLOR.reset}`);
    console.log(`  - Data: ${a.appuntamento.dataFormattata}`);
    console.log(`  - Trattamenti: ${a.appuntamento.trattamenti}`);
    console.log(`  - Numero Slot: ${a.appuntamento.numeroAppuntamento}`);
    console.log(`  - Incasso Previsto: \u20AC${a.appuntamento.incassoPrevisto}`);
    console.log(`  - Keap ID: ${a.appuntamento.keapId}`);
  }
  if (a.motivazione) {
    console.log(`
${COLOR.bold}MOTIVAZIONE:${COLOR.reset} ${a.motivazione}`);
  }
  divider();
}
__name(printAnnulla, "printAnnulla");
__name2(printAnnulla, "printAnnulla");
function printChiusura(log) {
  const ch = log.chiusura;
  if (!ch) return;
  console.log(`${COLOR.bold}${COLOR.magenta}CHIUSURA SCHEDA${COLOR.reset}`);
  if (ch.appuntamentoConcluso) {
    console.log(`
${COLOR.bold}APPUNTAMENTO CONCLUSO:${COLOR.reset}`);
    console.log(`  - Presente: ${ch.appuntamentoConcluso.presente ? "SI" : "NO"}`);
    console.log(`  - Airtable ID: ${ch.appuntamentoConcluso.airtableId}`);
    console.log(`  - Keap ID: ${ch.appuntamentoConcluso.keapId}`);
  }
  if (ch.acquisto) {
    console.log(`
${COLOR.bold}ACQUISTO:${COLOR.reset}`);
    console.log(`  - Totale: \u20AC${ch.acquisto.totale}`);
    console.log(`  - Contanti: \u20AC${ch.acquisto.contanti}`);
    console.log(`  - POS: \u20AC${ch.acquisto.pos}`);
    console.log(`  - Prodotti: ${ch.acquisto.prodotti.join(", ") || "Nessuno"}`);
    console.log(`  - Trattamenti: ${ch.acquisto.trattamenti.join(", ") || "Nessuno"}`);
  }
  if (ch.prossimoAppuntamento) {
    console.log(`
${COLOR.bold}PROSSIMO APPUNTAMENTO:${COLOR.reset}`);
    console.log(`  - Data: ${ch.prossimoAppuntamento.dataEOraFormattata}`);
    console.log(`  - Trattamenti: ${ch.prossimoAppuntamento.trattamenti}`);
    console.log(`  - Incasso Previsto: \u20AC${ch.prossimoAppuntamento.incassoPrevisto}`);
    console.log(`  - Promozione: ${ch.prossimoAppuntamento.promozione ? "SI" : "NO"}`);
    if (ch.prossimoAppuntamento.prezzoPromo) {
      console.log(`  - Prezzo Promo: \u20AC${ch.prossimoAppuntamento.prezzoPromo}`);
    }
    console.log(`  - Keap ID: ${ch.prossimoAppuntamento.keapId}`);
    console.log(`  - Numero Slot: ${ch.prossimoAppuntamento.numeroAppuntamento}`);
  }
  divider();
}
__name(printChiusura, "printChiusura");
__name2(printChiusura, "printChiusura");
function printLog(log) {
  printBase(log);
  switch (log.tipo) {
    case "apertura":
      printApertura(log);
      break;
    case "rinvio":
      printRinvio(log);
      break;
    case "annulla":
      printAnnulla(log);
      break;
    case "chiusura":
      printChiusura(log);
      break;
    default:
      console.log("Tipo log sconosciuto:", log.tipo);
  }
}
__name(printLog, "printLog");
__name2(printLog, "printLog");
function buildAperturaSection(data, result) {
  return {
    prebookingId: data.prebooking?.id || "N/D",
    appuntamento: data.appuntamento ? {
      airtableId: data.appuntamento.id || "N/D",
      keapId: result.appuntamento?.keapId || data.appuntamento.keapId || "N/D",
      dataEOra: data.appuntamento.dataEOra || "N/D",
      dataEOraFormattata: formatAppointmentDateTime(data.appuntamento.dataEOra),
      trattamenti: data.appuntamento.trattamenti || "N/D",
      incassoPrevisto: data.appuntamento.incassoPrevisto || 0,
      promozione: data.appuntamento.promozione || false,
      prezzoPromo: data.appuntamento.prezzoPromo || null,
      numeroAppuntamento: result.numeroAppuntamento || null
    } : null
  };
}
__name(buildAperturaSection, "buildAperturaSection");
__name2(buildAperturaSection, "buildAperturaSection");
function formatAppointmentDateTime(isoString) {
  if (!isoString) return "N/D";
  try {
    const date = new Date(isoString);
    const giorno = String(date.getDate()).padStart(2, "0");
    const mese = String(date.getMonth() + 1).padStart(2, "0");
    const anno = date.getFullYear();
    const ore = String(date.getHours()).padStart(2, "0");
    const minuti = String(date.getMinutes()).padStart(2, "0");
    return `${giorno}/${mese}/${anno} ${ore}:${minuti}`;
  } catch (e) {
    return isoString;
  }
}
__name(formatAppointmentDateTime, "formatAppointmentDateTime");
__name2(formatAppointmentDateTime, "formatAppointmentDateTime");
__name22(formatAppointmentDateTime, "formatAppointmentDateTime");
async function saveLogToKV(env, log) {
  try {
    const ts = /* @__PURE__ */ new Date();
    const key = `log_${ts.getFullYear()}${String(ts.getMonth() + 1).padStart(2, "0")}${String(ts.getDate()).padStart(2, "0")}_${ts.getTime()}`;
    await env.LOGS_KV.put(key, JSON.stringify(log), {
      expirationTtl: 60 * 60 * 24 * 30
      // 30 giorni
    });
    return key;
  } catch (err) {
    console.error("Errore salvataggio log:", err);
    return null;
  }
}
__name(saveLogToKV, "saveLogToKV");
__name2(saveLogToKV, "saveLogToKV");
__name22(saveLogToKV, "saveLogToKV");
async function logAperturaScheda(request, data, result, env) {
  const log = createBaseLog(request, data, result, "apertura");
  log.apertura = buildAperturaSection(data, result);
  printLog(log);
  if (env.LOGS_KV) {
    await saveLogToKV(env, log);
  }
  return log;
}
__name(logAperturaScheda, "logAperturaScheda");
__name2(logAperturaScheda, "logAperturaScheda");
__name22(logAperturaScheda, "logAperturaScheda");
function buildRinvioSection(data, result) {
  return {
    motivazione: data.motivazione || null,
    appuntamentoVecchio: data.appuntamento ? {
      airtableId: data.appuntamento.id || "N/D",
      keapId: data.appuntamento.keapId || "N/D",
      dataVecchia: data.appuntamento.dataVecchia || "N/D",
      dataVecchiaFormattata: data.appuntamento.dataVecchia ? formatAppointmentDateTime(data.appuntamento.dataVecchia) : "N/D",
      trattamenti: data.appuntamento.trattamenti || "N/D",
      numeroAppuntamento: data.appuntamento.numeroAppuntamento || "N/D",
      incassoPrevisto: data.appuntamento.incassoPrevisto || 0
    } : null,
    nuovoAppuntamento: result.appuntamentoNuovo ? {
      keapId: result.appuntamentoNuovo.keapId || "N/D",
      dataEOra: data.rinvio?.nuovaDataEOra || "N/D",
      dataEOraFormattata: data.rinvio?.nuovaDataEOra ? formatAppointmentDateTime(data.rinvio.nuovaDataEOra) : "N/D",
      numeroAppuntamento: result.appuntamentoNuovo.numeroAppuntamento || "N/D"
    } : null,
    motivo: data.rinvio?.motivoRinvio || "N/D",
    noMessaggio: data.rinvio?.noMessaggio || false
  };
}
__name(buildRinvioSection, "buildRinvioSection");
__name2(buildRinvioSection, "buildRinvioSection");
async function logRinvioAppuntamento(request, data, result, env) {
  const log = createBaseLog(request, data, result, "rinvio");
  log.rinvio = buildRinvioSection(data, result);
  printLog(log);
  if (env.LOGS_KV) {
    await saveLogToKV(env, log);
  }
  return log;
}
__name(logRinvioAppuntamento, "logRinvioAppuntamento");
__name2(logRinvioAppuntamento, "logRinvioAppuntamento");
__name22(logRinvioAppuntamento, "logRinvioAppuntamento");
function buildAnnullaSection(data, result) {
  return {
    motivazione: data.motivazione || null,
    appuntamento: data.appuntamento ? {
      airtableId: data.appuntamento.id || "N/D",
      keapId: data.appuntamento.keapId || "N/D",
      dataEOra: data.appuntamento.dataEOra || "N/D",
      dataFormattata: data.appuntamento.dataEOra ? formatAppointmentDateTime(data.appuntamento.dataEOra) : "N/D",
      trattamenti: data.appuntamento.trattamenti || "N/D",
      numeroAppuntamento: data.appuntamento.numeroAppuntamento || "N/D",
      incassoPrevisto: data.appuntamento.incassoPrevisto || 0
    } : null
  };
}
__name(buildAnnullaSection, "buildAnnullaSection");
__name2(buildAnnullaSection, "buildAnnullaSection");
async function logAnnullaAppuntamento(request, data, result, env) {
  const log = createBaseLog(request, data, result, "annulla");
  log.annulla = buildAnnullaSection(data, result);
  printLog(log);
  if (env.LOGS_KV) {
    await saveLogToKV(env, log);
  }
  return log;
}
__name(logAnnullaAppuntamento, "logAnnullaAppuntamento");
__name2(logAnnullaAppuntamento, "logAnnullaAppuntamento");
__name22(logAnnullaAppuntamento, "logAnnullaAppuntamento");
function buildChiusuraSection(data, result) {
  return {
    appuntamentoConcluso: data.appuntamento ? {
      airtableId: data.appuntamento.id || "N/D",
      keapId: data.appuntamento.keapId || "N/D",
      presente: data.presente || false
    } : null,
    acquisto: data.acquisto ? {
      totale: data.acquisto.totale || 0,
      contanti: data.acquisto.importoContanti || 0,
      pos: data.acquisto.importoPos || 0,
      prodotti: data.acquisto.prodotti || [],
      trattamenti: data.acquisto.trattamenti || []
    } : null,
    prossimoAppuntamento: data.prossimoAppuntamento ? {
      airtableId: data.prossimoAppuntamento.id || "N/D",
      dataEOra: data.prossimoAppuntamento.dataEOra || "N/D",
      dataEOraFormattata: formatAppointmentDateTime(data.prossimoAppuntamento.dataEOra),
      trattamenti: data.prossimoAppuntamento.trattamenti || "N/D",
      incassoPrevisto: data.prossimoAppuntamento.incassoPrevisto || 0,
      promozione: data.prossimoAppuntamento.promozione || false,
      prezzoPromo: data.prossimoAppuntamento.prezzoPromo || null,
      keapId: result.prossimoAppuntamento?.keapId || "N/D",
      numeroAppuntamento: result.prossimoAppuntamento?.numeroAppuntamento || "N/D"
    } : null
  };
}
__name(buildChiusuraSection, "buildChiusuraSection");
__name2(buildChiusuraSection, "buildChiusuraSection");
async function logChiusura(request, data, result, env) {
  const log = createBaseLog(request, data, result, "chiusura");
  log.chiusura = buildChiusuraSection(data, result);
  printLog(log);
  if (env.LOGS_KV) {
    await saveLogToKV(env, log);
  }
  return log;
}
__name(logChiusura, "logChiusura");
__name2(logChiusura, "logChiusura");
__name22(logChiusura, "logChiusura");
async function logSyncNextAppointment(request, data, result, env) {
  const log = createBaseLog(request, data, result, "sync-next-appointment");
  log.syncNextAppointment = {
    clienteKeapId: data.cliente?.keapId || "N/D",
    nextAppointment: result.nextAppointment || null,
    success: result.success || false
  };
  printLog(log);
  if (env.LOGS_KV) {
    await saveLogToKV(env, log);
  }
  return log;
}
__name(logSyncNextAppointment, "logSyncNextAppointment");
__name2(logSyncNextAppointment, "logSyncNextAppointment");
__name22(logSyncNextAppointment, "logSyncNextAppointment");
async function sendPushoverNotification(env, notification) {
  if (!env.PUSHOVER_TOKEN || !env.PUSHOVER_USER) {
    console.warn("\u26A0\uFE0F Pushover non configurato (PUSHOVER_TOKEN o PUSHOVER_USER mancanti)");
    return false;
  }
  if (!notification.title || !notification.message) {
    console.error("\u274C Notifica Pushover: title e message obbligatori");
    return false;
  }
  const payload = {
    token: env.PUSHOVER_TOKEN,
    user: env.PUSHOVER_USER,
    title: notification.title,
    message: notification.message,
    priority: notification.priority || 0,
    sound: notification.sound || "pushover",
    html: 1
    // Abilita HTML nel messaggio
  };
  if (notification.url) {
    payload.url = notification.url;
  }
  if (notification.url_title) {
    payload.url_title = notification.url_title;
  }
  if (notification.timestamp) {
    payload.timestamp = notification.timestamp;
  }
  console.log("\u{1F4F2} Invio notifica Pushover...");
  console.log("   - Title:", notification.title);
  console.log("   - Priority:", payload.priority);
  try {
    const response = await fetch("https://api.pushover.net/1/messages.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      const error2 = await response.text();
      console.error("\u274C Errore Pushover:", error2);
      return false;
    }
    const result = await response.json();
    if (result.status === 1) {
      console.log("\u2705 Notifica Pushover inviata con successo");
      return true;
    } else {
      console.error("\u274C Pushover response status != 1:", result);
      return false;
    }
  } catch (error2) {
    console.error("\u274C Errore invio notifica Pushover:", error2.message);
    return false;
  }
}
__name(sendPushoverNotification, "sendPushoverNotification");
__name2(sendPushoverNotification, "sendPushoverNotification");
__name22(sendPushoverNotification, "sendPushoverNotification");
function formatRinvioNotification(data) {
  const { centro, cliente, appuntamento, rinvio, motivazione } = data;
  const nomeCliente = typeof cliente === "string" ? cliente : cliente.nome || "Cliente";
  const dataOriginaria = formatDateItalian(appuntamento.dataVecchia);
  const nuovaData = formatDateItalian(rinvio.nuovaDataEOra);
  let message = `\u{1F4CD} <b>${centro}</b>
\u{1F464} ${nomeCliente}
\u{1F4B6} Valore: ${formatCurrency(appuntamento.incassoPrevisto || 0)}
\u{1F486} Trattamenti: ${appuntamento.trattamenti || "N/D"}
\u{1F4C5} Data originaria: ${dataOriginaria}
\u27A1\uFE0F Nuova data: ${nuovaData}`;
  if (motivazione) {
    message += `
\u{1F4DD} Motivo: ${motivazione}`;
  }
  return {
    title: "Appuntamento Rinviato",
    message: message.trim(),
    priority: 0,
    sound: "pushover",
    timestamp: Math.floor(Date.now() / 1e3)
  };
}
__name(formatRinvioNotification, "formatRinvioNotification");
__name2(formatRinvioNotification, "formatRinvioNotification");
__name22(formatRinvioNotification, "formatRinvioNotification");
function formatDateItalian(isoString) {
  if (!isoString) return "N/D";
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}
__name(formatDateItalian, "formatDateItalian");
__name2(formatDateItalian, "formatDateItalian");
__name22(formatDateItalian, "formatDateItalian");
function formatCurrency(value) {
  if (!value) return "0,00 \u20AC";
  return value.toFixed(2).replace(".", ",") + " \u20AC";
}
__name(formatCurrency, "formatCurrency");
__name2(formatCurrency, "formatCurrency");
__name22(formatCurrency, "formatCurrency");
function formatChiusuraNotification(data) {
  const { centro, cliente, acquisto } = data;
  const nomeCliente = typeof cliente === "string" ? cliente : cliente.nome || "Cliente";
  if (!acquisto || !acquisto.totale || acquisto.totale === 0) {
    return null;
  }
  const totale = acquisto.totale;
  const contanti = acquisto.importoContanti || 0;
  const pos = acquisto.importoPos || 0;
  let message = `\u{1F4CD} <b>${centro}</b>
\u{1F464} ${nomeCliente}
\u{1F4B0} Totale: ${formatCurrency(totale)}`;
  if (contanti > 0 && pos > 0) {
    message += `
\u{1F4B5} Contanti: ${formatCurrency(contanti)}
\u{1F4B3} POS: ${formatCurrency(pos)}`;
  } else if (contanti > 0) {
    message += `
\u{1F4B5} Pagamento: Contanti`;
  } else if (pos > 0) {
    message += `
\u{1F4B3} Pagamento: POS`;
  }
  if (acquisto.prodotti && acquisto.prodotti.length > 0) {
    const prodottiStr = acquisto.prodotti.join(", ");
    message += `
\u{1F6CD}\uFE0F Prodotti: ${prodottiStr}`;
  }
  if (acquisto.trattamenti && acquisto.trattamenti.length > 0) {
    const trattamentiStr = acquisto.trattamenti.join(", ");
    message += `
\u{1F486} Trattamenti: ${trattamentiStr}`;
  }
  return {
    title: "\u{1F4B8} Nuovo Acquisto",
    message: message.trim(),
    priority: 0,
    sound: "cashregister",
    // Suono cassa!
    timestamp: Math.floor(Date.now() / 1e3)
  };
}
__name(formatChiusuraNotification, "formatChiusuraNotification");
__name2(formatChiusuraNotification, "formatChiusuraNotification");
__name22(formatChiusuraNotification, "formatChiusuraNotification");
function formatAnnullaNotification(data) {
  const { centro, cliente, appuntamento, motivazione } = data;
  const nomeCliente = typeof cliente === "string" ? cliente : cliente.nome || "Cliente";
  const dataAppuntamento = formatDateItalian(appuntamento.dataEOra);
  let message = `\u{1F4CD} <b>${centro}</b>
\u{1F464} ${nomeCliente}
\u{1F4B6} Valore: ${formatCurrency(appuntamento.incassoPrevisto || 0)}
\u{1F486} Trattamenti: ${appuntamento.trattamenti || "N/D"}
\u{1F4C5} Data appuntamento: ${dataAppuntamento}
\u274C <b>APPUNTAMENTO ANNULLATO</b>`;
  if (motivazione) {
    message += `
\u{1F4DD} Motivo: ${motivazione}`;
  }
  return {
    title: "Appuntamento Annullato",
    message: message.trim(),
    priority: 0,
    sound: "falling",
    timestamp: Math.floor(Date.now() / 1e3)
  };
}
__name(formatAnnullaNotification, "formatAnnullaNotification");
__name2(formatAnnullaNotification, "formatAnnullaNotification");
__name22(formatAnnullaNotification, "formatAnnullaNotification");
var CONFIG = {
  // Endpoint Keap
  KEAP: {
    CONTACTS: "https://api.infusionsoft.com/crm/rest/v1/contacts",
    APPOINTMENTS: "https://api.infusionsoft.com/crm/rest/v1/appointments",
    XMLRPC: "https://api.infusionsoft.com/crm/xmlrpc/v1",
    TOKEN_URL: "https://api.infusionsoft.com/token",
    TAGS: "https://api.infusionsoft.com/crm/rest/v1/tags"
  },
  // Mappatura Centri -> SendApp Instance ID
  CENTRO_TO_SENDAPP: {
    "Portici": "67F7E1DA0EF73",
    "Arzano": "67EFB424D2353",
    "Torre del Greco": "67EFB605B93A1",
    "Pomigliano": "6926D352155D3"
  },
  // Tag IDs per appuntamenti
  APPOINTMENT_TAGS: {
    A1: 285,
    A2: 287,
    A3: 289,
    A4: 365,
    A5: 375,
    PROSKIN: {
      A1: 309,
      A2: 313,
      A3: 317,
      A4: 369,
      A5: 379
    },
    FUSION: {
      A1: 307,
      A2: 311,
      A3: 315,
      A4: 367,
      A5: 377
    },
    CANCEL: {
      A1: 291,
      A2: 293,
      A3: 295,
      A4: 371,
      A5: 383
    },
    RINVIO: {
      A1: 299,
      A2: 301,
      A3: 303,
      A4: 373,
      A5: 381
    }
  },
  // Custom Fields per Keap
  CUSTOM_FIELDS: {
    // Campi cliente
    CONTACT: {
      CENTRO: 41,
      SENDAPP_INSTANCE: 165,
      CLEAN_PHONE: 171,
      NEXT_APPOINTMENT_DATE: 233,
      NEXT_APPOINTMENT_TIME: 235,
      NEXT_APPOINTMENT_TREATMENTS: 237
    },
    // Campi appuntamento (ContactAction)
    APPOINTMENT: {
      DATA_RINVIO: "_DataRinvio",
      TRATTAMENTI: "_Trattamenti",
      NOTE: "_Note",
      PRESENTE: "_Presente",
      RINVIATO: "_Rinviato",
      ANNULLATO: "_Annullato"
    }
  },
  // Configurazione campi per i 5 appuntamenti (deprecated fields rimossi)
  APPOINTMENT_FIELDS: {
    1: {
      trattamenti: 133,
      data: 185,
      ora: 173
    },
    2: {
      trattamenti: 135,
      ora: 177,
      data: 179
    },
    3: {
      trattamenti: 137,
      ora: 181,
      data: 187
    },
    4: {
      trattamenti: 219,
      ora: 221,
      data: 225
    },
    5: {
      trattamenti: 227,
      ora: 229,
      data: 231
    }
  },
  // Zone per riconoscimento tipo trattamento
  TREATMENT_ZONES: [
    "Dorso",
    "Glutei",
    "Inguine",
    "Gambe",
    "Linea Alba",
    "Orecchie",
    "Mani",
    "Lombare",
    "Consulenza",
    "Altro",
    "Labbro Superiore",
    "Mento",
    "Spalle",
    "Piedi",
    "Petto",
    "Perianale",
    "Addome",
    "Ascelle",
    "Aureola del Seno",
    "Collo Anteriore",
    "Braccia",
    "Collo Posteriore",
    "Viso",
    "Prova Gratuita"
  ],
  // TTL token (12 ore)
  TOKEN_TTL_MS: 12 * 60 * 60 * 1e3
};
async function getValidKeapToken(env) {
  const storedData = await env.KEAP_TOKENS.get("current_token", { type: "json" });
  if (storedData) {
    const { access_token, refresh_token, last_refresh } = storedData;
    const lastMs = new Date(last_refresh).getTime();
    const now = Date.now();
    if (now - lastMs < CONFIG.TOKEN_TTL_MS) {
      return access_token;
    }
    try {
      const newTokens = await refreshKeapToken(env, refresh_token);
      return newTokens.access_token;
    } catch (error2) {
      console.error("Errore refresh token:", error2);
      return env.KEAP_PAK;
    }
  }
  return env.KEAP_PAK;
}
__name(getValidKeapToken, "getValidKeapToken");
__name2(getValidKeapToken, "getValidKeapToken");
__name22(getValidKeapToken, "getValidKeapToken");
async function refreshKeapToken(env, refreshToken) {
  const credentials = `${env.KEAP_CLIENT_ID}:${env.KEAP_CLIENT_SECRET}`;
  const basicAuth = "Basic " + btoa(credentials);
  const response = await fetch(CONFIG.KEAP.TOKEN_URL, {
    method: "POST",
    headers: {
      "Authorization": basicAuth,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken
    })
  });
  if (!response.ok) {
    const error2 = await response.text();
    throw new Error(`Refresh token failed: ${error2}`);
  }
  const data = await response.json();
  const now = (/* @__PURE__ */ new Date()).toISOString();
  await env.KEAP_TOKENS.put("current_token", JSON.stringify({
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    last_refresh: now
  }));
  if (env.AUTH_BASE_ID && env.AUTH_RECORD_ID) {
    await updateAirtableTokens(env, data.access_token, data.refresh_token, now);
  }
  return data;
}
__name(refreshKeapToken, "refreshKeapToken");
__name2(refreshKeapToken, "refreshKeapToken");
__name22(refreshKeapToken, "refreshKeapToken");
async function updateAirtableTokens(env, accessToken, refreshToken, timestamp) {
  try {
    const url = `https://api.airtable.com/v0/${env.AUTH_BASE_ID}/KeapAuth/${env.AUTH_RECORD_ID}`;
    await fetch(url, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${env.AIRTABLE_API_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fields: {
          AccessToken: accessToken,
          RefreshToken: refreshToken,
          LastRefresh: timestamp
        }
      })
    });
  } catch (error2) {
    console.error("Errore aggiornamento Airtable:", error2);
  }
}
__name(updateAirtableTokens, "updateAirtableTokens");
__name2(updateAirtableTokens, "updateAirtableTokens");
__name22(updateAirtableTokens, "updateAirtableTokens");
async function cercaContattoKeap(env, cliente, centro) {
  const token = await getValidKeapToken(env);
  const searchParams = new URLSearchParams();
  const filters = [];
  if (cliente.nome) filters.push(`given_name==${cliente.nome}`);
  if (cliente.cognome) filters.push(`family_name==${cliente.cognome}`);
  if (cliente.email) filters.push(`email==${cliente.email}`);
  if (filters.length > 0) {
    searchParams.set("filter", filters.join(";"));
  }
  searchParams.set("fields", "email_addresses,phone_numbers,custom_fields");
  const url = `${CONFIG.KEAP.CONTACTS}?${searchParams.toString()}`;
  const response = await fetch(url, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  if (!response.ok) {
    const error2 = await response.text();
    throw new Error(`Errore ricerca contatto: ${error2}`);
  }
  const data = await response.json();
  let contatti = data.contacts;
  if (!contatti || contatti.length === 0) {
    return null;
  }
  let contatto;
  if (contatti.length === 1) {
    contatto = contatti[0];
  } else if (cliente.telefono) {
    const cleanPhone = normalizePhoneNumber(cliente.telefono);
    contatto = contatti.find(
      (c) => c.phone_numbers?.[0]?.number.replace(/\D/g, "") === cleanPhone
    );
  }
  if (!contatto) return null;
  const needsUpdate = await checkContactNeedsUpdate(contatto, cliente, centro);
  if (needsUpdate.update) {
    await updateContact(env, contatto.id, needsUpdate.payload);
  }
  return {
    id: Number(contatto.id),
    email: contatto.email_addresses?.[0]?.email || cliente.email,
    telefono: contatto.phone_numbers?.[0]?.number || cliente.telefono
  };
}
__name(cercaContattoKeap, "cercaContattoKeap");
__name2(cercaContattoKeap, "cercaContattoKeap");
__name22(cercaContattoKeap, "cercaContattoKeap");
async function checkContactNeedsUpdate(contatto, cliente, centro) {
  const payload = {
    phone_numbers: [],
    email_addresses: [],
    custom_fields: []
  };
  let needsUpdate = false;
  const keapPhone = contatto.phone_numbers?.[0]?.number;
  let cleanedPhone = keapPhone?.replace(/\D/g, "") || cliente.telefono?.replace(/\D/g, "");
  if (cleanedPhone && cleanedPhone.length === 10) {
    cleanedPhone = "39" + cleanedPhone;
    payload.phone_numbers.push({
      number: cleanedPhone,
      field: "PHONE1"
    });
    payload.custom_fields.push({
      id: CONFIG.CUSTOM_FIELDS.CONTACT.CLEAN_PHONE,
      content: cleanedPhone
    });
    needsUpdate = true;
  }
  const keapEmail = contatto.email_addresses?.[0]?.email;
  if (!keapEmail && cliente.email) {
    payload.email_addresses.push({
      email: cliente.email,
      field: "EMAIL1",
      opt_in_reason: ""
    });
    needsUpdate = true;
  }
  const field41 = contatto.custom_fields?.find((f) => f.id === CONFIG.CUSTOM_FIELDS.CONTACT.CENTRO);
  const field165 = contatto.custom_fields?.find((f) => f.id === CONFIG.CUSTOM_FIELDS.CONTACT.SENDAPP_INSTANCE);
  const okCentro = field41?.content === centro;
  const okSendapp = field165?.content === CONFIG.CENTRO_TO_SENDAPP[centro];
  if (!okCentro || !okSendapp) {
    payload.custom_fields.push(
      {
        id: CONFIG.CUSTOM_FIELDS.CONTACT.CENTRO,
        content: centro
      },
      {
        id: CONFIG.CUSTOM_FIELDS.CONTACT.SENDAPP_INSTANCE,
        content: CONFIG.CENTRO_TO_SENDAPP[centro]
      }
    );
    needsUpdate = true;
  }
  if (payload.phone_numbers.length === 0) delete payload.phone_numbers;
  if (payload.email_addresses.length === 0) delete payload.email_addresses;
  if (payload.custom_fields.length === 0) delete payload.custom_fields;
  return {
    update: needsUpdate,
    payload: Object.keys(payload).length > 0 ? payload : null
  };
}
__name(checkContactNeedsUpdate, "checkContactNeedsUpdate");
__name2(checkContactNeedsUpdate, "checkContactNeedsUpdate");
__name22(checkContactNeedsUpdate, "checkContactNeedsUpdate");
async function updateContact(env, contactId, payload) {
  const token = await getValidKeapToken(env);
  const response = await fetch(`${CONFIG.KEAP.CONTACTS}/${contactId}`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const error2 = await response.text();
    throw new Error(`Errore aggiornamento contatto: ${error2}`);
  }
  return await response.json();
}
__name(updateContact, "updateContact");
__name2(updateContact, "updateContact");
__name22(updateContact, "updateContact");
async function creaContattoKeap(env, cliente, centro) {
  const token = await getValidKeapToken(env);
  if (!cliente.email && !cliente.telefono) {
    throw new Error("Necessario almeno email o telefono");
  }
  const cleanPhone = normalizePhoneNumber(cliente.telefono);
  const payload = {
    given_name: cliente.nome,
    family_name: cliente.cognome,
    email_addresses: cliente.email ? [{
      email: cliente.email,
      field: "EMAIL1"
    }] : [],
    phone_numbers: cleanPhone ? [{
      number: cleanPhone,
      field: "PHONE1"
    }] : [],
    custom_fields: [
      {
        id: CONFIG.CUSTOM_FIELDS.CONTACT.CENTRO,
        content: centro
      },
      {
        id: CONFIG.CUSTOM_FIELDS.CONTACT.SENDAPP_INSTANCE,
        content: CONFIG.CENTRO_TO_SENDAPP[centro]
      },
      {
        id: CONFIG.CUSTOM_FIELDS.CONTACT.CLEAN_PHONE,
        content: cleanPhone
      }
    ]
  };
  const response = await fetch(CONFIG.KEAP.CONTACTS, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const error2 = await response.text();
    throw new Error(`Errore creazione contatto: ${error2}`);
  }
  const contatto = await response.json();
  return {
    id: Number(contatto.id),
    email: contatto.email_addresses?.[0]?.email || null,
    telefono: contatto.phone_numbers?.[0]?.number || null
  };
}
__name(creaContattoKeap, "creaContattoKeap");
__name2(creaContattoKeap, "creaContattoKeap");
__name22(creaContattoKeap, "creaContattoKeap");
function convertiInRomaSeUTC(dataISO) {
  const isUTC = /Z$|[+-]00:00$/.test(dataISO);
  if (!isUTC) {
    return dataISO;
  }
  const dataUTC = new Date(dataISO);
  const mese = dataUTC.getUTCMonth();
  const giorno = dataUTC.getUTCDate();
  const anno = dataUTC.getUTCFullYear();
  const ultimaDomenica = /* @__PURE__ */ __name22((m) => {
    const ultimoGiorno = new Date(Date.UTC(anno, m + 1, 0));
    const day = ultimoGiorno.getUTCDay();
    return ultimoGiorno.getUTCDate() - day;
  }, "ultimaDomenica");
  const isOraLegale = mese > 2 && mese < 9 || mese === 2 && giorno >= ultimaDomenica(2) || mese === 9 && giorno < ultimaDomenica(9);
  const offset = isOraLegale ? 2 : 1;
  const dataRoma = new Date(dataUTC.getTime() + offset * 60 * 60 * 1e3);
  return dataRoma.toISOString().replace("Z", `+${offset.toString().padStart(2, "0")}:00`);
}
__name(convertiInRomaSeUTC, "convertiInRomaSeUTC");
__name2(convertiInRomaSeUTC, "convertiInRomaSeUTC");
__name22(convertiInRomaSeUTC, "convertiInRomaSeUTC");
function formatKeapDate(dateStr) {
  const [yyyy, mm, dd] = dateStr.split("-");
  return `${yyyy}${mm}${dd}`;
}
__name(formatKeapDate, "formatKeapDate");
__name2(formatKeapDate, "formatKeapDate");
__name22(formatKeapDate, "formatKeapDate");
function estraiDataEOra(isoString) {
  const match = isoString.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})/);
  if (!match) {
    throw new Error("Formato ISO non valido");
  }
  const dataISO = formatKeapDate(match[1]);
  const oraStringa = `${match[2]}:${match[3]}`;
  return [dataISO, oraStringa];
}
__name(estraiDataEOra, "estraiDataEOra");
__name2(estraiDataEOra, "estraiDataEOra");
__name22(estraiDataEOra, "estraiDataEOra");
function toGiornoMeseAnno(dateInput) {
  const date = new Date(dateInput);
  const giorno = String(date.getDate()).padStart(2, "0");
  const mese = String(date.getMonth() + 1).padStart(2, "0");
  const anno = date.getFullYear();
  return `${giorno}/${mese}/${anno}`;
}
__name(toGiornoMeseAnno, "toGiornoMeseAnno");
__name2(toGiornoMeseAnno, "toGiornoMeseAnno");
__name22(toGiornoMeseAnno, "toGiornoMeseAnno");
function getTodayFormatted() {
  const today = /* @__PURE__ */ new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  return `${day}/${month}/${year}`;
}
__name(getTodayFormatted, "getTodayFormatted");
__name2(getTodayFormatted, "getTodayFormatted");
__name22(getTodayFormatted, "getTodayFormatted");
function calculateEndTime(startISO) {
  return new Date(new Date(startISO).getTime() + 30 * 60 * 1e3).toISOString();
}
__name(calculateEndTime, "calculateEndTime");
__name2(calculateEndTime, "calculateEndTime");
__name22(calculateEndTime, "calculateEndTime");
function isPostponedAtLeastDays(oldISO, newISO, minDays = 4) {
  const oldD = new Date(oldISO);
  const newD = new Date(newISO);
  if (isNaN(oldD) || isNaN(newD)) {
    throw new Error("Date ISO non valide");
  }
  const startUTC = Date.UTC(oldD.getUTCFullYear(), oldD.getUTCMonth(), oldD.getUTCDate());
  const endUTC = Date.UTC(newD.getUTCFullYear(), newD.getUTCMonth(), newD.getUTCDate());
  const dayMs = 24 * 60 * 60 * 1e3;
  const diffDays = Math.floor((endUTC - startUTC) / dayMs);
  return diffDays >= minDays;
}
__name(isPostponedAtLeastDays, "isPostponedAtLeastDays");
__name2(isPostponedAtLeastDays, "isPostponedAtLeastDays");
__name22(isPostponedAtLeastDays, "isPostponedAtLeastDays");
async function creaAppuntamentoKeap(env, contactId, startISO, trattamenti) {
  const token = await getValidKeapToken(env);
  const endISO = calculateEndTime(startISO);
  const payload = {
    contact_id: contactId,
    title: `Appuntamento del ${toGiornoMeseAnno(startISO)}`,
    description: `Trattamento: ${trattamenti}
Fissato il: ${getTodayFormatted()}`,
    start_date: startISO,
    end_date: endISO,
    location: ""
  };
  const response = await fetch(CONFIG.KEAP.APPOINTMENTS, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const error2 = await response.text();
    throw new Error(`Errore creazione appuntamento: ${error2}`);
  }
  const data = await response.json();
  return data.id;
}
__name(creaAppuntamentoKeap, "creaAppuntamentoKeap");
__name2(creaAppuntamentoKeap, "creaAppuntamentoKeap");
__name22(creaAppuntamentoKeap, "creaAppuntamentoKeap");
async function aggiornaCustomFieldsAppuntamento(env, appointmentId, customFields) {
  const token = await getValidKeapToken(env);
  const xmlBody = `<?xml version="1.0"?>
<methodCall>
  <methodName>DataService.update</methodName>
  <params>
    <param><value><string>IGNORE</string></value></param>
    <param><value><string>ContactAction</string></value></param>
    <param><value><int>${appointmentId}</int></value></param>
    <param>
      <value>
        <struct>
          ${Object.entries(customFields).map(([k, v]) => `
            <member><name>${k}</name><value><string>${v}</string></value></member>`).join("")}
        </struct>
      </value>
    </param>
  </params>
</methodCall>`;
  const response = await fetch(CONFIG.KEAP.XMLRPC, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "text/xml"
    },
    body: xmlBody
  });
  const responseText = await response.text();
  if (responseText.includes("<fault>") || !responseText.includes("<param>")) {
    throw new Error(`Errore aggiornamento custom fields: ${responseText}`);
  }
  return true;
}
__name(aggiornaCustomFieldsAppuntamento, "aggiornaCustomFieldsAppuntamento");
__name2(aggiornaCustomFieldsAppuntamento, "aggiornaCustomFieldsAppuntamento");
__name22(aggiornaCustomFieldsAppuntamento, "aggiornaCustomFieldsAppuntamento");
async function fillAppointmentFields(env, contactId, numeroAppuntamento, appoData) {
  const token = await getValidKeapToken(env);
  const fields = CONFIG.APPOINTMENT_FIELDS[numeroAppuntamento];
  if (!fields) {
    throw new Error(`Numero appuntamento non valido: ${numeroAppuntamento}`);
  }
  const { data, ora } = appoData;
  const payload = {
    custom_fields: [
      { id: fields.trattamenti, content: appoData.trattamenti },
      { id: fields.data, content: data },
      { id: fields.ora, content: ora }
    ]
  };
  const response = await fetch(`${CONFIG.KEAP.CONTACTS}/${contactId}`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const error2 = await response.text();
    throw new Error(`Errore aggiornamento campi appuntamento: ${error2}`);
  }
  return await response.json();
}
__name(fillAppointmentFields, "fillAppointmentFields");
__name2(fillAppointmentFields, "fillAppointmentFields");
__name22(fillAppointmentFields, "fillAppointmentFields");
async function resetAppointmentSlot(env, contactId, numeroAppuntamento, dataRinvio, incasso, noMsg = false) {
  const token = await getValidKeapToken(env);
  const fields = CONFIG.APPOINTMENT_FIELDS[numeroAppuntamento];
  if (!fields) {
    throw new Error(`Numero appuntamento non valido: ${numeroAppuntamento}`);
  }
  try {
    const tagsToRemove = [];
    const baseTag = CONFIG.APPOINTMENT_TAGS[`A${numeroAppuntamento}`];
    if (baseTag) tagsToRemove.push(baseTag);
    const proskinTag = CONFIG.APPOINTMENT_TAGS.PROSKIN && CONFIG.APPOINTMENT_TAGS.PROSKIN[`A${numeroAppuntamento}`];
    if (proskinTag) tagsToRemove.push(proskinTag);
    const fusionTag = CONFIG.APPOINTMENT_TAGS.FUSION && CONFIG.APPOINTMENT_TAGS.FUSION[`A${numeroAppuntamento}`];
    if (fusionTag) tagsToRemove.push(fusionTag);
    if (tagsToRemove.length > 0) {
      await removeContactTags(env, contactId, tagsToRemove);
    }
  } catch (err) {
    console.error("Warning: errore durante rimozione tag appuntamento:", err);
  }
  const resetTags = [];
  const slotResetTags = CONFIG.APPOINTMENT_TAGS.RINVIO;
  resetTags.push(slotResetTags[`A${numeroAppuntamento}`]);
  if (noMsg) {
    resetTags.push(359);
  }
  if (resetTags.length > 0) {
    await applyResetTags(env, contactId, resetTags);
  }
  return true;
}
__name(resetAppointmentSlot, "resetAppointmentSlot");
__name2(resetAppointmentSlot, "resetAppointmentSlot");
__name22(resetAppointmentSlot, "resetAppointmentSlot");
async function applyResetTags(env, contactId, tagIds) {
  const token = await getValidKeapToken(env);
  const payload = {
    tagIds
  };
  const response = await fetch(`${CONFIG.KEAP.CONTACTS}/${contactId}/tags`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const error2 = await response.text();
    console.error(`Warning: Errore applicazione tag reset: ${error2}`);
  }
  return true;
}
__name(applyResetTags, "applyResetTags");
__name2(applyResetTags, "applyResetTags");
__name22(applyResetTags, "applyResetTags");
async function cancelAppointmentSlot(env, contactId, numeroAppuntamento, incasso) {
  const token = await getValidKeapToken(env);
  const fields = CONFIG.APPOINTMENT_FIELDS[numeroAppuntamento];
  if (!fields) {
    throw new Error(`Numero appuntamento non valido: ${numeroAppuntamento}`);
  }
  const cancelTags = CONFIG.APPOINTMENT_TAGS.CANCEL;
  await applyResetTags(env, contactId, [cancelTags[`A${numeroAppuntamento}`]]);
  try {
    const tagsToRemove = [];
    const baseTag = CONFIG.APPOINTMENT_TAGS[`A${numeroAppuntamento}`];
    if (baseTag) tagsToRemove.push(baseTag);
    const proskinTag = CONFIG.APPOINTMENT_TAGS.PROSKIN && CONFIG.APPOINTMENT_TAGS.PROSKIN[`A${numeroAppuntamento}`];
    if (proskinTag) tagsToRemove.push(proskinTag);
    const fusionTag = CONFIG.APPOINTMENT_TAGS.FUSION && CONFIG.APPOINTMENT_TAGS.FUSION[`A${numeroAppuntamento}`];
    if (fusionTag) tagsToRemove.push(fusionTag);
    if (tagsToRemove.length > 0) {
      await removeContactTags(env, contactId, tagsToRemove);
    }
  } catch (err) {
    console.error("Warning: errore durante rimozione tag su annulla:", err);
  }
  return true;
}
__name(cancelAppointmentSlot, "cancelAppointmentSlot");
__name2(cancelAppointmentSlot, "cancelAppointmentSlot");
__name22(cancelAppointmentSlot, "cancelAppointmentSlot");
async function getContactTags(env, contactId) {
  const token = await getValidKeapToken(env);
  const response = await fetch(`${CONFIG.KEAP.CONTACTS}/${contactId}/tags`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  if (!response.ok) {
    const error2 = await response.text();
    throw new Error(`Errore lettura tag: ${error2}`);
  }
  const data = await response.json();
  return data.tags ? data.tags.map((t) => t.tag.id) : [];
}
__name(getContactTags, "getContactTags");
__name2(getContactTags, "getContactTags");
__name22(getContactTags, "getContactTags");
async function setContactTags(env, contactId, tagIds) {
  const token = await getValidKeapToken(env);
  const payload = {
    tagIds
  };
  const response = await fetch(`${CONFIG.KEAP.CONTACTS}/${contactId}/tags`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const error2 = await response.text();
    throw new Error(`Errore applicazione tag: ${error2}`);
  }
  return await response.json();
}
__name(setContactTags, "setContactTags");
__name2(setContactTags, "setContactTags");
__name22(setContactTags, "setContactTags");
async function removeContactTags(env, contactId, tagIds) {
  const token = await getValidKeapToken(env);
  for (const tagId of tagIds) {
    try {
      const response = await fetch(`${CONFIG.KEAP.CONTACTS}/${contactId}/tags/${tagId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Warning: Errore rimozione tag ${tagId}: ${errorText}`);
      }
    } catch (err) {
      console.error(`Warning: Errore rimozione tag ${tagId}:`, err);
    }
  }
  try {
    const currentTags = await getContactTags(env, contactId);
    const stillPresent = tagIds.filter((t) => currentTags.includes(t));
    if (stillPresent.length > 0) {
      console.warn(`Warning: alcuni tag non sono stati rimossi per contact ${contactId}: ${stillPresent.join(", ")}`);
    } else {
      console.log(`Info: tutti i tag richiesti rimossi per contact ${contactId}: ${tagIds.join(", ")}`);
    }
  } catch (err) {
    console.error("Warning: errore durante verifica rimozione tag:", err);
  }
  return true;
}
__name(removeContactTags, "removeContactTags");
__name2(removeContactTags, "removeContactTags");
__name22(removeContactTags, "removeContactTags");
async function determineAppointmentNumber(env, contactId, trattamenti) {
  const tags = await getContactTags(env, contactId);
  let numeroAppuntamento;
  let newTags = [];
  if (!tags.includes(CONFIG.APPOINTMENT_TAGS.A1)) {
    numeroAppuntamento = 1;
    newTags.push(CONFIG.APPOINTMENT_TAGS.A1);
  } else if (!tags.includes(CONFIG.APPOINTMENT_TAGS.A2)) {
    numeroAppuntamento = 2;
    newTags.push(CONFIG.APPOINTMENT_TAGS.A2);
  } else if (!tags.includes(CONFIG.APPOINTMENT_TAGS.A3)) {
    numeroAppuntamento = 3;
    newTags.push(CONFIG.APPOINTMENT_TAGS.A3);
  } else if (!tags.includes(CONFIG.APPOINTMENT_TAGS.A4)) {
    numeroAppuntamento = 4;
    newTags.push(CONFIG.APPOINTMENT_TAGS.A4);
  } else if (!tags.includes(CONFIG.APPOINTMENT_TAGS.A5)) {
    numeroAppuntamento = 5;
    newTags.push(CONFIG.APPOINTMENT_TAGS.A5);
  } else {
    throw new Error("ha gi\xE0 5 appuntamenti, non puoi aggiungerne altri");
  }
  const trattamentiLower = trattamenti.toLowerCase();
  const isProskin = trattamentiLower.includes("proskin");
  const isFusion = CONFIG.TREATMENT_ZONES.some(
    (zone) => trattamentiLower.includes(zone.toLowerCase())
  );
  if (isProskin) {
    newTags.push(CONFIG.APPOINTMENT_TAGS.PROSKIN[`A${numeroAppuntamento}`]);
  }
  if (isFusion) {
    newTags.push(CONFIG.APPOINTMENT_TAGS.FUSION[`A${numeroAppuntamento}`]);
  }
  return {
    numeroAppuntamento,
    tags: newTags
  };
}
__name(determineAppointmentNumber, "determineAppointmentNumber");
__name2(determineAppointmentNumber, "determineAppointmentNumber");
__name22(determineAppointmentNumber, "determineAppointmentNumber");
async function handleAppointmentTags(env, contactId, trattamenti) {
  const result = await determineAppointmentNumber(env, contactId, trattamenti);
  if (result.tags.length > 0) {
    await setContactTags(env, contactId, result.tags);
  }
  return result;
}
__name(handleAppointmentTags, "handleAppointmentTags");
__name2(handleAppointmentTags, "handleAppointmentTags");
__name22(handleAppointmentTags, "handleAppointmentTags");
async function syncNextAppointment(env, contactId) {
  try {
    console.log("\u{1F4C5} syncNextAppointment: Fetching contact with appointment fields...");
    const token = await getValidKeapToken(env);
    const contactUrl = `${CONFIG.KEAP.CONTACTS}/${contactId}?fields=custom_fields`;
    const response = await fetch(contactUrl, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) {
      const error2 = await response.text();
      throw new Error(`Errore recupero contatto: ${error2}`);
    }
    const contact = await response.json();
    const customFields = contact.custom_fields || [];
    console.log(`\u{1F4E6} Custom fields recuperati da Keap:`, customFields.map((f) => ({ id: f.id, content: f.content })));
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    console.log(`\u{1F4C5} Oggi: ${today.toISOString()} (comparison time)`);
    let nextAppointment = null;
    let closestDate = null;
    for (const slotNum of [1, 2, 3, 4, 5]) {
      const fieldIds = CONFIG.APPOINTMENT_FIELDS[slotNum];
      if (!fieldIds) continue;
      console.log(`
\u{1F50E} Verificando Slot ${slotNum}:`);
      console.log(`   - Field IDs da cercare: data=${fieldIds.data}, ora=${fieldIds.ora}, trattamenti=${fieldIds.trattamenti}`);
      const dataField = customFields.find((f) => f.id === fieldIds.data);
      const oraField = customFields.find((f) => f.id === fieldIds.ora);
      const trattamentiField = customFields.find((f) => f.id === fieldIds.trattamenti);
      console.log(`   - dataField trovato: ${dataField ? `id=${dataField.id}, content="${dataField.content}"` : "NO"}`);
      console.log(`   - oraField trovato: ${oraField ? `id=${oraField.id}, content="${oraField.content}"` : "NO"}`);
      console.log(`   - trattamentiField trovato: ${trattamentiField ? `id=${trattamentiField.id}, content="${trattamentiField.content}"` : "NO"}`);
      if (!dataField || !dataField.content || dataField.content.trim() === "") {
        console.log(`   \u23ED\uFE0F Slot ${slotNum}: Nessuna data, salto`);
        continue;
      }
      const dataStr = dataField.content;
      console.log(`\u{1F4CB} Slot ${slotNum}: Data raw = "${dataStr}"`);
      let appointmentDate = null;
      if (/^\d{8}$/.test(dataStr)) {
        const year = parseInt(dataStr.substring(0, 4));
        const month = parseInt(dataStr.substring(4, 6));
        const day = parseInt(dataStr.substring(6, 8));
        appointmentDate = new Date(year, month - 1, day);
        console.log(`\u2705 Slot ${slotNum}: Formato YYYYMMDD riconosciuto \u2192 ${appointmentDate.toISOString()}`);
      } else if (/^\d{2}-\d{2}-\d{4}$/.test(dataStr)) {
        const parts = dataStr.split("-");
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);
        appointmentDate = new Date(year, month - 1, day);
        console.log(`\u2705 Slot ${slotNum}: Formato gg-mm-aaaa riconosciuto \u2192 ${appointmentDate.toISOString()}`);
      } else if (/^\d{4}-\d{2}-\d{2}$/.test(dataStr)) {
        const parts = dataStr.split("-");
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const day = parseInt(parts[2], 10);
        appointmentDate = new Date(year, month - 1, day);
        console.log(`\u2705 Slot ${slotNum}: Formato yyyy-mm-dd riconosciuto \u2192 ${appointmentDate.toISOString()}`);
      } else {
        console.warn(`\u26A0\uFE0F Slot ${slotNum}: Data in formato non riconosciuto: "${dataStr}"`);
        continue;
      }
      if (appointmentDate >= today && (!closestDate || appointmentDate < closestDate)) {
        console.log(`\u{1F50D} Slot ${slotNum}: Appuntamento \xE8 futuro (${appointmentDate.toISOString()} >= ${today.toISOString()})`);
        closestDate = appointmentDate;
        const dayStr = String(appointmentDate.getDate()).padStart(2, "0");
        const monthStr = String(appointmentDate.getMonth() + 1).padStart(2, "0");
        const yearStr = appointmentDate.getFullYear();
        const dateFormatted = `${yearStr}-${monthStr}-${dayStr}`;
        const time = oraField && oraField.content ? oraField.content : "N/D";
        const trattamenti = trattamentiField && trattamentiField.content ? trattamentiField.content : "N/D";
        nextAppointment = {
          data: dateFormatted,
          ora: time,
          trattamenti,
          slot: slotNum
        };
        console.log(`\u2705 Prossimo appuntamento trovato: Slot ${slotNum}, Data: ${dateFormatted}, Ora: ${time}, Trattamenti: ${trattamenti}`);
      } else if (appointmentDate < today) {
        console.log(`\u2139\uFE0F Slot ${slotNum}: Appuntamento nel passato (${appointmentDate.toISOString()} < ${today.toISOString()})`);
      }
    }
    if (!nextAppointment) {
      console.log(`\u2139\uFE0F Nessun appuntamento futuro trovato`);
    }
    return nextAppointment;
  } catch (error2) {
    console.error("\u274C syncNextAppointment: ERROR", error2.message);
    throw error2;
  }
}
__name(syncNextAppointment, "syncNextAppointment");
__name2(syncNextAppointment, "syncNextAppointment");
__name22(syncNextAppointment, "syncNextAppointment");
async function updateNextAppointmentFields(env, contactId, appointmentData) {
  try {
    const token = await getValidKeapToken(env);
    const payload = {
      custom_fields: []
    };
    if (appointmentData) {
      payload.custom_fields.push({
        id: CONFIG.CUSTOM_FIELDS.CONTACT.NEXT_APPOINTMENT_DATE,
        content: appointmentData.data
      });
      payload.custom_fields.push({
        id: CONFIG.CUSTOM_FIELDS.CONTACT.NEXT_APPOINTMENT_TIME,
        content: appointmentData.ora
      });
      payload.custom_fields.push({
        id: CONFIG.CUSTOM_FIELDS.CONTACT.NEXT_APPOINTMENT_TREATMENTS,
        content: appointmentData.trattamenti
      });
    } else {
      payload.custom_fields.push({
        id: CONFIG.CUSTOM_FIELDS.CONTACT.NEXT_APPOINTMENT_DATE,
        content: ""
      });
      payload.custom_fields.push({
        id: CONFIG.CUSTOM_FIELDS.CONTACT.NEXT_APPOINTMENT_TIME,
        content: ""
      });
      payload.custom_fields.push({
        id: CONFIG.CUSTOM_FIELDS.CONTACT.NEXT_APPOINTMENT_TREATMENTS,
        content: ""
      });
    }
    const response = await fetch(`${CONFIG.KEAP.CONTACTS}/${contactId}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      const error2 = await response.text();
      throw new Error(`Errore aggiornamento NextAppointment fields: ${error2}`);
    }
    return await response.json();
  } catch (error2) {
    console.error("\u274C updateNextAppointmentFields: ERROR", error2.message);
    throw error2;
  }
}
__name(updateNextAppointmentFields, "updateNextAppointmentFields");
__name2(updateNextAppointmentFields, "updateNextAppointmentFields");
__name22(updateNextAppointmentFields, "updateNextAppointmentFields");
var index_default = {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    };
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }
    try {
      const url = new URL(request.url);
      console.log("=== REQUEST DEBUG ===");
      console.log("Method:", request.method);
      console.log("URL:", request.url);
      console.log("Pathname:", url.pathname);
      console.log("Search params:", url.search);
      console.log("Headers:", Object.fromEntries(request.headers));
      console.log("====================");
      if (url.pathname === "/api/prebooking/apertura" && request.method === "POST") {
        console.log("\u2705 Matched: POST /api/prebooking/apertura");
        const result = await handleAperturaScheda(request, env);
        return jsonResponse(result, 200, corsHeaders);
      }
      if (url.pathname === "/api/prebooking/chiusura" && request.method === "POST") {
        console.log("\u2705 Matched: POST /api/prebooking/chiusura");
        const result = await handleChiusuraScheda(request, env);
        return jsonResponse(result, 200, corsHeaders);
      }
      if (url.pathname === "/api/prebooking/rinvio" && request.method === "POST") {
        console.log("\u2705 Matched: POST /api/prebooking/rinvio");
        const result = await handleRinvioAppuntamento(request, env);
        return jsonResponse(result, 200, corsHeaders);
      }
      if (url.pathname === "/api/prebooking/annulla" && request.method === "POST") {
        console.log("\u2705 Matched: POST /api/prebooking/annulla");
        const result = await handleAnnullaAppuntamento(request, env);
        return jsonResponse(result, 200, corsHeaders);
      }
      if (url.pathname === "/api/prebooking/sync-next-appointment" && request.method === "POST") {
        console.log("\u2705 Matched: POST /api/prebooking/sync-next-appointment");
        const result = await handleSyncNextAppointment(request, env);
        return jsonResponse(result, 200, corsHeaders);
      }
      if (url.pathname === "/api/apertura-scheda" && request.method === "POST") {
        console.log("\u26A0\uFE0F Matched: POST /api/apertura-scheda (deprecato, usa /api/prebooking/apertura)");
        const result = await handleAperturaScheda(request, env);
        return jsonResponse(result, 200, corsHeaders);
      }
      if (url.pathname === "/api/prebooking" && request.method === "POST") {
        console.log("\u26A0\uFE0F Matched: POST /api/prebooking (deprecato, usa /api/prebooking/apertura)");
        const result = await handleAperturaScheda(request, env);
        return jsonResponse(result, 200, corsHeaders);
      }
      if (url.pathname === "/health") {
        console.log("\u2705 Matched: GET /health");
        return jsonResponse({
          status: "ok",
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          pathname: url.pathname,
          method: request.method
        }, 200, corsHeaders);
      }
      if (url.pathname === "/api/logs" && request.method === "GET") {
        console.log("\u2705 Matched: GET /api/logs");
        const logsData = await getRecentLogs(env, url.searchParams);
        const filtered = filterLogs(logsData.logs, url.searchParams);
        return jsonResponse({
          total: filtered.length,
          logs: filtered
        }, 200, corsHeaders);
      }
      if (url.pathname.startsWith("/api/logs/") && request.method === "GET") {
        const logKey = url.pathname.split("/api/logs/")[1];
        console.log("\u2705 Matched: GET /api/logs/" + logKey);
        const log = await getLogByKey(env, logKey);
        if (log) {
          return jsonResponse(log, 200, corsHeaders);
        } else {
          return jsonResponse({ error: "Log non trovato" }, 404, corsHeaders);
        }
      }
      console.log("\u274C No route matched");
      console.log("Available routes:");
      console.log("  - POST /api/prebooking/apertura");
      console.log("  - POST /api/prebooking/chiusura");
      console.log("  - POST /api/prebooking/rinvio");
      console.log("  - POST /api/prebooking/annulla");
      console.log("  - POST /api/prebooking/sync-next-appointment");
      console.log("  - GET /api/logs");
      console.log("  - GET /health");
      return jsonResponse({
        error: "Endpoint non trovato",
        debug: {
          requestedPath: url.pathname,
          requestedMethod: request.method,
          availableEndpoints: [
            "POST /api/prebooking/apertura - Apertura Scheda",
            "POST /api/prebooking/chiusura - Chiusura Scheda",
            "POST /api/prebooking/rinvio - Rinvio Appuntamento",
            "POST /api/prebooking/annulla - Annulla Appuntamento",
            "POST /api/prebooking/sync-next-appointment - Sync Prossimo Appuntamento",
            "GET /api/logs - Lista log",
            "GET /api/logs/:key - Log specifico",
            "GET /health - Health check"
          ],
          deprecatedEndpoints: [
            "POST /api/apertura-scheda (usa /api/prebooking/apertura)",
            "POST /api/prebooking (usa /api/prebooking/apertura)"
          ]
        }
      }, 404, corsHeaders);
    } catch (error2) {
      console.error("\u274C Errore worker:", error2);
      console.error("Stack:", error2.stack);
      return jsonResponse({
        error: error2.message,
        stack: error2.stack,
        requestUrl: request.url
      }, 500, corsHeaders);
    }
  }
};
async function handleChiusuraScheda(request, env) {
  console.log("\u{1F512} handleChiusuraScheda: START");
  let data;
  try {
    data = await request.json();
    console.log("\u{1F4E6} Request data:", JSON.stringify(data, null, 2));
  } catch (error2) {
    console.error("\u274C Errore parsing JSON:", error2);
    const errorResult = {
      success: false,
      errors: ["Errore nel parsing del JSON: " + error2.message]
    };
    await logChiusura(request, {}, errorResult, env);
    return errorResult;
  }
  console.log("\u2705 Validazione input...");
  const validation = validateChiusuraRequest(data);
  if (!validation.valid) {
    console.error("\u274C Validazione fallita:", validation.errors);
    const errorResult = {
      success: false,
      errors: ["Errore nel parsing del JSON: " + error.message]
    };
    await logChiusura(request, {}, errorResult, env);
    return errorResult;
  }
  console.log("\u2705 Validazione OK");
  const { centro, cliente, presente, appuntamento, acquisto, prossimoAppuntamento } = data;
  const result = {
    success: true,
    presente,
    acquistoRegistrato: false,
    prossimoAppuntamentoRegistrato: false,
    tagApplicati: [],
    messages: []
  };
  try {
    console.log("\u{1F512} Gestione Chiusura Scheda...");
    console.log("   - Cliente Keap ID:", cliente.keapId);
    console.log("   - Presente:", presente);
    if (presente && appuntamento && appuntamento.keapId) {
      console.log("\u2705 Segno presenza appuntamento...");
      const customFields = {
        [CONFIG.CUSTOM_FIELDS.APPOINTMENT.PRESENTE]: "1"
      };
      await aggiornaCustomFieldsAppuntamento(env, appuntamento.keapId, customFields);
      result.messages.push("\u2705 Presenza registrata");
    }
    if (acquisto && acquisto.totale && acquisto.totale > 0) {
      console.log("\u{1F4B0} Registro acquisto...");
      console.log("   - Totale:", acquisto.totale);
      const orderId = await registraOrdineKeap(env, cliente.keapId, acquisto);
      if (orderId) {
        result.acquistoRegistrato = true;
        result.ordineKeapId = orderId;
        result.messages.push("\u2705 Acquisto registrato su Keap");
      }
    }
    if (prossimoAppuntamento) {
      console.log("\u{1F4C5} Registro prossimo appuntamento...");
      console.log("   - Data/Ora:", prossimoAppuntamento.dataEOra);
      console.log("   - Trattamenti:", prossimoAppuntamento.trattamenti);
      try {
        const dataRoma = convertiInRomaSeUTC(prossimoAppuntamento.dataEOra);
        const [data2, ora] = estraiDataEOra(dataRoma);
        const appointmentId = await creaAppuntamentoKeap(
          env,
          cliente.keapId,
          dataRoma,
          prossimoAppuntamento.trattamenti
        );
        console.log("\u2705 Appuntamento creato su Keap, ID:", appointmentId);
        const appoCustomFields = {
          [CONFIG.CUSTOM_FIELDS.APPOINTMENT.TRATTAMENTI]: prossimoAppuntamento.trattamenti,
          [CONFIG.CUSTOM_FIELDS.APPOINTMENT.NOTE]: `Appuntamento fissato il ${getTodayFormatted()}`
        };
        await aggiornaCustomFieldsAppuntamento(env, appointmentId, appoCustomFields);
        const tagResult = await handleAppointmentTags(env, cliente.keapId, prossimoAppuntamento.trattamenti);
        console.log("\u2705 Tag applicati, numero appuntamento:", tagResult.numeroAppuntamento);
        let valoreAppuntamento = prossimoAppuntamento.incassoPrevisto || 0;
        if (prossimoAppuntamento.promozione && prossimoAppuntamento.prezzoPromo) {
          valoreAppuntamento = prossimoAppuntamento.prezzoPromo;
        }
        await fillAppointmentFields(env, cliente.keapId, tagResult.numeroAppuntamento, {
          dataEOra: dataRoma,
          trattamenti: prossimoAppuntamento.trattamenti,
          presente: 0,
          rinviato: 0,
          annullato: 0,
          data: data2,
          ora,
          valore: valoreAppuntamento,
          dataRinvio: ""
        });
        result.prossimoAppuntamentoRegistrato = true;
        result.prossimoAppuntamento = {
          keapId: appointmentId,
          numeroAppuntamento: tagResult.numeroAppuntamento,
          dataEOra: dataRoma,
          trattamenti: prossimoAppuntamento.trattamenti,
          incassoPrevisto: valoreAppuntamento
        };
        result.tagApplicati.push(...tagResult.tags);
        result.messages.push("\u2705 Prossimo appuntamento registrato");
      } catch (appoError) {
        console.error("\u274C Errore registrazione prossimo appuntamento:", appoError.message);
        result.messages.push("\u26A0\uFE0F Errore registrazione prossimo appuntamento: " + appoError.message);
      }
    }
    console.log("\u{1F3F7}\uFE0F Applico tag recensione...");
    await applicaTagRecensione(env, cliente.keapId);
    result.tagApplicati.push(297);
    result.messages.push("\u2705 Tag recensione applicato");
    if (acquisto && acquisto.totale && acquisto.totale > 0) {
      console.log("\u{1F4F2} Invio notifica acquisto...");
      try {
        const notificationPayload = formatChiusuraNotification({
          centro,
          cliente: [cliente.nome, cliente.cognome].join(" ") || cliente,
          acquisto
        });
        if (notificationPayload) {
          const notificationSent = await sendPushoverNotification(env, notificationPayload);
          if (notificationSent) {
            result.messages.push("\u2705 Notifica inviata");
          } else {
            result.messages.push("\u26A0\uFE0F Notifica non inviata (configurazione mancante o errore)");
          }
        }
      } catch (notifError) {
        console.error("\u274C Errore invio notifica:", notifError.message);
        result.messages.push("\u26A0\uFE0F Errore invio notifica: " + notifError.message);
      }
    } else {
      console.log("\u2139\uFE0F Nessun acquisto - notifica non inviata");
    }
    console.log("\u2705 handleChiusuraScheda: SUCCESS");
    console.log("\u{1F4E4} Result:", JSON.stringify(result, null, 2));
    await logChiusura(request, data, result, env);
    if (result.success && data.cliente?.keapId) {
      console.log("\u{1F4F4} Triggering fire-and-forget sync...");
      syncNextAppointment(env, data.cliente.keapId).then(() => {
        console.log("\u2705 Fire-and-forget sync completed");
      }).catch((err) => {
        console.error("\u26A0\uFE0F Fire-and-forget sync error:", err.message);
      });
    }
    return result;
  } catch (error2) {
    console.error("\u274C handleChiusuraScheda: ERROR");
    console.error("Error message:", error2.message);
    console.error("Error stack:", error2.stack);
    const errorResult = {
      success: false,
      errors: ["Errore nel parsing del JSON: " + error2.message],
      stack: error2.stack
    };
    await logChiusura(request, data, result, env);
    return errorResult;
  }
}
__name(handleChiusuraScheda, "handleChiusuraScheda");
__name2(handleChiusuraScheda, "handleChiusuraScheda");
__name22(handleChiusuraScheda, "handleChiusuraScheda");
async function registraOrdineKeap(env, contactId, acquisto) {
  const token = await getValidKeapToken(env);
  const items = [];
  if (acquisto.prodotti && acquisto.prodotti.length > 0) {
    for (const prodotto of acquisto.prodotti) {
      items.push({
        description: prodotto.nome || prodotto,
        item_type: "PRODUCT",
        price: prodotto.prezzo || 0,
        quantity: prodotto.quantita || 1
      });
    }
  }
  if (acquisto.trattamenti && acquisto.trattamenti.length > 0) {
    for (const trattamento of acquisto.trattamenti) {
      items.push({
        description: trattamento.nome || trattamento,
        item_type: "SERVICE",
        price: trattamento.prezzo || 0,
        quantity: 1
      });
    }
  }
  if (items.length === 0) {
    items.push({
      description: "Acquisto",
      item_type: "SERVICE",
      price: acquisto.totale,
      quantity: 1
    });
  }
  const nowISO = (/* @__PURE__ */ new Date()).toISOString();
  const payload = {
    contact_id: Number(contactId),
    order_date: nowISO,
    order_title: `Ordine del ${toGiornoMeseAnno(nowISO)}`,
    order_type: "Offline",
    order_items: items
  };
  const response = await fetch("https://api.infusionsoft.com/crm/rest/v1/orders", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const error2 = await response.text();
    console.error("\u274C Errore creazione ordine:", error2);
    return null;
  }
  const result = await response.json();
  console.log("\u2705 Ordine creato, ID:", result.id);
  return result.id;
}
__name(registraOrdineKeap, "registraOrdineKeap");
__name2(registraOrdineKeap, "registraOrdineKeap");
__name22(registraOrdineKeap, "registraOrdineKeap");
async function applicaTagRecensione(env, contactId) {
  const token = await getValidKeapToken(env);
  const payload = {
    tagIds: [297]
    // Tag recensione
  };
  const response = await fetch(`${CONFIG.KEAP.CONTACTS}/${contactId}/tags`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const error2 = await response.text();
    console.error("Warning: Errore applicazione tag recensione:", error2);
  }
  return true;
}
__name(applicaTagRecensione, "applicaTagRecensione");
__name2(applicaTagRecensione, "applicaTagRecensione");
__name22(applicaTagRecensione, "applicaTagRecensione");
async function handleAnnullaAppuntamento(request, env) {
  console.log("\u274C handleAnnullaAppuntamento: START");
  let data;
  try {
    data = await request.json();
    console.log("\u{1F4E6} Request data:", JSON.stringify(data, null, 2));
  } catch (error2) {
    console.error("\u274C Errore parsing JSON:", error2);
    const errorResult = {
      success: false,
      errors: ["Errore nel parsing del JSON: " + error2.message]
    };
    await logAnnullaAppuntamento(request, {}, errorResult, env);
    return errorResult;
  }
  console.log("\u2705 Validazione input...");
  const validation = validateAnnullaRequest(data);
  if (!validation.valid) {
    console.error("\u274C Validazione fallita:", validation.errors);
    const errorResult = {
      success: false,
      errors: validation.errors
    };
    await logAnnullaAppuntamento(request, data, errorResult, env);
    return errorResult;
  }
  console.log("\u2705 Validazione OK");
  const { centro, cliente, appuntamento } = data;
  const result = {
    success: true,
    appuntamento: null,
    tagApplicati: [],
    messages: []
  };
  try {
    console.log("\u274C Gestione Annulla Appuntamento...");
    console.log("   - Cliente Keap ID:", cliente.keapId);
    console.log("   - Appuntamento Keap ID:", appuntamento.keapId);
    console.log("   - Numero Appuntamento:", appuntamento.numeroAppuntamento);
    console.log("\u{1F4DD} Segno appuntamento come annullato...");
    const customFields = {
      [CONFIG.CUSTOM_FIELDS.APPOINTMENT.ANNULLATO]: "1",
      [CONFIG.CUSTOM_FIELDS.APPOINTMENT.PRESENTE]: "0",
      [CONFIG.CUSTOM_FIELDS.APPOINTMENT.RINVIATO]: "0"
    };
    await aggiornaCustomFieldsAppuntamento(env, appuntamento.keapId, customFields);
    result.messages.push("\u2705 Appuntamento segnato come annullato");
    console.log("\u{1F504} Annullo slot appuntamento...");
    await cancelAppointmentSlot(
      env,
      cliente.keapId,
      appuntamento.numeroAppuntamento,
      appuntamento.incassoPrevisto || 0
    );
    const cancelTags = {
      1: 291,
      2: 293,
      3: 295
    };
    result.tagApplicati = [cancelTags[appuntamento.numeroAppuntamento]];
    result.messages.push("\u2705 Slot appuntamento annullato");
    result.appuntamento = {
      airtableId: appuntamento.id,
      keapId: appuntamento.keapId,
      numeroAppuntamento: appuntamento.numeroAppuntamento,
      annullato: true
    };
    console.log("\u{1F4F2} Invio notifica Pushover...");
    try {
      const notificationPayload = formatAnnullaNotification({
        centro,
        cliente: cliente.nome || cliente,
        appuntamento,
        motivazione: data.motivazione
      });
      const notificationSent = await sendPushoverNotification(env, notificationPayload);
      if (notificationSent) {
        result.messages.push("\u2705 Notifica inviata");
      } else {
        result.messages.push("\u26A0\uFE0F Notifica non inviata (configurazione mancante o errore)");
      }
    } catch (notifError) {
      console.error("\u274C Errore invio notifica:", notifError.message);
      result.messages.push("\u26A0\uFE0F Errore invio notifica: " + notifError.message);
    }
    console.log("\u2705 handleAnnullaAppuntamento: SUCCESS");
    console.log("\u{1F4E4} Result:", JSON.stringify(result, null, 2));
    await logAnnullaAppuntamento(request, data, result, env);
    if (result.success && data.cliente?.keapId) {
      console.log("\u{1F4F4} Triggering fire-and-forget sync...");
      syncNextAppointment(env, data.cliente.keapId).then(() => {
        console.log("\u2705 Fire-and-forget sync completed");
      }).catch((err) => {
        console.error("\u26A0\uFE0F Fire-and-forget sync error:", err.message);
      });
    }
    return result;
  } catch (error2) {
    console.error("\u274C handleAnnullaAppuntamento: ERROR");
    console.error("Error message:", error2.message);
    console.error("Error stack:", error2.stack);
    const errorResult = {
      success: false,
      error: error2.message,
      stack: error2.stack
    };
    await logAnnullaAppuntamento(request, data, errorResult, env);
    return errorResult;
  }
}
__name(handleAnnullaAppuntamento, "handleAnnullaAppuntamento");
__name2(handleAnnullaAppuntamento, "handleAnnullaAppuntamento");
__name22(handleAnnullaAppuntamento, "handleAnnullaAppuntamento");
async function handleRinvioAppuntamento(request, env) {
  console.log("\u{1F4C5} handleRinvioAppuntamento: START");
  let data;
  try {
    data = await request.json();
    console.log("\u{1F4E6} Request data:", JSON.stringify(data, null, 2));
  } catch (error2) {
    console.error("\u274C Errore parsing JSON:", error2);
    const errorResult = {
      success: false,
      errors: ["Errore nel parsing del JSON: " + error2.message]
    };
    await logRinvioAppuntamento(request, {}, errorResult, env);
    return errorResult;
  }
  console.log("\u2705 Validazione input...");
  const validation = validateRinvioRequest(data);
  if (!validation.valid) {
    console.error("\u274C Validazione fallita:", validation.errors);
    const errorResult = {
      success: false,
      errors: validation.errors
    };
    await logRinvioAppuntamento(request, data, errorResult, env);
    return errorResult;
  }
  console.log("\u2705 Validazione OK");
  const { centro, cliente, appuntamento, rinvio } = data;
  const result = {
    success: true,
    appuntamentoVecchio: null,
    appuntamentoNuovo: null,
    tagApplicati: [],
    messages: []
  };
  try {
    console.log("\u{1F4C5} Gestione Rinvio Appuntamento...");
    console.log("   - Cliente Keap ID:", cliente.keapId);
    console.log("   - Appuntamento Keap ID:", appuntamento.keapId);
    console.log("   - Numero Appuntamento:", appuntamento.numeroAppuntamento);
    console.log("   - Data Vecchia:", appuntamento.dataVecchia);
    console.log("   - Nuova Data:", rinvio.nuovaDataEOra);
    const dataVecchiaISO = convertiInRomaSeUTC(appuntamento.dataVecchia);
    const nuovaDataISO = convertiInRomaSeUTC(rinvio.nuovaDataEOra);
    console.log("   - Data vecchia convertita:", dataVecchiaISO);
    console.log("   - Nuova data convertita:", nuovaDataISO);
    const noMsg = !isPostponedAtLeastDays(dataVecchiaISO, nuovaDataISO, 5) || rinvio.noMessaggio;
    console.log("   - Messaggio cliente:", noMsg ? "NO" : "S\xCC");
    console.log("\u{1F4DD} Segno vecchio appuntamento come rinviato...");
    const customFieldsVecchio = {
      [CONFIG.CUSTOM_FIELDS.APPOINTMENT.DATA_RINVIO]: `Rinviato Al: ${toGiornoMeseAnno(nuovaDataISO)}`,
      [CONFIG.CUSTOM_FIELDS.APPOINTMENT.ANNULLATO]: "0",
      [CONFIG.CUSTOM_FIELDS.APPOINTMENT.PRESENTE]: "0",
      [CONFIG.CUSTOM_FIELDS.APPOINTMENT.RINVIATO]: "1"
    };
    await aggiornaCustomFieldsAppuntamento(env, appuntamento.keapId, customFieldsVecchio);
    result.messages.push("\u2705 Vecchio appuntamento segnato come rinviato");
    console.log("\u{1F504} Reset slot appuntamento...");
    await resetAppointmentSlot(
      env,
      cliente.keapId,
      appuntamento.numeroAppuntamento,
      nuovaDataISO,
      appuntamento.incassoPrevisto || 0,
      noMsg
    );
    result.messages.push("\u2705 Slot appuntamento resettato");
    console.log("\u2795 Creo nuovo appuntamento...");
    const endISO = calculateEndTime(nuovaDataISO);
    const nuovoApptKeapId = await creaAppuntamentoKeap(
      env,
      cliente.keapId,
      nuovaDataISO,
      appuntamento.trattamenti
    );
    console.log("   - Nuovo Keap ID:", nuovoApptKeapId);
    const customFieldsNuovo = {
      [CONFIG.CUSTOM_FIELDS.APPOINTMENT.TRATTAMENTI]: appuntamento.trattamenti,
      [CONFIG.CUSTOM_FIELDS.APPOINTMENT.NOTE]: `Appuntamento rimandato dal ${toGiornoMeseAnno(dataVecchiaISO)}`
    };
    await aggiornaCustomFieldsAppuntamento(env, nuovoApptKeapId, customFieldsNuovo);
    console.log("\u{1F3F7}\uFE0F Gestione tag...");
    const tagResult = await handleAppointmentTags(env, cliente.keapId, appuntamento.trattamenti);
    console.log("   - Numero appuntamento assegnato:", tagResult.numeroAppuntamento);
    console.log("   - Tag applicati:", tagResult.tags);
    result.tagApplicati = tagResult.tags;
    console.log("\u{1F4CA} Aggiorno campi appuntamento sul contatto...");
    const [date, ora] = estraiDataEOra(nuovaDataISO);
    await fillAppointmentFields(env, cliente.keapId, tagResult.numeroAppuntamento, {
      dataEOra: nuovaDataISO,
      trattamenti: appuntamento.trattamenti,
      data: date,
      ora,
      valore: appuntamento.incassoPrevisto || 0,
      presente: 0,
      rinviato: 0,
      annullato: 0
    });
    result.messages.push("\u2705 Nuovo appuntamento creato");
    result.appuntamentoVecchio = {
      airtableId: appuntamento.id,
      keapId: appuntamento.keapId,
      dataVecchia: appuntamento.dataVecchia,
      rinviato: true
    };
    result.appuntamentoNuovo = {
      keapId: nuovoApptKeapId,
      nuovaData: rinvio.nuovaDataEOra,
      numeroAppuntamento: tagResult.numeroAppuntamento
    };
    console.log("\u{1F4F2} Invio notifica Pushover...");
    try {
      const notificationPayload = formatRinvioNotification({
        centro,
        cliente: cliente.nome || cliente,
        appuntamento,
        rinvio,
        motivazione: data.motivazione
      });
      const notificationSent = await sendPushoverNotification(env, notificationPayload);
      if (notificationSent) {
        result.messages.push("\u2705 Notifica inviata");
      } else {
        result.messages.push("\u26A0\uFE0F Notifica non inviata (configurazione mancante o errore)");
      }
    } catch (notifError) {
      console.error("\u274C Errore invio notifica:", notifError.message);
      result.messages.push("\u26A0\uFE0F Errore invio notifica: " + notifError.message);
    }
    console.log("\u2705 handleRinvioAppuntamento: SUCCESS");
    console.log("\u{1F4E4} Result:", JSON.stringify(result, null, 2));
    await logRinvioAppuntamento(request, data, result, env);
    if (result.success && data.cliente?.keapId) {
      console.log("\u{1F4F4} Triggering fire-and-forget sync...");
      syncNextAppointment(env, data.cliente.keapId).then(() => {
        console.log("\u2705 Fire-and-forget sync completed");
      }).catch((err) => {
        console.error("\u26A0\uFE0F Fire-and-forget sync error:", err.message);
      });
    }
    return result;
  } catch (error2) {
    console.error("\u274C handleRinvioAppuntamento: ERROR");
    console.error("Error message:", error2.message);
    console.error("Error stack:", error2.stack);
    const errorResult = {
      success: false,
      error: error2.message,
      stack: error2.stack
    };
    await logRinvioAppuntamento(request, data, errorResult, env);
    return errorResult;
  }
}
__name(handleRinvioAppuntamento, "handleRinvioAppuntamento");
__name2(handleRinvioAppuntamento, "handleRinvioAppuntamento");
__name22(handleRinvioAppuntamento, "handleRinvioAppuntamento");
async function handleSyncNextAppointment(request, env) {
  console.log("\u{1F680} handleSyncNextAppointment: START");
  let data;
  try {
    data = await request.json();
    console.log("\u{1F4E6} Request data:", JSON.stringify(data, null, 2));
  } catch (error2) {
    console.error("\u274C Errore parsing JSON:", error2);
    const errorResult = {
      success: false,
      errors: ["Errore nel parsing del JSON: " + error2.message]
    };
    await logSyncNextAppointment(request, {}, errorResult, env);
    return errorResult;
  }
  console.log("\u2705 Validazione input...");
  const validation = validateSyncNextAppointmentRequest(data);
  if (!validation.valid) {
    console.error("\u274C Validazione fallita:", validation.errors);
    const errorResult = {
      success: false,
      errors: validation.errors
    };
    await logSyncNextAppointment(request, data, errorResult, env);
    return errorResult;
  }
  console.log("\u2705 Validazione OK");
  const { cliente } = data;
  const result = {
    success: false,
    nextAppointment: null,
    messages: []
  };
  try {
    console.log("\u{1F50D} Recupero prossimo appuntamento...");
    const appointmentData = await syncNextAppointment(env, cliente.keapId);
    if (appointmentData) {
      console.log("\u{1F4CA} Aggiorno campi NextAppointment...");
      await updateNextAppointmentFields(env, cliente.keapId, appointmentData);
      result.nextAppointment = appointmentData;
      result.messages.push("\u2705 Prossimo appuntamento aggiornato");
    } else {
      console.log("\u2139\uFE0F Nessun appuntamento futuro trovato");
      await updateNextAppointmentFields(env, cliente.keapId, null);
      result.messages.push("\u2139\uFE0F Nessun appuntamento futuro");
    }
    result.success = true;
    console.log("\u2705 handleSyncNextAppointment: SUCCESS");
    await logSyncNextAppointment(request, data, result, env);
    return result;
  } catch (error2) {
    console.error("\u274C handleSyncNextAppointment: ERROR");
    console.error("Error message:", error2.message);
    console.error("Error stack:", error2.stack);
    const errorResult = {
      success: false,
      errors: [error2.message],
      nextAppointment: null
    };
    await logSyncNextAppointment(request, data, errorResult, env);
    return errorResult;
  }
}
__name(handleSyncNextAppointment, "handleSyncNextAppointment");
__name2(handleSyncNextAppointment, "handleSyncNextAppointment");
__name22(handleSyncNextAppointment, "handleSyncNextAppointment");
async function handleAperturaScheda(request, env) {
  console.log("\u{1F680} handleAperturaScheda: START");
  let data;
  try {
    data = await request.json();
    console.log("\u{1F4E6} Request data:", JSON.stringify(data, null, 2));
  } catch (error2) {
    console.error("\u274C Errore parsing JSON:", error2);
    const errorResult = {
      success: false,
      errors: ["Errore nel parsing del JSON: " + error2.message]
    };
    await logAperturaScheda(request, {}, errorResult, env);
    return errorResult;
  }
  console.log("\u2705 Validazione input...");
  const validation = validatePrebookingRequest(data);
  if (!validation.valid) {
    console.error("\u274C Validazione fallita:", validation.errors);
    const errorResult = {
      success: false,
      errors: validation.errors
    };
    await logAperturaScheda(request, data, errorResult, env);
    return errorResult;
  }
  console.log("\u2705 Validazione OK");
  const { centro, cliente, appuntamento, prebooking } = data;
  const result = {
    success: true,
    cliente: null,
    appuntamento: null,
    numeroAppuntamento: null,
    tagApplicati: [],
    // NUOVO: traccia tag applicati
    messages: []
  };
  try {
    console.log("\u{1F464} Gestione Cliente...");
    console.log("   - Centro:", centro);
    console.log("   - Cliente ID:", cliente.id);
    console.log("   - Keap ID esistente:", cliente.keapId);
    let customerKeapID = cliente.keapId;
    if (!customerKeapID) {
      console.log("\u{1F50D} Cerco cliente esistente su Keap...");
      let keapContact = await cercaContattoKeap(env, cliente, centro);
      if (!keapContact) {
        console.log("\u2795 Cliente non trovato, creo nuovo...");
        keapContact = await creaContattoKeap(env, cliente, centro);
        result.messages.push("\u2705 Nuovo cliente creato");
      } else {
        console.log("\u2705 Cliente trovato su Keap:", keapContact.id);
        result.messages.push("\u2705 Cliente trovato su CRM");
      }
      customerKeapID = keapContact.id;
      result.cliente = {
        airtableId: cliente.id,
        keapId: customerKeapID,
        email: keapContact.email,
        telefono: keapContact.telefono
      };
    } else {
      console.log("\u2705 Cliente gi\xE0 ha Keap ID:", customerKeapID);
      result.messages.push("\u2705 Cliente gi\xE0 esistente");
      result.cliente = {
        airtableId: cliente.id,
        keapId: customerKeapID
      };
    }
    if (appuntamento && appuntamento.dataEOra && appuntamento.trattamenti) {
      console.log("\u{1F4C5} Gestione Appuntamento...");
      console.log("   - Data:", appuntamento.dataEOra);
      console.log("   - Trattamenti:", appuntamento.trattamenti);
      let appuntamentoKeapID = appuntamento.keapId;
      if (!appuntamentoKeapID) {
        console.log("\u2795 Creo nuovo appuntamento su Keap...");
        const startISO = convertiInRomaSeUTC(appuntamento.dataEOra);
        console.log("   - Data convertita:", startISO);
        const trattamenti = appuntamento.trattamenti;
        appuntamentoKeapID = await creaAppuntamentoKeap(
          env,
          customerKeapID,
          startISO,
          trattamenti
        );
        console.log("\u2705 Appuntamento creato, ID:", appuntamentoKeapID);
        const customFields = {
          [CONFIG.CUSTOM_FIELDS.APPOINTMENT.TRATTAMENTI]: trattamenti,
          [CONFIG.CUSTOM_FIELDS.APPOINTMENT.NOTE]: `Appuntamento fissato il ${getTodayFormatted()}`
        };
        console.log("\u{1F4DD} Aggiorno custom fields...");
        await aggiornaCustomFieldsAppuntamento(env, appuntamentoKeapID, customFields);
        console.log("\u{1F3F7}\uFE0F Gestione tag...");
        const tagResult = await handleAppointmentTags(env, customerKeapID, trattamenti);
        console.log("   - Numero appuntamento:", tagResult.numeroAppuntamento);
        console.log("   - Tag applicati:", tagResult.tags);
        result.numeroAppuntamento = tagResult.numeroAppuntamento;
        result.tagApplicati = tagResult.tags;
        console.log("\u{1F4CA} Aggiorno campi appuntamento sul contatto...");
        const [data2, ora] = estraiDataEOra(startISO);
        await fillAppointmentFields(env, customerKeapID, tagResult.numeroAppuntamento, {
          dataEOra: startISO,
          trattamenti,
          data: data2,
          ora,
          valore: appuntamento.incassoPrevisto || 0,
          presente: 0,
          rinviato: 0,
          annullato: 0
        });
        result.messages.push("\u2705 Nuovo appuntamento creato");
      } else {
        console.log("\u2705 Appuntamento gi\xE0 esistente:", appuntamentoKeapID);
        result.messages.push("\u2705 Appuntamento gi\xE0 esistente");
      }
      result.appuntamento = {
        airtableId: appuntamento.id,
        keapId: appuntamentoKeapID,
        incassoPrevisto: appuntamento.incassoPrevisto
      };
    } else {
      console.log("\u2139\uFE0F Nessun appuntamento da creare");
      result.messages.push("\u2139\uFE0F Nessun appuntamento da creare");
    }
    console.log("\u2705 handleAperturaScheda: SUCCESS");
    console.log("\u{1F4E4} Result:", JSON.stringify(result, null, 2));
    await logAperturaScheda(request, data, result, env);
    if (result.success && result.cliente?.keapId) {
      console.log("\u{1F4F4} Triggering fire-and-forget sync...");
      syncNextAppointment(env, result.cliente.keapId).then(() => {
        console.log("\u2705 Fire-and-forget sync completed");
      }).catch((err) => {
        console.error("\u26A0\uFE0F Fire-and-forget sync error:", err.message);
      });
    }
    return result;
  } catch (error2) {
    console.error("\u274C handleAperturaScheda: ERROR");
    console.error("Error message:", error2.message);
    console.error("Error stack:", error2.stack);
    const errorResult = {
      success: false,
      error: error2.message,
      stack: error2.stack
    };
    await logAperturaScheda(request, data, errorResult, env);
    return errorResult;
  }
}
__name(handleAperturaScheda, "handleAperturaScheda");
__name2(handleAperturaScheda, "handleAperturaScheda");
__name22(handleAperturaScheda, "handleAperturaScheda");
function jsonResponse(data, status = 200, additionalHeaders = {}) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...additionalHeaders
    }
  });
}
__name(jsonResponse, "jsonResponse");
__name2(jsonResponse, "jsonResponse");
__name22(jsonResponse, "jsonResponse");
async function getRecentLogs(env, searchParams) {
  if (!env.LOGS_KV) {
    return {
      error: "KV storage per log non configurato",
      help: "Configura LOGS_KV namespace in wrangler.jsonc"
    };
  }
  try {
    const prefix = searchParams.get("prefix") || "log_";
    const userLimit = searchParams.get("limit");
    const limit = userLimit ? parseInt(userLimit) : null;
    let logs = [];
    let cursor = null;
    let canContinue = true;
    while (canContinue) {
      const list = await env.LOGS_KV.list({
        prefix,
        limit: 1e3,
        // massimo consentito da KV
        cursor
      });
      const batch = await Promise.all(
        list.keys.map(async (key) => {
          const value = await env.LOGS_KV.get(key.name);
          return {
            key: key.name,
            data: value ? JSON.parse(value) : null
          };
        })
      );
      logs.push(...batch.filter((l) => l.data));
      if (limit && logs.length >= limit) {
        logs = logs.slice(0, limit);
        break;
      }
      if (list.list_complete === false && list.cursor) {
        cursor = list.cursor;
      } else {
        canContinue = false;
      }
    }
    return {
      total: logs.length,
      logs
    };
  } catch (error2) {
    return {
      error: "Errore recupero log",
      message: error2.message
    };
  }
}
__name(getRecentLogs, "getRecentLogs");
__name2(getRecentLogs, "getRecentLogs");
__name22(getRecentLogs, "getRecentLogs");
function filterLogs(logs, params) {
  return logs.filter((entry) => {
    const log = entry.data;
    if (!log) return false;
    if (params.get("centro") && log.centro !== params.get("centro")) {
      return false;
    }
    if (params.get("tipo") && log.operazione !== params.get("tipo")) {
      return false;
    }
    if (params.get("cliente")) {
      const search = params.get("cliente").toLowerCase();
      const full = log.cliente?.nomeCompleto?.toLowerCase() || "";
      const phone = log.cliente?.telefono?.toLowerCase() || "";
      if (!full.includes(search) && !phone.includes(search)) {
        return false;
      }
    }
    if (params.get("da")) {
      const from = new Date(params.get("da"));
      const logDate = new Date(log.timestamp);
      if (logDate < from) return false;
    }
    if (params.get("a")) {
      const to = new Date(params.get("a"));
      const logDate = new Date(log.timestamp);
      if (logDate > to) return false;
    }
    return true;
  });
}
__name(filterLogs, "filterLogs");
__name2(filterLogs, "filterLogs");
__name22(filterLogs, "filterLogs");
async function getLogByKey(env, key) {
  if (!env.LOGS_KV) {
    return null;
  }
  try {
    const value = await env.LOGS_KV.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error2) {
    console.error("Errore recupero log:", error2);
    return null;
  }
}
__name(getLogByKey, "getLogByKey");
__name2(getLogByKey, "getLogByKey");
__name22(getLogByKey, "getLogByKey");
export {
  index_default as default
};
//# sourceMappingURL=index.js.map

--3ba1c458086ae34c4fc9cf34aa510c282aace96ce6d9087d15f440e92e81--
