--cca1d7aa80229ac08a11e44fdcbe96c185bd972b46dbe2cbf81400d1eb91
Content-Disposition: form-data; name="index.js"

var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/index.js
var index_default = {
  async fetch(req, env, ctx) {
    const url = new URL(req.url);
    if (req.method === "GET" && url.pathname === "/health") {
      return json({ ok: true, now: (/* @__PURE__ */ new Date()).toISOString() });
    }
    if (req.method === "POST" && url.pathname === "/event") {
      try {
        const raw = await req.text();
        const payload = safeParseJSON(raw);
        console.log(payload)
        const {
          aptId,
          // string | number
          customerId,
          // Keap contact id
          originalDate,
          // "dd/mm/yyyy" | "yyyy-mm-dd" | ISO
          newDate,
          // required ONLY if status === "rinvio"
          value,
          // number | "49,90" etc.
          treatments,
          // string
          center,
          // string
          status
          // "rinvio" | "annullamento" (REQUIRED)
        } = payload || {};
        assert(customerId, "customerId is required");
        assert(center, "center is required");
        assert(value !== void 0 && value !== null, "value is required");
        assert(
          status === "rinvio" || status === "annullamento",
          "status must be 'rinvio' or 'annullamento'"
        );
        if (status === "rinvio") {
          assert(
            newDate && String(newDate).trim() !== "",
            "newDate is required when status='rinvio'"
          );
        }
        const isoOriginal = normalizeToISODate(originalDate);
        const isoNew = status === "rinvio" ? normalizeToISODate(newDate) : null;
        const valueCents = euroToCents(value);
        const { given_name, family_name } = await fetchContactNames(env, customerId);
        const localDay = nowEuropeRomeYYYYMMDD();
        const sql = `
          INSERT INTO events
          (apt_id, keap_contact_id, center, status, original_date, new_date,
           value_cents, treatments, contact_given_name, contact_family_name, local_day)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await env.DB.prepare(sql).bind(
          String(aptId),
          String(customerId),
          String(center),
          status,
          isoOriginal,
          isoNew,
          valueCents,
          treatments || "",
          given_name || "",
          family_name || "",
          localDay
        ).run();
        const title = status == "rinvio" ? "Appuntamento Rinviato" : "Appuntamento Annullato";
        const message = formatInstantMessage({
          status,
          center,
          isoOriginal,
          isoNew,
          valueCents,
          treatments,
          given_name,
          family_name
        });
        await sendPushover(env, { title, message });
        return json({ ok: true });
      } catch (e) {
        return json({ ok: false, error: String(e && e.message ? e.message : e) }, 400);
      }
    }
    return new Response("Not found", { status: 404 });
  },
  async scheduled(controller, env, ctx) {
    const nowRome = new Date((/* @__PURE__ */ new Date()).toLocaleString("it-IT", { timeZone: "Europe/Rome" }));
    if (nowRome.getHours() !== 20) return;
    const yyyy = nowRome.getFullYear();
    const mm = String(nowRome.getMonth() + 1).padStart(2, "0");
    const dd = String(nowRome.getDate()).padStart(2, "0");
    const localDay = `${yyyy}-${mm}-${dd}`;
    const rs = await env.DB.prepare("SELECT center, status, value_cents FROM events WHERE local_day = ?").bind(localDay).all();
    const summary = buildSummary(rs && rs.results ? rs.results : []);
    const title = `${env.PUSHOVER_TITLE || "Appuntamenti"} \u2014 Riepilogo ${localDay}`;
    const message = formatDailySummary(localDay, summary);
    if (summary.total.count > 0) {
      await sendPushover(env, { title, message });
    }
  }
};
function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" }
  });
}
__name(json, "json");
function safeParseJSON(s) {
  try {
    return JSON.parse(s);
  } catch {
    throw new Error("Body is not valid JSON");
  }
}
__name(safeParseJSON, "safeParseJSON");
function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}
__name(assert, "assert");
function normalizeToISODate(x) {
  if (!x) return null;
  const s = String(x).trim();

  // Caso: dd/mm/yyyy
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (m) {
    const dd = m[1].padStart(2, "0");
    const mm = m[2].padStart(2, "0");
    const yyyy = m[3];
    return `${dd}-${mm}-${yyyy}`;
  }

  // Caso: yyyy-mm-dd (o yyyy-mm-ddTHH:MM)
  const n = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (n) {
    const yyyy = n[1];
    const mm = n[2];
    const dd = n[3];
    return `${dd}-${mm}-${yyyy}`;
  }

  // Fallback: Date parse (usa oggetto Date)
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) {
    throw new Error(`Invalid date: ${x}`);
  }

  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();

  return `${dd}-${mm}-${yyyy}`;
}
__name(normalizeToISODate, "normalizeToISODate");
function euroToCents(v) {
  if (typeof v === "number") return Math.round(v * 100);
  if (typeof v !== "string") return 0;
  let s = v.trim();
  s = s.replace(/\./g, "");
  s = s.replace(/,/g, ".");
  const num = Number(s);
  if (Number.isNaN(num)) throw new Error(`Invalid value: ${v}`);
  return Math.round(num);
}
__name(euroToCents, "euroToCents");
function nowEuropeRomeYYYYMMDD() {
  const nowRome = new Date((/* @__PURE__ */ new Date()).toLocaleString("it-IT", { timeZone: "Europe/Rome" }));
  const yyyy = nowRome.getFullYear();
  const mm = String(nowRome.getMonth() + 1).padStart(2, "0");
  const dd = String(nowRome.getDate()).padStart(2, "0");
  return `${dd}–${mm}-${yyyy}`;
}
__name(nowEuropeRomeYYYYMMDD, "nowEuropeRomeYYYYMMDD");
async function fetchContactNames(env, keapId) {
  const u = new URL("http://keap-utility/getContactInfo/"+keapId);
  const res = await env.KEAP_UTILITY.fetch(
    new Request(u.toString(), {
      method: "GET",
      headers: { "content-type": "application/json" }
    })
  );
  if (!res.ok) return { given_name: "", family_name: "" };
  const data = await res.json();
  return {
    given_name: data && data.given_name ? data.given_name : "",
    family_name: data && data.family_name ? data.family_name : ""
  };
}
__name(fetchContactNames, "fetchContactNames");
async function sendPushover(env, { title, message, priority = 0 }) {
  const body = new URLSearchParams({
    token: env.PUSHOVER_TOKEN,
    user: env.PUSHOVER_USER,
    device: env.PUSHOVER_DEVICE || "",
    title: title || "Notifica",
    message: message || "",
    priority: String(priority)
  });
  const res = await fetch("https://api.pushover.net/1/messages.json", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    console.warn("Pushover error:", res.status, t);
  }
}
__name(sendPushover, "sendPushover");
function formatInstantMessage(p) {
  const {
    status,
    center,
    isoOriginal,
    isoNew,
    valueCents,
    treatments,
    given_name,
    family_name,
  } = p;
  const euro = (valueCents / 100).toLocaleString("it-IT", {
    style: "currency",
    currency: "EUR"
  });
  const lines = [
    `\u{1F4CC} ${status.toUpperCase()} \u2014 ${center}`,
    `\u{1F464} ${given_name || "?"} ${family_name || ""} `,
    `\u{1F4B6} Valore: ${euro}`,
    `\u{1F5D3}\uFE0F Data originaria: ${isoOriginal || "-"}`,
    status === "rinvio" ? `\u27A1\uFE0F Nuova data: ${isoNew || "-"}` : "\u274C Annullato",
    treatments ? `\u{1F486} Trattamenti: ${treatments}` : null
  ].filter(Boolean);
  return lines.join("\n");
}
__name(formatInstantMessage, "formatInstantMessage");
function buildSummary(rows) {
  const byCenter = /* @__PURE__ */ new Map();
  let totalCount = 0;
  let totalValue = 0;
  for (const r of rows) {
    const key = r.center;
    if (!byCenter.has(key)) {
      byCenter.set(key, {
        rinvio: { count: 0, value: 0 },
        annullamento: { count: 0, value: 0 },
        total: { count: 0, value: 0 }
      });
    }
    const b = byCenter.get(key);
    const v = Number(r.value_cents || 0);
    if (r.status === "rinvio") {
      b.rinvio.count += 1;
      b.rinvio.value += v;
    } else {
      b.annullamento.count += 1;
      b.annullamento.value += v;
    }
    b.total.count += 1;
    b.total.value += v;
    totalCount += 1;
    totalValue += v;
  }
  return {
    centers: [...byCenter.entries()].map(([center, v]) => ({ center, ...v })),
    total: { count: totalCount, value: totalValue }
  };
}
__name(buildSummary, "buildSummary");
function formatDailySummary(localDay, summary) {
  const lines = [];
  lines.push(`\u{1F5D3}\uFE0F Riepilogo ${localDay} (Europe/Rome)`);
  lines.push("");
  if (!summary.centers.length) {
    lines.push("Nessun rinvio/annullamento registrato oggi.");
  } else {
    for (const c of summary.centers) {
      const totEuro = (c.total.value / 100).toLocaleString("it-IT", {
        style: "currency",
        currency: "EUR"
      });
      const rinvEuro = (c.rinvio.value / 100).toLocaleString("it-IT", {
        style: "currency",
        currency: "EUR"
      });
      const annuEuro = (c.annullamento.value / 100).toLocaleString("it-IT", {
        style: "currency",
        currency: "EUR"
      });
      lines.push(`\u{1F3EC} ${c.center}`);
      lines.push(` \u2022 Rinvii: ${c.rinvio.count} \u2014 ${rinvEuro}`);
      lines.push(` \u2022 Annullamenti: ${c.annullamento.count} \u2014 ${annuEuro}`);
      lines.push(` \u2022 Totale: ${c.total.count} \u2014 ${totEuro}`);
      lines.push("");
    }
    const allEuro = (summary.total.value / 100).toLocaleString("it-IT", {
      style: "currency",
      currency: "EUR"
    });
    lines.push(`\u{1F522} TOTALE GIORNO: ${summary.total.count} eventi \u2014 ${allEuro}`);
  }
  return lines.join("\n");
}
__name(formatDailySummary, "formatDailySummary");
export {
  index_default as default
};
//# sourceMappingURL=index.js.map

--cca1d7aa80229ac08a11e44fdcbe96c185bd972b46dbe2cbf81400d1eb91--
