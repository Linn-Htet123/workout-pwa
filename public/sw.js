/* ---------------------------------------------------------------------------
 * Hand-written service worker.
 *
 * Goal: the app opens even on bad gym wifi. We cache the "app shell" (pages
 * and the built JS/CSS) as it is used, then serve from cache when the network
 * is slow or down.
 *
 * Strategy:
 *   - Navigations (opening a page): network first, fall back to cache, then to
 *     a cached page as a last resort. Keeps you online-fresh but offline-safe.
 *   - Static assets (/_next/static, icons, manifest): cache first. These files
 *     are versioned by Next, so cache-first is safe and fast.
 * ------------------------------------------------------------------------- */

// Bump this version string whenever you ship changes — the old cache is
// deleted on activate, so you never get stuck on a stale copy.
const CACHE = "workout-cache-v2";
const APP_SHELL = ["/", "/workout", "/manifest.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(APP_SHELL))
      .catch(() => {
        // If one URL fails to cache, don't block install.
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

function isStaticAsset(url) {
  return (
    url.pathname.startsWith("/_next/static") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname === "/manifest.json"
  );
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle GET requests from our own origin.
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Navigations: network first, cache fallback.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
          return res;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          return cached || (await caches.match("/")) || Response.error();
        })
    );
    return;
  }

  // Static assets: cache first, then network (and fill the cache).
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
          return res;
        });
      })
    );
    return;
  }

  // Everything else: try network, fall back to cache if present.
  event.respondWith(
    fetch(request).catch(() => caches.match(request).then((c) => c || Response.error()))
  );
});
