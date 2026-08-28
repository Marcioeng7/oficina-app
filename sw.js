const CACHE_NAME = 'oficina-v3'; 
const ASSETS = [
  '/oficina-app/',
  '/oficina-app/index.html',
  '/oficina-app/manifest.json'
];

// Instala o Service Worker e guarda os arquivos necessários no celular
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Ativa o Service Worker e limpa versões antigas do aplicativo
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
    })
  );
});

// Busca os arquivos do cache do celular quando a oficina estiver offline
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});
