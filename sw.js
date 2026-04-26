const CACHE_NAME = 'atlas-v2';
const assets = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/historicos-admin.js',
  '/atlas-ajustes-fachadas.js',
  '/firebase-atlas.js',
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

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
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
