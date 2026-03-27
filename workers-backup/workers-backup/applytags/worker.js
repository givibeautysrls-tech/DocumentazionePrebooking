--d5e5ce2a907e283e594d8e4b578b2c0a7f77c9a856c74aabe6c912e836b3
Content-Disposition: form-data; name="package-lock.json"

{
  "name": "applytags",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "applytags",
      "version": "1.0.0",
      "license": "ISC"
    }
  }
}

--d5e5ce2a907e283e594d8e4b578b2c0a7f77c9a856c74aabe6c912e836b3
Content-Disposition: form-data; name="package.json"

{
  "name": "applytags",
  "version": "1.0.0",
  "license": "ISC"
}

--d5e5ce2a907e283e594d8e4b578b2c0a7f77c9a856c74aabe6c912e836b3
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
  async fetch(request,env) {
    try {
      var url = new URL(request.url);
      var keapID = url.searchParams.get("keapID");
      var tagIDsParam = url.searchParams.get("tagIDs");

      if (!keapID || !tagIDsParam) {
        return new Response("❌ Parametri 'keapID' e 'tagIDs' obbligatori", { status: 400, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "https://promoepilazione.it" } });
      }

      const tagIDs = tagIDsParam
        .split(",")
        .map(id => parseInt(id.trim()))
        .filter(id => !isNaN(id));

      if (tagIDs.length === 0) {
        return new Response("❌ Nessun tag valido trovato in 'tagIDs'", { status: 400, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "https://promoepilazione.it" } });
      }


      var ACCESS_TOKEN = "Bearer " + env.KEAP_API_KEY;
      //return new Response(ACCESS_TOKEN, { status: 400 });

      const keapRes = await fetch(`https://api.infusionsoft.com/crm/rest/v1/contacts/${keapID}/tags`, {
        method: "POST",
        headers: {
          "Authorization": ACCESS_TOKEN,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ tagIds: tagIDs })
      });

      const resultText = await keapRes.text();

      if (keapRes.ok) {
        return new Response(`✅ Tag(s) ${tagIDs.join(", ")} applicati al contatto ${keapID}`, { status: 200,  headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "https://promoepilazione.it" }, });
      } else {
        return new Response(`❌ Errore Keap: ${resultText}`, { status: 500,  headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "https://promoepilazione.it" }, });
      }

    } catch (err) {
      return new Response(`💥 Errore imprevisto: ${err.message}`, { status: 500,  headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "https://promoepilazione.it" }, });
    }
  }
}

--d5e5ce2a907e283e594d8e4b578b2c0a7f77c9a856c74aabe6c912e836b3
Content-Disposition: form-data; name="wrangler.toml"

name = "applytags"
main = "worker.js"
compatibility_date = "2023-08-23"

[unsafe.metadata.observability]
enabled = true

--d5e5ce2a907e283e594d8e4b578b2c0a7f77c9a856c74aabe6c912e836b3--
