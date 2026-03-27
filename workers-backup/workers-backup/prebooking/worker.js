--b1c74307718e509be0a39416299c9ab77c445666b7f55ba539a878ff4b73
Content-Disposition: form-data; name="worker.js"

/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      const path = url.pathname.replace(/\/+$/, "");
      const method = request.method.toUpperCase();
      if (method === "OPTIONS") {
        return cors(request);
      }
      if (method === "POST" && path === "/setAppointment") {
        const body = await safeJson(request);
        //setAppointment
      }
      if (method === "POST" && path.startsWith("/cancelAppointment/")) {
        const id = path.split("/").pop();
        //cancelAppointment
        let resApt = await getAppointmentInfo(id, env)
        let apt = await resApt.json()
        console.log(apt)

        let resContact = await getContactInfo(apt.contact_id,env)
        let contact = await resContact.json()
        console.log("CONTATTO: ",contact)
        const params = url.searchParams
        const centro = params.get("centro")
        await notifyCancel(apt, contact, centro, env)
        return json({res:"OK"})
      }
      if ((method === "POST" || method === "GET") && path.startsWith("/resetAppointment/")) {
        const id = path.split("/").pop();
        let resApt = await getAppointmentInfo(id, env)
        let apt = await resApt.json()
        let resContact = await getContactInfo(apt.contact_id,env)
        let contact = await resContact.json()
        const params = url.searchParams
        const newDate = params.get("newDate")
        const centro = params.get("centro")
        await notifyReset(apt, contact, newDate, centro, env);
        return json({res:"OK"})
      }
      if (method === "POST" && path === "/setOpportunity") {
        const body = await safeJson(request);
        //set opportunity
      }
      return json({ error: "Not found" }, 404);
    } catch (err) {
      return json({ error: "Unhandled error", detail: String(err?.message || err) }, 500);
    }
  }
};


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


function cors(req) {
  const reqMethod  = req.headers.get("Access-Control-Request-Method") || "GET,POST,OPTIONS";
  const reqHeaders = req.headers.get("Access-Control-Request-Headers") || "Content-Type,Authorization";

  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": reqMethod,                 // echo del metodo richiesto
      "Access-Control-Allow-Headers": reqHeaders,                // echo degli header richiesti
      "Access-Control-Max-Age": "86400",
      "Vary": "Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
    }
  });
}


async function safeJson(request) {
  const text = await request.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("JSON non valido nel body della richiesta.");
  }
}

async function getAppointmentInfo(id, env) {
  const svc = env["keap-utility"] || env.KEAP_UTILITY;
  if (!svc?.fetch) {
    throw new Error('binding "keap-utility" (o KEAP_UTILITY) non disponibile.');
  }
  const req = new Request("https://keap-utility/getAppointment/"+encodeURIComponent(id), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
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

async function getContactInfo(id, env) {
  const svc = env["keap-utility"] || env.KEAP_UTILITY;
  if (!svc?.fetch) {
    throw new Error('binding "keap-utility" (o KEAP_UTILITY) non disponibile.');
  }
  const req = new Request("https://keap-utility/getContactInfo/"+encodeURIComponent(id), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
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

async function notifyCancel(apt, contact, centro, env) {

  let match = apt.description.match(/Trattamento:\s*(.*?)\s*Fissato il:/);

  const trattamenti = match ? match[1].trim() : null; 

  match = apt.description.match(/Fissato il:\s*(.*)/);

  const fissato = match ? match[1].trim() : null;

  let body = `Cliente: ${contact.given_name} ${contact.family_name}\n`+
  `Trattamento: ${trattamenti}\n`+
  `Centro: ${centro ?? ""}\n`+
  `Data: ${apt.title}\n`+
  `Fissato il: ${fissato}\n`


  if (env.PUSHOVER_TOKEN && env.PUSHOVER_USER) {
    try {
      const form = new URLSearchParams();
      form.set("token", env.PUSHOVER_TOKEN);
      form.set("user", env.PUSHOVER_USER);
      form.set("title", "Appuntamento Annullato");
      form.set("message", body);
      form.set("priority", "0");
      await fetch("https://api.pushover.net/1/messages.json", { method: "POST", body: form });
      return;
    } catch {
    }
  }
}


async function notifyReset(apt, contact, newDate, centro, env) {

  let match = apt.description.match(/Trattamento:\s*(.*?)\s*Fissato il:/);

  const trattamenti = match ? match[1].trim() : null; 

  match = apt.description.match(/Fissato il:\s*(.*)/);

  const fissato = match ? match[1].trim() : null;

  let body = `Cliente: ${contact.given_name} ${contact.family_name}\n`+
  `Centro: ${centro ?? ""}\n`+
  `Trattamento: ${trattamenti}\n`+
  `Data: ${apt.title}\n`+
  `Fissato il: ${fissato}\n`+
  `Rinviato al: ${newDate}`
  


  if (env.PUSHOVER_TOKEN && env.PUSHOVER_USER) {
    try {
      const form = new URLSearchParams();
      form.set("token", env.PUSHOVER_TOKEN);
      form.set("user", env.PUSHOVER_USER);
      form.set("title", "Appuntamento Rinviato");
      form.set("message", body);
      form.set("priority", "0");
      await fetch("https://api.pushover.net/1/messages.json", { method: "POST", body: form });
      return;
    } catch {
    }
  }
}

--b1c74307718e509be0a39416299c9ab77c445666b7f55ba539a878ff4b73--
