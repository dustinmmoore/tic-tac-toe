const CACHE_NAME = 'tictactoe-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/assets/css/styles.css',
    '/assets/js/index.js',
    '/assets/images/tic-tac-toe.jpg'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS_TO_CACHE))
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});