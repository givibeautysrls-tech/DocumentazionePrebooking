--4e60ffbf19186e807c5e1188f597a70dcbecd95c51a903737688f07a37a3
Content-Disposition: form-data; name="index.js"

var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/index.js
var index_default = {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    }
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }
    try {
      const data = await request.json();
      if (!data.nome || !data.email || !data.telefono) {
        return new Response("Dati mancanti", { status: 400 });
      }
      const results = await Promise.allSettled([
        inviaAdAirtable(data, env),
        inviaNotificaPush(data, env),
        inviaWhatsApp(data, env)
      ]);
      const errori = results.filter((r) => r.status === "rejected");
      if (errori.length > 0) {
        console.error("Errori nelle operazioni:", errori.map((e) => ({
          status: e.status,
          reason: e.reason?.message || e.reason
        })));
      }
      const successi = results.filter((r) => r.status === "fulfilled");
      console.log(`Successi: ${successi.length}/3, Errori: ${errori.length}/3`);
      return new Response(JSON.stringify({
        success: true,
        message: "Lead elaborato con successo"
      }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    } catch (error) {
      console.error("Errore nel worker:", error);
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
  }
};
async function inviaAdAirtable(data, env) {
  const AIRTABLE_API_KEY = env.AIRTABLE_API_KEY;
  const AIRTABLE_BASE_ID = env.AIRTABLE_BASE_ID;
  const AIRTABLE_TABLE_NAME = env.AIRTABLE_TABLE_NAME;
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${AIRTABLE_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      fields: {
        "Nome": `${data.nome} ${data.cognome}`,
        "Telefono": data.telefono,
        "Facebook Ad ID": data.utm_content || "",
        "Data Lead": data.timestamp,
        "UTM Source": data.utm_source || "",
        "UTM Medium": data.utm_medium || "",
        "UTM Content": data.utm_content || ""
      }
    })
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Airtable error: ${response.status} - ${errorText}`);
  }
  return await response.json();
}
__name(inviaAdAirtable, "inviaAdAirtable");
async function inviaNotificaPush(data, env) {
  const PUSHOVER_TOKEN = env.PUSHOVER_TOKEN;
  const PUSHOVER_USER = env.PUSHOVER_USER;
  const messaggio = `\u{1F3AF} Nuovo Lead!
  
\u{1F464} Nome: ${data.nome} ${data.cognome}
\u{1F4E7} Email: ${data.email}
\u{1F4F1} Telefono: ${data.telefono}
\u{1F550} Data: ${new Date(data.timestamp).toLocaleString("it-IT")}`;
  const formData = new URLSearchParams();
  formData.append("token", PUSHOVER_TOKEN);
  formData.append("user", PUSHOVER_USER);
  formData.append("title", "Nuovo Lead");
  formData.append("message", messaggio);
  formData.append("priority", "1");
  formData.append("sound", "magic");
  const response = await fetch("https://api.pushover.net/1/messages.json", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: formData.toString()
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Pushover error: ${response.status} - ${errorText}`);
  }
  return await response.json();
}
__name(inviaNotificaPush, "inviaNotificaPush");
async function inviaWhatsApp(data, env) {
  const SENDAPP_API_KEY = env.SENDAPP_API_KEY;
  let numeroTelefono = data.telefono.replace(/\D/g, "");
  if (!numeroTelefono.startsWith("39")) {
    numeroTelefono = "39" + numeroTelefono;
  }
  const messaggio = `Ciao ${data.nome}! \u{1F44B}

[INSERISCI QUI IL TUO MESSAGGIO WHATSAPP]

Un saluto,
Michele De Sena`;
  const response = await fetch("https://api.sendapp.com/v1/send", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${SENDAPP_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      phone: numeroTelefono,
      message: messaggio
    })
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`SendApp error: ${response.status} - ${errorText}`);
  }
  return await response.json();
}
__name(inviaWhatsApp, "inviaWhatsApp");
export {
  index_default as default
};
//# sourceMappingURL=index.js.map

--4e60ffbf19186e807c5e1188f597a70dcbecd95c51a903737688f07a37a3--
