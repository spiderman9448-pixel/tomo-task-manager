// Travel outfit planner — network-first SW that ensures fresh content
const SW_VERSION = 'travel-v1';

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.map((n) => caches.delete(n)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  // Skip Firebase / Google API requests
  if (url.host.includes('firebaseio.com') || url.host.includes('googleapis.com') || url.host.includes('gstatic.com') || url.host.includes('firebaseapp.com')) return;
  e.respondWith(fetch(e.request).catch(() => Response.error()));
});

self.addEventListener('message', (e) => {
  if (e.data === 'skipWaiting') self.skipWaiting();
});
