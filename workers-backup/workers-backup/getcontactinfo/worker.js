--040f3b56dbea5551e7f09d94023b5c7d754c25503cc193f5f0da2f778afa
Content-Disposition: form-data; name="package-lock.json"

{
  "name": "getcontactinfo",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "getcontactinfo",
      "version": "1.0.0",
      "license": "ISC"
    }
  }
}

--040f3b56dbea5551e7f09d94023b5c7d754c25503cc193f5f0da2f778afa
Content-Disposition: form-data; name="package.json"

{
  "name": "getcontactinfo",
  "version": "1.0.0",
  "license": "ISC"
}

--040f3b56dbea5551e7f09d94023b5c7d754c25503cc193f5f0da2f778afa
Content-Disposition: form-data; name="worker.js"

export default {
  async fetch(request, env, ctx) {
    try {
      // ⬇️ Leggi keapID dai parametri URL
      const url = new URL(request.url);
      const keapID = url.searchParams.get("keapID");

      if (!keapID) {
        return new Response(JSON.stringify({ error: "Missing keapID" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const KEAP_API_TOKEN = "Bearer " + env.KEAP_API_KEY;
      const endpoint = `https://api.infusionsoft.com/crm/rest/v2/contacts/${keapID}?optional_properties=custom_fields`;

      const keapResponse = await fetch(endpoint, {
        headers: {
          "Authorization": KEAP_API_TOKEN,
          "Accept": "application/json",
        },
      });

      if (!keapResponse.ok) {
        const text = await keapResponse.text();
        return new Response(JSON.stringify({ error: "Errore da Keap", details: text }), {
          status: keapResponse.status,
          headers: { "Content-Type": "application/json" },
        });
      }

      const data = await keapResponse.json();

      return new Response(JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*" // ✅ CORS
        },
      });

    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "https://promoepilazione.it" },
      });
    }
  },
};

--040f3b56dbea5551e7f09d94023b5c7d754c25503cc193f5f0da2f778afa
Content-Disposition: form-data; name="wrangler.toml"

name = "getcontactinfo"
main = "worker.js"
compatibility_date = "2023-08-23"

[unsafe.metadata.observability]
enabled = true

--040f3b56dbea5551e7f09d94023b5c7d754c25503cc193f5f0da2f778afa--
