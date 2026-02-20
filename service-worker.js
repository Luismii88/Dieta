// ===============================
// NutriApp Service Worker
// Production Ready (Safe Version)
// ===============================

const CACHE_NAME = "nutriapp-v1";

// Archivos que queremos cachear para que funcione como app
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.PNG",
  "./icon-512.PNG",
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
];

// INSTALACIÓN
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// ACTIVACIÓN
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// FETCH (Estrategia inteligente)
// - Archivos estáticos → cache-first
// - Firebase / API calls → network-first
self.addEventListener("fetch", (event) => {

  // No interferir con Firebase ni peticiones dinámicas
  if (event.request.url.includes("firebase") || 
      event.request.url.includes("firestore") ||
      event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return (
        cachedResponse ||
        fetch(event.request).then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
      );
    })
  );
});