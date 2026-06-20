const CACHE = 'fitplan-v2';
const BASE = '/fitness-pwa';
const ASSETS = [
  BASE + '/',
  BASE + '/index.html',
  BASE + '/styles.css',
  BASE + '/js/app.js',
  BASE + '/js/data.js',
  BASE + '/js/store.js',
  BASE + '/js/firebase.js',
  BASE + '/js/sync.js',
  BASE + '/js/screens/home.js',
  BASE + '/js/screens/plan.js',
  BASE + '/js/screens/workout.js',
  BASE + '/js/screens/history.js',
  BASE + '/manifest.json',
  BASE + '/icons/icon-192.svg',
  BASE + '/icons/icon-512.svg'
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
  // Don't cache Firebase API calls — they need live network
  if (e.request.url.includes('firestore.googleapis.com') ||
      e.request.url.includes('identitytoolkit.googleapis.com') ||
      e.request.url.includes('securetoken.googleapis.com') ||
      e.request.url.includes('gstatic.com/firebasejs')) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
