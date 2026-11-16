// Web push for the installed DaviGoo app (news, opening of the pilot).
// No third-party service and nothing to configure: the VAPID key pair is created on first use and kept in
// the settings table. Pushes carry no payload (so no message encryption is needed); the service worker
// fetches the text from /api/push/latest when a push arrives.
import { requireStaff } from "./auth";
import { ApiError, b64url, body, clientIp, json, limit, nowIso, rows, str, type Env } from "./lib";

const TABLES = [
  `create table if not exists push_subscriptions (
    endpoint text primary key,
    created_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
  )`,
  `create table if not exists push_messages (
    id integer primary key autoincrement,
    title text not null,
    body text not null,
    url text not null default '/',
    sent integer not null default 0,
    created_by text,
    created_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
  )`,
];
let ready = false;
async function ensureTables(env: Env) {
  if (ready) return;
  await env.DB.batch(TABLES.map((t) => env.DB.prepare(t)));
  ready = true;
}

// Only real browser push services, so the Worker never posts to an arbitrary address.
const PUSH_HOSTS = [/^fcm\.googleapis\.com$/, /^updates\.push\.services\.mozilla\.com$/, /^web\.push\.apple\.com$/, /\.push\.apple\.com$/, /\.notify\.windows\.com$/];
function checkEndpoint(v: unknown) {
  const s = str(v, 1000, { required: true })!;
  let u: URL;
  try {
    u = new URL(s);
  } catch {
    throw new ApiError("bad_request");
  }
  if (u.protocol !== "https:" || !PUSH_HOSTS.some((re) => re.test(u.hostname))) throw new ApiError("bad_request");
  return s;
}

type Vapid = { key: CryptoKey; publicKey: string };
let vapidCache: Vapid | null = null;
async function vapid(env: Env): Promise<Vapid> {
  if (vapidCache) return vapidCache;
  let stored = (await env.DB.prepare("select value from settings where key = 'vapid_jwk'").first<{ value: string }>())?.value;
  if (!stored) {
    const pair = (await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"])) as CryptoKeyPair;
    const jwk = await crypto.subtle.exportKey("jwk", pair.privateKey);
    await env.DB.prepare("insert or ignore into settings (key, value) values ('vapid_jwk', ?)").bind(JSON.stringify(jwk)).run();
    stored = (await env.DB.prepare("select value from settings where key = 'vapid_jwk'").first<{ value: string }>())!.value;
  }
  const jwk = JSON.parse(stored) as JsonWebKey;
  const key = await crypto.subtle.importKey("jwk", jwk, { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]);
  const raw = (s: string) => Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4)), (c) => c.charCodeAt(0));
  const pub = new Uint8Array(65);
  pub[0] = 4;
  pub.set(raw(jwk.x!), 1);
  pub.set(raw(jwk.y!), 33);
  vapidCache = { key, publicKey: b64url(pub) };
  return vapidCache;
}

async function jwt(v: Vapid, audience: string) {
  const enc = (o: unknown) => b64url(new TextEncoder().encode(JSON.stringify(o)));
  const unsigned = `${enc({ typ: "JWT", alg: "ES256" })}.${enc({ aud: audience, exp: Math.floor(Date.now() / 1000) + 12 * 3600, sub: "https://davigoo.com" })}`;
  const sig = await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, v.key, new TextEncoder().encode(unsigned));
  return `${unsigned}.${b64url(sig)}`;
}

/** Sends an empty push to every subscriber; drops subscriptions the push service says are gone. */
async function pushAll(env: Env) {
  const v = await vapid(env);
  const subs = (await env.DB.prepare("select endpoint from push_subscriptions").all<{ endpoint: string }>()).results;
  const tokens = new Map<string, string>();
  let sent = 0;
  const gone: string[] = [];
  for (let i = 0; i < subs.length; i += 50) {
    await Promise.all(
      subs.slice(i, i + 50).map(async ({ endpoint }) => {
        const aud = new URL(endpoint).origin;
        if (!tokens.has(aud)) tokens.set(aud, await jwt(v, aud));
        try {
          const res = await fetch(endpoint, {
            method: "POST",
            headers: { Authorization: `vapid t=${tokens.get(aud)}, k=${v.publicKey}`, TTL: "86400", Urgency: "normal", "Content-Length": "0" },
          });
          if (res.status === 404 || res.status === 410) gone.push(endpoint);
          else if (res.ok) sent++;
        } catch {
          /* network error: keep the subscription, try next time */
        }
      }),
    );
  }
  if (gone.length) await env.DB.batch(gone.map((e) => env.DB.prepare("delete from push_subscriptions where endpoint = ?").bind(e)));
  return { sent, removed: gone.length, total: subs.length };
}

export async function pushRoutes(env: Env, req: Request, path: string): Promise<Response | null> {
  if (!path.startsWith("/api/push/") && path !== "/api/ops/push") return null;
  await ensureTables(env);
  const method = req.method;

  if (path === "/api/push/key" && method === "GET") return json({ key: (await vapid(env)).publicKey });

  if (path === "/api/push/subscribe" && method === "POST") {
    await limit(env, `push:${clientIp(req)}`, 20, 3600);
    const endpoint = checkEndpoint((await body(req)).endpoint);
    await env.DB.prepare("insert or ignore into push_subscriptions (endpoint) values (?)").bind(endpoint).run();
    return json({ ok: true }, 201);
  }

  if (path === "/api/push/unsubscribe" && method === "POST") {
    const endpoint = checkEndpoint((await body(req)).endpoint);
    await env.DB.prepare("delete from push_subscriptions where endpoint = ?").bind(endpoint).run();
    return json({ ok: true });
  }

  // Text shown by the service worker when a push arrives.
  if (path === "/api/push/latest" && method === "GET") {
    const m = await env.DB.prepare("select title, body, url from push_messages order by id desc limit 1").first();
    return json({ message: m ?? null }, 200, { "Cache-Control": "no-store" });
  }

  // Ops: see subscribers and past messages, send a new one.
  if (path === "/api/ops/push") {
    const a = await requireStaff(env, req);
    if (method === "GET") {
      const n = await env.DB.prepare("select count(*) as n from push_subscriptions").first<{ n: number }>();
      const messages = rows((await env.DB.prepare("select id, title, body, url, sent, created_at from push_messages order by id desc limit 10").all()).results);
      return json({ subscribers: n?.n ?? 0, messages });
    }
    if (method === "POST") {
      const b = await body(req);
      const title = str(b.title, 60, { required: true, min: 2 })!;
      const text = str(b.body, 180, { required: true, min: 2 })!;
      let url = str(b.url, 200) || "/";
      if (!url.startsWith("/") || url.startsWith("//")) url = "/";
      const ins = await env.DB.prepare("insert into push_messages (title, body, url, created_by, created_at) values (?, ?, ?, ?, ?)")
        .bind(title, text, url, a.user.id, nowIso()).run();
      const result = await pushAll(env);
      await env.DB.prepare("update push_messages set sent = ? where id = ?").bind(result.sent, ins.meta.last_row_id).run();
      return json(result);
    }
  }
  return null;
}
