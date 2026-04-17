/**
 * SPC Fire Academy - Service Worker
 * Handles offline caching for the PWA shell and external assets.
 */

const CACHE_NAME = 'spc-fire-academy-v5';
const ASSETS_TO_CACHE = [
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap'
];

// Install Event: Caches the application shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  // Force the waiting service worker to become the active one
  self.skipWaiting();
});

// Activate Event: Cleans up old cache versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  // Ensure the service worker takes control of the page immediately
  self.clients.claim();
});

// Fetch Event: Network-first strategy with cache fallback
// Ideal for apps requiring real-time cloud data but needing UI availability offline
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // If successful, return the network response
        return response;
      })
      .catch(() => {
        // If network fails (offline), look for the file in the cache
        return caches.match(event.request);
      })
  );
});