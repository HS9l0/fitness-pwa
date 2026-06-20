const CACHE = 'fitplan-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/js/app.js',
  '/js/data.js',
  '/js/store.js',
  '/js/screens/home.js',
  '/js/screens/plan.js',
  '/js/screens/workout.js',
  '/js/screens/history.js',
  '/manifest.json',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
