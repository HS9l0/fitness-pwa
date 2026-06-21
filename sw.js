const CACHE = 'fitplan-v39';
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
  BASE + '/js/screens/nutrition.js',
  BASE + '/js/screens/progress.js',
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
  // Don't cache live API calls
  if (e.request.url.includes('firestore.googleapis.com') ||
      e.request.url.includes('identitytoolkit.googleapis.com') ||
      e.request.url.includes('securetoken.googleapis.com') ||
      e.request.url.includes('gstatic.com/firebasejs') ||
      e.request.url.includes('generativelanguage.googleapis.com') ||
      e.request.url.includes('world.openfoodfacts.org') ||
      e.request.url.includes('youtube.com') ||
      e.request.url.includes('ytimg.com')) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
