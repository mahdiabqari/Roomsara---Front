self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("roomsara-cache").then((cache) => {
      return cache.addAll(["/", "/App", "/logo.png"]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
