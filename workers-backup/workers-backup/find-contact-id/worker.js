--8258516abe6ac5d848b66ddd5c1bf174e87a9e9dcc5bd4f8b947c32fa363
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

      if (request.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": "https://promoepilazione.it",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Max-Age": "86400",
            "Vary": "Origin"
          }
        });
      }

      if (request.method !== "POST") {
        return new Response(JSON.stringify({ error: "Usa POST con JSON" }), {
          status: 405,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "https://promoepilazione.it"
          }
        });
      }
      

      const { first_name, last_name, phone } = await request.json();

      if (!first_name || !last_name || !phone) {
        return new Response(JSON.stringify({ error: "Parametri mancanti" }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "https://promoepilazione.it",
            "Vary": "Origin"
          }
        });
      }

      // 🔧 Pulizia + normalizzazione telefono con prefisso 39
      const normalizzaTelefono = (numero) => {
        const soloNumeri = numero.replace(/\D/g, "");
        if (soloNumeri.length === 10) return "39" + soloNumeri;
        if (soloNumeri.length === 12) return soloNumeri;
        return soloNumeri; // fallback per evitare blocchi
      };

      const telefonoPulito = normalizzaTelefono(phone);
      const KEAP_API_TOKEN = "Bearer " + env.KEAP_API_KEY;

      const filtro = `given_name==${encodeURIComponent(first_name)};family_name==${encodeURIComponent(last_name)}`;
      const filterParam = encodeURIComponent(filtro); // encoding completo

      const endpoint = `https://api.infusionsoft.com/crm/rest/v2/contacts?filter=${filterParam}&fields=phone_numbers`;

      const keapRes = await fetch(endpoint, {
        headers: {
          "Authorization": KEAP_API_TOKEN,
          "Accept": "application/json"
        }
      });

      if (!keapRes.ok) {
        const err = await keapRes.text();
        return new Response(JSON.stringify({ error: "Errore da Keap", details: err }), {
          status: keapRes.status,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "https://promoepilazione.it",
            "Vary": "Origin"
          }
        });
      }

      const result = await keapRes.json();
      const contatti = result.contacts || [];

      // 🔎 Verifica se uno dei numeri combacia dopo normalizzazione
      const trovato = contatti.lenght === 1 || contatti.find(c => {
        return c.phone_numbers?.some(p => normalizzaTelefono(p.number) === telefonoPulito);
      });

      if (!trovato) {
        return new Response(JSON.stringify({ error: "Contatto non trovato", contatti: contatti }), {
          status: 404,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "https://promoepilazione.it",
            "Vary": "Origin"
          }
        });
      }

      return new Response(JSON.stringify({ id: trovato.id }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "https://promoepilazione.it",
          "Vary": "Origin"
        }
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "https://promoepilazione.it",
          "Vary": "Origin"
        }
      });
    }
  }
};

--8258516abe6ac5d848b66ddd5c1bf174e87a9e9dcc5bd4f8b947c32fa363--
