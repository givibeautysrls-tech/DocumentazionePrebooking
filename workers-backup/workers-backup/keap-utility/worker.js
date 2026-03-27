--73a4bfc8e4738bb5f7543aa66997d6626703c71a549ba9efbb5b91aca617
Content-Disposition: form-data; name="index.js"

var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/index.js
var __defProp2 = Object.defineProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
var index_default = {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      const path = url.pathname.replace(/\/+$/, "");
      const method = request.method.toUpperCase();
      if (method === "OPTIONS") {
        return cors();
      }
      if (method === "POST" && path === "/createContact") {
        const body = await safeJson(request);
        return await createContact(body, env);
      }
      if (method === "GET" && path.startsWith("/getContactInfo/")) {
        const id = path.split("/").pop();
        return await getContactInfo(id, env);
      }
      if (method === "GET" && path === "/findContact") {
        const email = url.searchParams.get("email");
        return await findContact({ email }, env);
      }
      if (method === "POST" && path === "/applyTags") {
        const body = await safeJson(request);
        return await applyTags(body, env);
      }
      if (method === "GET" && path.startsWith("/getAppointment/")){
        const id = path.split("/").pop();
        return await getApppointmentInfo(id, env);
      }
      return json({ error: "Not found" }, 404);
    } catch (err) {
      return json({ error: "Unhandled error", detail: String(err?.message || err) }, 500);
    }
  }
};
async function createContact(payload, env) {
  const base = env.KEAP_BASE || "https://api.infusionsoft.com";
  const token = env.KEAP_ACCESS_TOKEN;
  assertToken(token);
  const {
    given_name = payload?.nome,
    family_name = payload?.cognome,
    email,
    phone = payload?.telefono,
    custom_fields
    // opzionale: array di { id, content } in v2
  } = payload || {};
  if (!email && !phone) {
    return json({ error: "Serve almeno 'email' o 'phone' per creare il contatto." }, 400);
  }
  const body = {
    ...given_name ? { given_name } : {},
    ...family_name ? { family_name } : {},
    ...email ? {
      email_addresses: [
        {
          email,
          field: "EMAIL1"
        }
      ]
    } : {},
    ...phone ? {
      phone_numbers: [
        {
          number: phone,
          type: "Mobile",
          field: "PHONE1"
        }
      ]
    } : {},
    ...Array.isArray(custom_fields) ? { custom_fields } : {}
  };
  console.log("-----------------INVIO A KEAP-------------------");
  console.log(body);
  const res = await keapFetch(
    `${base}/crm/rest/v2/contacts`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }
  );
  return json(res, 201);
}
__name(createContact, "createContact");
__name2(createContact, "createContact");
async function getContactInfo(id, env) {
  const base = env.KEAP_BASE || "https://api.infusionsoft.com";
  const token = env.KEAP_ACCESS_TOKEN;
  assertToken(token);
  if (!id) return json({ error: "Param 'id' mancante nel path." }, 400);
  const res = await keapFetch(
    `${base}/crm/rest/v2/contacts/${encodeURIComponent(id)}`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  return json(res, 200);
}
__name(getContactInfo, "getContactInfo");
__name2(getContactInfo, "getContactInfo");
async function findContact({ email }, env) {
  const base = env.KEAP_BASE || "https://api.infusionsoft.com";
  const token = env.KEAP_ACCESS_TOKEN;
  assertToken(token);
  if (!email) {
    return json({ error: "Specifica ?email= nella query string." }, 400);
  }
  const u = new URL(`${base}/crm/rest/v2/contacts`);
  u.searchParams.set("fields", "email_address,given_name,family_name,phone_numbers");
  u.searchParams.set("filter", `email==${email}`);
  const res = await keapFetch(u.toString(), {
    headers: { Authorization: `Bearer ${token}` }
  });
  return json(res, 200);
}
__name(findContact, "findContact");
__name2(findContact, "findContact");
async function applyTags({ contactID, tagIds }, env) {
  const base = env.KEAP_BASE || "https://api.infusionsoft.com";
  const token = env.KEAP_ACCESS_TOKEN;
  assertToken(token);
  if (!contactID || !Array.isArray(tagIds) || tagIds.length === 0) {
    return json(
      { error: "Richiede 'contactID' e 'tagIds' (array di numeri) nel body." },
      400
    );
  }
  const res = await keapFetch(
    `${base}/crm/rest/v1/contacts/${encodeURIComponent(contactID)}/tags`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ tagIds })
    }
  );
  return json({ ok: true, result: res }, 200);
}
__name(applyTags, "applyTags");
__name2(applyTags, "applyTags");
function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
      ...extraHeaders
    }
  });
}
__name(json, "json");
__name2(json, "json");
function cors() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
      "Access-Control-Max-Age": "86400"
    }
  });
}
__name(cors, "cors");
__name2(cors, "cors");
async function safeJson(request) {
  const text = await request.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("JSON non valido nel body della richiesta.");
  }
}
__name(safeJson, "safeJson");
__name2(safeJson, "safeJson");
function assertToken(token) {
  if (!token) {
    throw new Error("KEAP_ACCESS_TOKEN mancante: imposta il secret Wrangler.");
  }
}
__name(assertToken, "assertToken");
__name2(assertToken, "assertToken");
async function keapFetch(url, init = {}) {
  const r = await fetch(url, init);
  const text = await r.text();
  const data = text ? safeParse(text) : null;
  if (!r.ok) {
    throw new Error(
      `Keap API ${r.status} ${r.statusText} \u2013 ${data && data.message ? data.message : text}`
    );
  }
  return data;
}
__name(keapFetch, "keapFetch");
__name2(keapFetch, "keapFetch");
function safeParse(s) {
  try {
    return JSON.parse(s);
  } catch {
    return { raw: s };
  }
}
__name(safeParse, "safeParse");
__name2(safeParse, "safeParse");


async function getApppointmentInfo(id, env){ 
  const base = env.KEAP_BASE || "https://api.infusionsoft.com";
  const token = env.KEAP_ACCESS_TOKEN;
  assertToken(token);
  if (!id) return json({ error: "Param 'id' mancante nel path." }, 400);
  const res = await keapFetch(
    `${base}/crm/rest/v1/appointments/${encodeURIComponent(id)}`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  return json(res, 200);
}


export {
  index_default as default
};
//# sourceMappingURL=index.js.map


--73a4bfc8e4738bb5f7543aa66997d6626703c71a549ba9efbb5b91aca617--
