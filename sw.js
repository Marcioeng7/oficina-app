const CACHE_NAME = 'oficina-v4'; 
const ASSETS = [
  '/oficina-app/',
  '/oficina-app/index.html',
  '/oficina-app/manifest.json',
  '/oficina-app/icon-192.png',
  '/oficina-app/icon-512.png'
];

// Instala e força o novo Service Worker a assumir o controle imediatamente
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Remove caches antigos (v1, v2, v3) e limpa a memória do celular
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Busca os arquivos atualizados
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});
