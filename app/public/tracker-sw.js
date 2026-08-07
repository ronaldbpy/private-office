const CACHE = 'rb-tracker-v3';
const ASSETS = [
  '/tracker/',
  '/tracker/tracker.html',
  '/tracker/tracker-manifest.json'
];

self.addEventListener('install', ev => {
  ev.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS).catch(() => null)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', ev => {
  ev.waitUntil(caches.keys().then(names => Promise.all(names.filter(n => n !== CACHE).map(n => caches.delete(n)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', ev => {
  const url = new URL(ev.request.url);
  if (!url.pathname.startsWith('/tracker/')) return;
  if (ev.request.method !== 'GET') return;

  ev.respondWith(
    (url.pathname.endsWith('tracker.html') || url.pathname.endsWith('/tracker/')
      ? fetch(ev.request).then(r => r.ok ? (caches.open(CACHE).then(c => c.put(ev.request, r.clone())), r) : caches.match(ev.request))
      : caches.match(ev.request).then(r => r || fetch(ev.request).then(f => f.ok ? (caches.open(CACHE).then(c => c.put(ev.request, f.clone())), f) : f))
    ).catch(() => caches.match('/tracker/tracker.html'))
  );
});
