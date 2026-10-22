/**
 * SPC Fire College — Service Worker
 * Version: v8.8.0 (Mobile polish) (v2: role logins, offline-first Firestore, hybrid UI)
 * Caches the app shell so the tracker opens with no signal at all.
 * Evaluation data itself lives in Firestore's on-device persistent cache
 * and uploads automatically when connectivity returns.
 */
const CACHE_NAME = 'spc-fire-academy-v16';
const ASSETS_TO_CACHE = [
  './index.html',
  './manifest.json',
  './manual.pdf',
  './spc-logo.jpg',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) => Promise.all(names.map((c) => { if (c !== CACHE_NAME) return caches.delete(c); })))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request).then((res) => {
      // Runtime-cache same-origin files (icons, manual, shell) so they work offline after first view
      if (res && res.ok && new URL(event.request.url).origin === self.location.origin) {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((c) => c.put(event.request, copy)).catch(() => {});
      }
      return res;
    }).catch(() => caches.match(event.request, { ignoreSearch: true }))
  );
});
