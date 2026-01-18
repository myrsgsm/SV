const CACHE_NAME = 'royal-stock-v3';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// 1. Install Service Worker & Cache Files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. Activate & Delete Old Caches (Update Logic)
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Delete old versions (v1, v2 etc)
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 3. Fetch Strategy (Cache First, Network Fallback)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Agar cache me file mili to wahi de do
        if (response) {
          return response;
        }
        // Nahi to internet se lao
        return fetch(event.request);
      })
  );
});