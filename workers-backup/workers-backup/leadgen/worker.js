--ee728cdef86d3c6d19539ec9562f4a9f63edd12c0909da8475d067bcd92d
Content-Disposition: form-data; name="index.js"

var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/index.js
var __defProp2 = Object.defineProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
var index_default = {
  async fetch(req, env, ctx) {
    const { pathname } = new URL(req.url);
    if (pathname === "/moduli") return handleModuli(req, env, ctx);
    if (pathname === "/form") return handleForm(req, env, ctx);
    return new Response("Not found", { status: 404 });
  }
};
async function handleModuli(req, env, ctx) {
  const url = new URL(req.url);
  const traceId = crypto.randomUUID();
  console.log("hit", { route: "/moduli", method: req.method, traceId, ua: req.headers.get("user-agent") });
  if (req.method === "GET" && url.searchParams.get("hub.mode") === "subscribe") {
    const token = url.searchParams.get("hub.verify_token") || "";
    const challenge = url.searchParams.get("hub.challenge") || "";
    const ok = token === env.VERIFY_TOKEN && !!challenge;
    console.log("challenge", { traceId, ok });
    return ok ? new Response(challenge, { status: 200, headers: { "Content-Type": "text/plain" } }) : new Response("Invalid verify token", { status: 403 });
  }
  if (req.method === "POST") {
    const raw = await req.text();
    const sig = req.headers.get("x-hub-signature-256") || "";
    const disable = String(env.DISABLE_SIGNATURE || "").toLowerCase() === "true";
    const okSig = disable ? true : await verifyMetaSignature(raw, sig, env.APP_SECRET);
    console.log("signature", { traceId, okSig, disabled: disable, bodyLen: raw.length });
    if (!okSig) return new Response("Bad signature", { status: 403, headers: { "X-Trace-Id": traceId } });
    ctx.waitUntil(handleLead(raw, env, traceId));
    return Response.json({ ok: true, traceId });
  }
  return new Response("Method Not Allowed", { status: 405 });
}
__name(handleModuli, "handleModuli");
__name2(handleModuli, "handleModuli");
async function handleForm(req, env, ctx) {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
      }
    });
  }
  if (req.method === "POST") {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
  return new Response("Method Not Allowed", { status: 405 });
}
__name(handleForm, "handleForm");
__name2(handleForm, "handleForm");
async function handleLead(raw, env, traceId) {
  try {
    const body = JSON.parse(raw);
    for (const entry of body.entry ?? []) {
      for (const ch of entry.changes ?? []) {
        if (ch.field !== "leadgen") continue;
        const leadId = ch.value?.leadgen_id;
        const pageId = ch.value?.page_id;
        const formId = ch.value?.form_id;
        if (!leadId) continue;
        console.log("lead_event", { traceId, pageId, formId, leadId });
        let map = {};
        const pageToken = await pickPageToken(env, pageId);
        if (pageToken) {
          const { ok, field_data } = await fetchLeadFieldDataMinimal(leadId, pageToken);
          if (ok) {
            map = fieldDataToMap(field_data);
            console.log("lead_field_data_map", { traceId, leadId, fields: map });
          } else {
            console.warn("lead_field_data_minimal_failed", { traceId, leadId });
          }
        } else {
          console.warn("page_token_missing_for_field_data", { traceId, pageId });
        }
        const token = (env.GRAPH_TOKEN || pageToken) ?? null;
        if (!token) {
          console.warn("graph_token_missing", { traceId, pageId });
          continue;
        }
        console.log("Preparo per airTable");
        const labelMap = await buildFormLabelMap(formId, pageId, pageToken, token, traceId);
        const normalized = normalizeLeadWithLabels(map, labelMap);
        await forwardLeadToAirtable(normalized, env, traceId);
        const sendappUser = {
          "portici": "67F7E1DA0EF73",
          "arzano": "67EFB424D2353",
          "torre del Greco": "67EFB605B93A1",
          "pomigliano": "68BFEBB41DDD0"
        };
        let centro = extractCenterFromNormalized(normalized);
        const custom_fields = [
          {
            id: 171,
            content: sanitizedPhoneNumber(normalized.fields.phone)
          },
          {
            id: 41,
            content: centro
            //Keap lo vuole con l'iniziale maiuscola (Arzano, Portici, Torre del Greco, Pomigliano)
          },
          {
            id: 165,
            // InstanceIDSendapp
            content: sendappUser[centro.toLowerCase()]
          }
        ];
        let cRes = await sendContactToKeapUtility(env, {
          nome: normalized.fields.first_name ?? "",
          cognome: normalized.fields.last_name ?? "",
          telefono: sanitizedPhoneNumber(normalized.fields.phone) ?? "",
          email: normalized.fields.email,
          // opzionale
          custom_fields
        });
        let jsonCRes = await cRes.json();
        console.log("---------RISPOSTA KEAP---------");
        console.log(jsonCRes);
        let contactID = jsonCRes.id;
        let tags = [
          361
          /*TAG NUOVO LEAD*/
        ];
        let tRes = await applyKeapTagsTo(env, contactID, tags);
        let jsonTRes = await tRes.json();
        console.log(jsonTRes);
      }
    }
  } catch (e) {
    console.error("handleLead_error", { traceId, msg: e?.message || String(e) });
  }
}
__name(handleLead, "handleLead");
__name2(handleLead, "handleLead");
async function fetchLeadFieldDataMinimal(leadId, pageToken) {
  try {
    const url = new URL(`https://graph.facebook.com/v23.0/${leadId}`);
    url.searchParams.set("fields", "field_data");
    url.searchParams.set("access_token", pageToken);
    const r = await fetch(url.toString());
    const j = await r.json().catch(() => ({}));
    if (!r.ok) return { ok: false, status: r.status, body: j, field_data: [] };
    return { ok: true, field_data: j.field_data || [], body: j };
  } catch (e) {
    return { ok: false, status: 0, body: { error: String(e) }, field_data: [] };
  }
}
__name(fetchLeadFieldDataMinimal, "fetchLeadFieldDataMinimal");
__name2(fetchLeadFieldDataMinimal, "fetchLeadFieldDataMinimal");
async function buildFormLabelMap(formId, pageId, pageToken, fallbackToken, traceId) {
  const map = /* @__PURE__ */ new Map();
  if (!formId) return map;
  let got = false;
  const tryWith = [pageToken, fallbackToken].filter(Boolean);
  for (const tkn of tryWith) {
    try {
      const fq = new URL(`https://graph.facebook.com/v23.0/${formId}`);
      fq.searchParams.set("fields", "questions{key,label,options}");
      fq.searchParams.set("access_token", tkn);
      const fr = await fetch(fq.toString());
      const fj = await fr.json().catch(() => ({}));
      if (fr.ok && Array.isArray(fj?.questions)) {
        for (const q of fj.questions) {
          if (q?.key) map.set(String(q.key).toLowerCase(), q.label || q.key);
        }
        got = true;
        break;
      } else {
        console.warn("graph_form_schema_unavailable", { traceId, status: fr.status, body: fj });
      }
    } catch (e) {
      console.warn("graph_form_schema_error", { traceId, msg: e?.message });
    }
  }
  if (!got && pageToken) {
    try {
      const lf = new URL(`https://graph.facebook.com/v23.0/${pageId}/leadgen_forms`);
      lf.searchParams.set("fields", "id,name,questions{key,label,options}");
      lf.searchParams.set("limit", "50");
      lf.searchParams.set("access_token", pageToken);
      const lfr = await fetch(lf.toString());
      const lfj = await lfr.json().catch(() => ({}));
      if (lfr.ok && Array.isArray(lfj?.data)) {
        const form = lfj.data.find((f) => f.id === formId);
        if (form?.questions) {
          for (const q of form.questions) {
            if (q?.key) map.set(String(q.key).toLowerCase(), q.label || q.key);
          }
          got = true;
        }
      } else {
        console.warn("graph_form_list_unavailable", { traceId, status: lfr.status, body: lfj });
      }
    } catch (e) {
      console.warn("graph_form_list_error", { traceId, msg: e?.message });
    }
  }
  if (!got) console.warn("form_schema_fallback_to_keys", { traceId, formId });
  return map;
}
__name(buildFormLabelMap, "buildFormLabelMap");
__name2(buildFormLabelMap, "buildFormLabelMap");
function fieldDataToMap(field_data) {
  const out = {};
  for (const f of field_data || []) {
    const key = (f?.name || "").toLowerCase();
    if (!key) continue;
    const val = Array.isArray(f?.values) ? f.values.join("\n") : f?.values ?? "";
    out[key] = val;
  }
  return out;
}
__name(fieldDataToMap, "fieldDataToMap");
__name2(fieldDataToMap, "fieldDataToMap");
async function verifyMetaSignature(rawBody, header, appSecret) {
  try {
    const prefix = "sha256=";
    if (!header || !header.startsWith(prefix) || !appSecret) return false;
    const sigProvided = header.slice(prefix.length);
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(appSecret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const mac = await crypto.subtle.sign("HMAC", key, enc.encode(rawBody));
    const sigCalc = Array.from(new Uint8Array(mac)).map((b) => b.toString(16).padStart(2, "0")).join("");
    return timingSafeEqual(sigProvided, sigCalc);
  } catch {
    return false;
  }
}
__name(verifyMetaSignature, "verifyMetaSignature");
__name2(verifyMetaSignature, "verifyMetaSignature");
function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let res = 0;
  for (let i = 0; i < a.length; i++) res |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return res === 0;
}
__name(timingSafeEqual, "timingSafeEqual");
__name2(timingSafeEqual, "timingSafeEqual");
async function pickPageToken(env, pageId) {
  try {
    if (env.PAGE_TOKENS_JSON) {
      const map = JSON.parse(env.PAGE_TOKENS_JSON);
      return map?.[pageId] || null;
    }
  } catch {
  }
  return null;
}
__name(pickPageToken, "pickPageToken");
__name2(pickPageToken, "pickPageToken");
function normalizeLeadWithLabels(lead, labelMap) {
  const rawMap = { ...lead };
  const pick = /* @__PURE__ */ __name2((...keys) => keys.map((k) => k.toLowerCase()).find((k) => rawMap[k] !== void 0), "pick");
  const mapLC = {};
  for (const [k, v] of Object.entries(rawMap)) {
    mapLC[String(k).toLowerCase()] = v;
  }
  const fields = {
    full_name: rawMap[pick("full_name", "name", "nome e cognome", "nomeecognome", "nome completo")],
    first_name: rawMap[pick("first_name", "nome")],
    last_name: rawMap[pick("last_name", "cognome")],
    email: rawMap[pick("email", "e-mail", "mail")],
    phone: rawMap[pick("phone_number", "telefono", "cellulare", "mobile")],
    city: rawMap[pick("city", "citt\xE0")],
    zip: rawMap[pick("zip", "cap", "postal code")]
  };
  const known = new Set([
    "full_name",
    "name",
    "nome e cognome",
    "nomeecognome",
    "nome completo",
    "first_name",
    "nome",
    "last_name",
    "cognome",
    "email",
    "e-mail",
    "mail",
    "phone_number",
    "telefono",
    "cellulare",
    "mobile",
    "city",
    "citt\xE0",
    "zip",
    "cap",
    "postal code"
  ].map((s) => s.toLowerCase()));
  const answers = [];
  for (const [key, value] of Object.entries(rawMap)) {
    if (known.has(key)) continue;
    const label = labelMap.get(key) || key;
    answers.push({ key, label, value });
  }
  const disclaimers = Array.isArray(lead.custom_disclaimer_responses) ? lead.custom_disclaimer_responses.map((d) => ({
    checkbox_key: d?.checkbox_key,
    is_checked: !!d?.is_checked,
    text: d?.text
  })) : [];
  const meta = {
    id: lead.id,
    created_time: lead.created_time,
    form_id: lead.form_id,
    ad_id: lead.ad_id,
    adset_id: lead.adset_id,
    campaign_id: lead.campaign_id,
    page_id: lead.page_id
  };
  console.log("Normalized\n", "Fields:", fields, "Answers:", answers, "Raw:", lead);
  return { meta, fields, answers, disclaimers, raw: lead };
}
__name(normalizeLeadWithLabels, "normalizeLeadWithLabels");
__name2(normalizeLeadWithLabels, "normalizeLeadWithLabels");
var AIRTABLE_ROUTES = {
  "arzano": { base: "appMoFcRmbgI8rpH8", table: "tblNNPcer4NqOqrpM" },
  "portici": { base: "appWPbF9yD2PtQrEm", table: "tbl21en6aDhgcD7T0" },
  "torre del greco": { base: "appCVqkej3tDupAQP", table: "tblL6YNidW44GXBEq" },
  "pomigliano": { base: "", table: "" }
};
function norm(s) {
  return String(s || "").toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/\s+/g, " ").trim();
}
__name(norm, "norm");
__name2(norm, "norm");
function humanize(s) {
  if (s == null) return "";
  if (Array.isArray(s)) return s.map(humanize).join(", ");
  let t = String(s);
  t = t.replace(/_/g, " ").replace(/\s+/g, " ").trim();
  t = t.replace(/\bsi\b/gi, (m) => m[0] === "S" ? "S\xEC" : "s\xEC");
  return t.charAt(0).toUpperCase() + t.slice(1);
}
__name(humanize, "humanize");
__name2(humanize, "humanize");
function parseIsoDate(d) {
  if (!d) return void 0;
  const fixed = d.replace(/\+0000$/, "Z");
  const dt = new Date(fixed);
  if (isNaN(dt.getTime())) return void 0;
  return dt.toISOString();
}
__name(parseIsoDate, "parseIsoDate");
__name2(parseIsoDate, "parseIsoDate");
function extractCenterFromNormalized(normalized) {
  console.log("Extracting Center...");
  console.log(normalized.answers);
  const tryFromAnswers = /* @__PURE__ */ __name2(() => {
    for (const a of normalized.answers || []) {
      const k = norm(a.key || "").toLowerCase();
      const l = norm(a.label || "").toLowerCase();
      const v = norm(a.value || "").toLowerCase();
      if (!v) continue;
      if (k.includes("centro") || k.includes("centri") || l.includes("centro") || l.includes("centri")) {
        if (v.includes("arzano")) return "Arzano";
        if (v.includes("portici")) return "Portici";
        if (v.includes("torre") || v.includes("greco")) return "Torre del Greco";
        if (v.includes("pomigliano")) return "Pomigliano";
      }
    }
    return null;
  }, "tryFromAnswers");
  return tryFromAnswers();
}
__name(extractCenterFromNormalized, "extractCenterFromNormalized");
__name2(extractCenterFromNormalized, "extractCenterFromNormalized");
function buildInformazioni(normalized) {
  const lines = [];
  for (const a of normalized.answers || []) {
    const val = a?.value;
    if (val == null || String(val).trim() === "") continue;
    const labelN = norm(a.label || "");
    const keyN = norm(a.key || "");
    if (labelN.includes("centro") || labelN.includes("centri") || keyN.includes("centro") || keyN.includes("centri")) {
      continue;
    }
    const q = humanize(a.label || a.key || "");
    const r = humanize(val);
    if (q && r) {
      lines.push(`D: ${q}
R: ${r}`);
    }
  }
  return lines.join("\n\n");
}
__name(buildInformazioni, "buildInformazioni");
__name2(buildInformazioni, "buildInformazioni");
async function forwardLeadToAirtable(normalized, env, traceId) {
  try {
    const center = extractCenterFromNormalized(normalized).toLowerCase();
    if (!center) {
      console.warn("airtable_center_missing", { traceId });
      return;
    }
    const route = AIRTABLE_ROUTES[center];
    if (!route) {
      console.warn("airtable_center_unmapped", { traceId, center });
      return;
    }
    if (!env.AIRTABLE_API_KEY) {
      console.warn("airtable_api_key_missing", { traceId });
      return;
    }
    const nome = normalized.fields?.first_name || normalized.fields?.full_name || "";
    const cognome = normalized.fields?.last_name || "";
    const telefono = normalized.fields?.phone || normalized.fields?.phone_number || "";
    const dataComp = parseIsoDate(normalized.meta?.created_time);
    const infoStr = buildInformazioni(normalized);
    const endpoint = `https://api.airtable.com/v0/${route.base}/${route.table}`;
    const payload = {
      records: [
        {
          fields: {
            "Nome": nome ? humanize(nome) : void 0,
            "Cognome": cognome ? humanize(cognome) : void 0,
            "Telefono": telefono || void 0,
            "Data compilazione": dataComp || void 0,
            "Informazioni": infoStr || void 0
            // opzionali per debug (crea le colonne se vuoi vederli):
            // "_Centro": center,
            // "_Lead ID": normalized.meta?.id,
            // "_Form ID": normalized.meta?.form_id,
            // "_Page ID": normalized.meta?.page_id,
          }
        }
      ],
      typecast: true
    };
    console.log("Invio Payload...\n", payload);
    const r = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.AIRTABLE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) {
      console.error("airtable_error", { traceId, status: r.status, body: j, center, route });
      return;
    }
    console.log("airtable_ok", {
      traceId,
      center,
      base: route.base,
      table: route.table,
      recId: j?.records?.[0]?.id
    });
  } catch (e) {
    console.error("airtable_exception", { traceId, msg: e?.message || String(e) });
  }
}
__name(forwardLeadToAirtable, "forwardLeadToAirtable");
__name2(forwardLeadToAirtable, "forwardLeadToAirtable");
async function sendContactToKeapUtility(env, contatto) {
  const nome = String(contatto?.nome ?? "").trim();
  const cognome = String(contatto?.cognome ?? "").trim();
  const telefono = String(contatto?.telefono ?? "").trim();
  const email = contatto?.email ? String(contatto.email).trim() : void 0;
  const custom_fields = contatto.custom_fields;
  if (!nome || !cognome || !telefono || !custom_fields) {
    throw new Error("sendContactToKeapUtility: campi obbligatori mancanti (nome, cognome, telefono, centro).");
  }
  const payload = { nome, cognome, telefono, custom_fields };
  if (email) payload.email = email;
  const svc = env["keap-utility"] || env.KEAP_UTILITY;
  if (!svc?.fetch) {
    throw new Error('sendContactToKeapUtility: binding "keap-utility" (o KEAP_UTILITY) non disponibile.');
  }
  const req = new Request("https://keap-utility/createContact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const res = await svc.fetch(req);
  if (!res.ok) {
    let body;
    try {
      body = await res.text();
    } catch {
    }
    throw new Error(`keap-utility errore ${res.status}: ${body ?? "<no body>"}`);
  }
  return res;
}
__name(sendContactToKeapUtility, "sendContactToKeapUtility");
__name2(sendContactToKeapUtility, "sendContactToKeapUtility");
function sanitizedPhoneNumber(phone) {
  let cleanedPhone = phone?.replace(/\D/g, "");
  if (cleanedPhone.length == 10) {
    cleanedPhone = "39" + cleanedPhone;
  }
  return cleanedPhone;
}
__name(sanitizedPhoneNumber, "sanitizedPhoneNumber");
__name2(sanitizedPhoneNumber, "sanitizedPhoneNumber");
async function applyKeapTagsTo(env, contactID, tagIds) {
  const payload = { contactID, tagIds };
  const svc = env["keap-utility"] || env.KEAP_UTILITY;
  if (!svc?.fetch) {
    throw new Error('sendContactToKeapUtility: binding "keap-utility" (o KEAP_UTILITY) non disponibile.');
  }
  const req = new Request("https://keap-utility/applyTags", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const res = await svc.fetch(req);
  if (!res.ok) {
    let body;
    try {
      body = await res.text();
    } catch {
    }
    throw new Error(`keap-utility errore ${res.status}: ${body ?? "<no body>"}`);
  }
  return res;
}
__name(applyKeapTagsTo, "applyKeapTagsTo");
export {
  index_default as default
};
//# sourceMappingURL=index.js.map

--ee728cdef86d3c6d19539ec9562f4a9f63edd12c0909da8475d067bcd92d--
