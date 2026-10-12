const CACHE_NAME = 'andalan-express-v2.02'; // naikkan versi

const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icons/logo.jpg',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// Install → cache file + langsung aktif
self.addEventListener('install', event => {
  self.skipWaiting(); // ← WAJIB
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Activate → hapus cache lama + ambil kontrol semua tab
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim()) // ← WAJIB
  );
});

// Fetch → network-first untuk HTML, cache-first untuk sisanya
self.addEventListener('fetch', event => {
  const req = event.request;

  // Untuk navigasi/HTML → selalu ambil dari network dulu
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
    );
    return;
  }

  // File lain → cache dulu, fallback network
  event.respondWith(
    caches.match(req).then(res => res || fetch(req))
  );
});