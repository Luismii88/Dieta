self.addEventListener("install", event => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  console.log("NutriApp active");
});