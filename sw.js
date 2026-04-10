const CACHE_NAME = 'atlas-v1';
const assets = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/logo.png'
];

// Instalação
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// Busca de arquivos
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});
