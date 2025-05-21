// Service worker
const CACHE_NAME = "memo-app-cache-v4";

// Install event - do not wait for clients restart
self.addEventListener("install", (event) => {
  event.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return response
      if (response) {
        return response;
      }

      // Clone the request
      const fetchRequest = event.request.clone();

      return fetch(fetchRequest).then((response) => {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          // If the scheme is not http or https, don't cache
          if (
            !event.request.url.startsWith("http") &&
            !event.request.url.startsWith("https")
          ) {
            return;
          }

          // API requests should not be cached
          if (event.request.url.includes("/api/")) {
            return;
          }

          // Root path should not be cached
          if (new URL(event.request.url).pathname === "/") {
            return;
          }

          // If the request is not a GET request, don't cache
          if (event.request.method !== "GET") {
            return;
          }

          // Cache the response
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});
