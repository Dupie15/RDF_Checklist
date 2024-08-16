const CACHE_NAME = 'checklist-cache-v1';
const urlsToCache = [
    '/',
    '/RDF_Checklist/index.html',  // Updated to reflect the new file name
    '/RDF_Checklist/styles.css',
    '/RDF_Checklist/script.js',
    '/RDF_Checklist/manifest.json',
    '/RDF_Checklist/icon-192x192.png',
    '/RDF_Checklist/site_map.png'
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
