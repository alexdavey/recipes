/* Minimal app-shell service worker for offline-ish use.
   Keep this conservative to avoid surprising caching behavior. */

const CACHE_NAME = "recipe-book-v1";

function urlFromScope(relativePath) {
  return new URL(relativePath, self.registration.scope).toString();
}

const CORE_ASSETS = [
  urlFromScope(""),
  urlFromScope("index.html"),
  urlFromScope("stylesheet.css"),
  urlFromScope("recipe-steps.js"),
  urlFromScope("manifest.webmanifest"),
  urlFromScope("icons/icon.svg")
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => {});
          return response;
        })
        .catch(() => cached);
    })
  );
});

