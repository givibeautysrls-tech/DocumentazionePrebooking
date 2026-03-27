--09f536886b09c290cb1546389b0ca9f5798f6cb2c957c608843e05d34df9
Content-Disposition: form-data; name="package.json"

{
  "name": "aged-bread-0321",
  "version": "1.0.0",
  "license": "ISC"
}

--09f536886b09c290cb1546389b0ca9f5798f6cb2c957c608843e05d34df9
Content-Disposition: form-data; name="worker.js"

export default {
  async fetch(request, env, ctx) {
    const allowedOrigin = "https://promoepilazione.it";

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": allowedOrigin,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
          "Vary": "Origin"
        }
      });
    }

    const corsHeaders = {
      "Access-Control-Allow-Origin": allowedOrigin,
      "Content-Type": "application/json",
      "Vary": "Origin"
    };

    if (request.method !== "POST") {
      return new Response(JSON.stringify({ message: "Metodo non consentito" }), {
        status: 405,
        headers: corsHeaders
      });
    }

    let data;
    try {
      data = await request.json();
    } catch (err) {
      return new Response(JSON.stringify({ message: "JSON non valido" }), {
        status: 400,
        headers: corsHeaders
      });
    }

    const { first_name, last_name, phone, referrer_id, centro } = data;
    const link_type_id = 1;

    if (!first_name || !last_name || !phone || !referrer_id || !centro) {
      return new Response(JSON.stringify({ message: "Parametri mancanti" }), {
        status: 422,
        headers: corsHeaders
      });
    }

    function normalizzaTelefono(phone) {
      const digits = phone.replace(/[^0-9]/g, "");
      if (digits.length === 10) return `39${digits}`;
      if (digits.length === 12 && digits.startsWith("39")) return digits;
      return null;
    }

    const telefonoPulito = normalizzaTelefono(phone);
    if (!telefonoPulito) {
      return new Response(JSON.stringify({ message: "Telefono non valido" }), {
        status: 422,
        headers: corsHeaders
      });
    }

    const centriValidi = ["Portici", "Arzano", "Torre del Greco"];
    if (!centriValidi.includes(centro)) {
      return new Response(JSON.stringify({ message: "Centro non valido" }), {
        status: 422,
        headers: corsHeaders
      });
    }

    const contactPayload = {
      given_name: first_name,
      family_name: last_name || "",
      phone_numbers: [{ number: phone, field: "PHONE1" }],
      custom_fields: [
        { id: 171, content: telefonoPulito },
        { id: 41, content: centro }
      ]
    };

    const createRes = await fetch("https://api.infusionsoft.com/crm/rest/v2/contacts", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.KEAP_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(contactPayload)
    });

    if (!createRes.ok) {
      const errText = await createRes.text();
      return new Response(JSON.stringify({
        message: "Errore creazione contatto",
        detail: errText
      }), {
        status: 500,
        headers: corsHeaders
      });
    }

    const newContact = await createRes.json();
    const newContactId = newContact.id;

    const linkRes = await fetch("https://api.infusionsoft.com/crm/rest/v2/contacts:link", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.KEAP_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contact1_id: referrer_id,
        contact2_id: newContactId,
        link_type_id
      })
    });

    // TAG REFERRER
    const tagReferrerRes = await env.APPLY_TAGS.fetch(`https://applytags.notifichegielvi.workers.dev/?keapID=${referrer_id}&tagIDs=333`);
    const tagReferrerStatus = tagReferrerRes.status;
    const tagReferrerText = await tagReferrerRes.text();

    // TAG NUOVO CONTATTO
    const tagNewContactRes = await env.APPLY_TAGS.fetch(`https://applytags.notifichegielvi.workers.dev/?keapID=${newContactId}&tagIDs=335`);
    const tagNewContactStatus = tagNewContactRes.status;
    const tagNewContactText = await tagNewContactRes.text();

    if (!linkRes.ok) {
      const errText = await linkRes.text();
      return new Response(JSON.stringify({
        message: "Contatto creato ma errore nel link",
        detail: errText,
        tag_referrer_response: {
          status: tagReferrerStatus,
          body: tagReferrerText
        },
        tag_new_contact_response: {
          status: tagNewContactStatus,
          body: tagNewContactText
        }
      }), {
        status: 207,
        headers: corsHeaders
      });
    }

    return new Response(JSON.stringify({
      status: "successo",
      message: "Contatto creato e collegato",
      contact_id: newContactId,
      tag_referrer_response: {
        status: tagReferrerStatus,
        body: tagReferrerText
      },
      tag_new_contact_response: {
        status: tagNewContactStatus,
        body: tagNewContactText
      }
    }), {
      status: 200,
      headers: corsHeaders
    });
  }
};

--09f536886b09c290cb1546389b0ca9f5798f6cb2c957c608843e05d34df9
Content-Disposition: form-data; name="wrangler.toml"

name = "aged-bread-0321"
main = "worker.js"
compatibility_date = "2023-08-23"

[unsafe.metadata.observability]
enabled = true

--09f536886b09c290cb1546389b0ca9f5798f6cb2c957c608843e05d34df9
Content-Disposition: form-data; name="package-lock.json"

{
  "name": "aged-bread-0321",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "aged-bread-0321",
      "version": "1.0.0",
      "license": "ISC"
    }
  }
}

--09f536886b09c290cb1546389b0ca9f5798f6cb2c957c608843e05d34df9--
