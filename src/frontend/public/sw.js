const CACHE_NAME = 'agendou-v1';
const ASSETS = [
  '/',
  '/index.html'
  // adicione aqui css/js/imagens críticos se desejar
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  // estratégia: tentar rede, se falhar tentar cache, se cache vazio responder 504
  e.respondWith((async () => {
    try {
      const netRes = await fetch(req);
      return netRes;
    } catch (err) {
      const cached = await caches.match(req);
      if (cached) return cached;
      return new Response('Gateway: resource not available', { status: 504, statusText: 'Gateway Timeout' });
    }
  })());
});