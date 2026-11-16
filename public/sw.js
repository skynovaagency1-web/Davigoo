// DaviGoo service worker: lets the installed app open offline and load fast.
// Pages: network first, cached copy when offline. Hashed build files (/assets/*), icons, fonts: cache first.
// The API (/api/*) is never cached.
const VERSION = "davigoo-v1";
const SHELL = ["/", "/comment-ca-marche", "/trajets", "/securite", "/chauffeurs", "/faq", "/manifest.webmanifest", "/icons/icon-192.png"];

self.addEventListener("install", (event) => {
  // Cache the main pages and the build files they load, so they open offline even if never visited.
  event.waitUntil(
    (async () => {
      const c = await caches.open(VERSION);
      await c.addAll(SHELL).catch(() => {});
      const assets = new Set();
      for (const page of SHELL.filter((u) => !u.includes("."))) {
        const res = await c.match(page);
        const html = res ? await res.text() : "";
        for (const m of html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)) assets.add(m[1]);
      }
      await c.addAll([...assets]).catch(() => {});
    })(),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  if (sameOrigin && (url.pathname.startsWith("/api/") || url.pathname.startsWith("/ops"))) return;

  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) caches.open(VERSION).then((c) => c.put(req, res.clone()));
          return res;
        })
        .catch(async () => (await caches.match(req, { ignoreSearch: true })) || (await caches.match("/")) || Response.error()),
    );
    return;
  }

  const cacheFirst =
    (sameOrigin && (url.pathname.startsWith("/assets/") || url.pathname.startsWith("/icons/") || url.pathname.startsWith("/places/"))) ||
    url.hostname === "fonts.googleapis.com" ||
    url.hostname === "fonts.gstatic.com";
  if (cacheFirst) {
    event.respondWith(
      caches.match(req, { ignoreVary: true }).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            if (res.ok || res.type === "opaque") caches.open(VERSION).then((c) => c.put(req, res.clone()));
            return res;
          }),
      ),
    );
  }
});

// Push notifications (news, opening of the pilot). The payload is JSON: { title, body, url }.
self.addEventListener("push", (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch { data = { body: event.data && event.data.text() }; }
  event.waitUntil(
    self.registration.showNotification(data.title || "DaviGoo", {
      body: data.body || "",
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      data: { url: data.url || "/" },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((wins) => {
      for (const w of wins) if ("focus" in w) { w.navigate(url); return w.focus(); }
      return self.clients.openWindow(url);
    }),
  );
});
