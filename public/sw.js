const CACHE_NAME = "indigorx-static-v1";
const STATIC_ASSETS = ["/", "/icons/icon-192.png", "/icons/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
        )
      )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Never cache cross-origin or API calls — patient/prescription data must
  // always be fetched fresh, never served from an offline cache.
  if (url.origin !== self.location.origin || url.pathname.startsWith("/api/")) {
    return;
  }

  // Static build assets and icons: cache-first for fast repeat loads.
  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/icons/")) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        });
      })
    );
    return;
  }

  // Page navigations: network-first, falling back to a cached copy, then a
  // minimal offline notice if nothing is available.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() =>
          caches.match(request).then(
            (cached) =>
              cached ||
              new Response(
                "<!doctype html><html><head><meta charset=\"utf-8\"><title>Offline</title></head><body style=\"font-family: sans-serif; text-align: center; padding: 4rem 1rem; color: #374151;\"><h1>You're offline</h1><p>Please reconnect to the internet to use IndigoRx.</p></body></html>",
                { headers: { "Content-Type": "text/html" } }
              )
          )
        )
    );
  }
});
