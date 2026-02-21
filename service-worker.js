// ===============================
// NutriApp Service Worker
// Firebase Safe Version
// ===============================

const CACHE_NAME = "nutriapp-v2";

const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.PNG",
  "./icon-512.PNG"
];

// INSTALAR
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// ACTIVAR
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// FETCH
self.addEventListener("fetch", (event) => {

  const url = event.request.url;

  // 🔥 NO INTERFERIR CON FIREBASE
  if (
    url.includes("firebase") ||
    url.includes("firestore") ||
    url.includes("googleapis") ||
    url.includes("identitytoolkit") ||
    event.request.method !== "GET"
  ) {
    return;
  }

  // Cache-first solo para assets locales
  if (url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  }

});
