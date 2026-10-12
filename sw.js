const CACHE_NAME = 'andalan-express-v2.01';  // ← ubah dari v1 ke v2
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icons/logo.jpg',
  './icons/icon-192.png',
  './icons/icon-512.png'
];
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) return response;
        return fetch(event.request);
      })
  );
});