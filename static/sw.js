/* Minimal app-shell service worker for offline-ish use.
   Keep this conservative to avoid surprising caching behavior. */

const CORE_CACHE = "recipe-book-core";
const RUNTIME_CACHE = "recipe-book-runtime";

function urlFromScope(relativePath) {
  return new URL(relativePath, self.registration.scope).toString();
}

const CORE_ASSETS = new Set([
  urlFromScope(""),
  urlFromScope("index.html"),
  urlFromScope("stylesheet.css"),
  urlFromScope("recipe-steps.js"),
  urlFromScope("manifest.webmanifest"),
  urlFromScope("apple-touch-icon.png")
]);

function isSameOrigin(request) {
  return new URL(request.url).origin === self.location.origin;
}

async function putInCache(cacheName, request, response) {
  if (!response) return;
  if (!response.ok) return;
  const cache = await caches.open(cacheName);
  await cache.put(request, response);
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  await putInCache(cacheName, request, response.clone());
  return response;
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request, { cache: "no-store" });
    await putInCache(cacheName, request, response.clone());
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    throw new Error("Network failed and no cached response");
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request)
    .then((response) => putInCache(cacheName, request, response.clone()).then(() => response))
    .catch(() => null);

  return cached ?? (await fetchPromise) ?? Response.error();
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CORE_CACHE)
      .then((cache) =>
        cache.addAll(
          [...CORE_ASSETS].map((url) => new Request(url, { cache: "reload" }))
        )
      )
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k.startsWith("recipe-book-") && k !== CORE_CACHE && k !== RUNTIME_CACHE)
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  if (!isSameOrigin(request)) return;

  const accepts = request.headers.get("accept") || "";
  const isNavigation = request.mode === "navigate" || accepts.includes("text/html");

  if (isNavigation) {
    event.respondWith(networkFirst(request, RUNTIME_CACHE));
    return;
  }

  const isCore = CORE_ASSETS.has(request.url);
  event.respondWith(staleWhileRevalidate(request, isCore ? CORE_CACHE : RUNTIME_CACHE));
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});
