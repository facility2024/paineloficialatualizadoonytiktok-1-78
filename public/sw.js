const CACHE_NAME = 'facility-admin-v1';
const VIDEO_CACHE = 'video-cache-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/lovable-uploads/d6487096-3582-4e46-830e-bd94cdfd798f.png',
  '/lovable-uploads/e93594ee-908d-46f2-a59d-4000b64079a4.png'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME && name !== VIDEO_CACHE) {
            return caches.delete(name);
          }
        })
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  const isVideo = request.destination === 'video' || /(\.mp4|\.webm|\.m3u8)(\?.*)?$/i.test(url.pathname);
  const isRange = request.headers.has('range');
  const isCDN = /tiktokonyfans\.b-cdn\.net$/i.test(url.hostname);

  if (isVideo && isCDN) {
    // Do not cache/handle range requests to avoid breaking streaming
    if (isRange) {
      event.respondWith(fetch(request));
      return;
    }

    event.respondWith(
      caches.open(VIDEO_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) {
          // Revalidate in background
          fetch(request).then((resp) => {
            if (resp && resp.ok) cache.put(request, resp.clone());
          }).catch(() => {});
          return cached;
        }
        const resp = await fetch(request);
        if (resp && resp.ok) {
          cache.put(request, resp.clone());
        }
        return resp;
      })
    );
    return;
  }

  // Default behavior: cache-first for app shell
  event.respondWith(
    caches.match(request).then(response => response || fetch(request))
  );
});