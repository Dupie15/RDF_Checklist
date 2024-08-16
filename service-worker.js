const CACHE_NAME = 'checklist-cache-v1';
const urlsToCache = [
    '/',
    '/rdf_daily.html',
    '/styles.css',
    '/script.js',
    '/manifest.json',
    '/icon-192x192.png',
    '/site_map.png'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                return response || fetch(event.request);
            })
    );
});

self.addEventListener('sync', function(event) {
    if (event.tag === 'syncChecklists') {
        event.waitUntil(syncChecklists());
    }
});

function syncChecklists() {
    // Sync logic as in script.js
}
