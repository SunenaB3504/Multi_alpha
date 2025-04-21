/**
 * Service Worker for Multiplication Adventure
 * Simplified and reliable caching strategy
 */

const CACHE_NAME = 'multiplication-adventure-v1';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './css/flipCardGame.css',
  './js/core.js',
  './js/ui.js',
  './js/rewards.js',
  './js/assessment.js',
  './js/game.js',
  './js/settings.js',
  './js/practice.js',
  './js/tableReference.js',
  './js/flipCardGame.js',
  './js/confetti.js',
  './js/confetti-fix.js',
  './js/soundManager.js',
  './js/soundCheck.js',
  './js/createSounds.js',
  './js/multiplicationTables.js',
  './js/mathUtils.js',
  './js/debug.js',
  './js/practice-fix.js',
  './js/card-display-fix.js',
  './js/practice-button-fix.js',
  './js/custom-practice-debug.js',
  './js/direct-practice-override.js',
  './images/icon-192.png',
  './images/icon-512.png',
  './images/dancing_dog.gif'
];

// Install event - cache all static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching app assets');
        return cache.addAll(ASSETS);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName !== CACHE_NAME;
        }).map(cacheName => {
          console.log('Deleting old cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    })
  );
});

// Fetch event - serve from cache if available, otherwise fetch from network
self.addEventListener('fetch', event => {
  // Skip non-GET requests or HEAD requests
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached response if found
        if (response) {
          return response;
        }
        
        // Otherwise fetch from network
        return fetch(event.request)
          .then(networkResponse => {
            // Don't cache responses from external domains or HEAD requests
            if (!event.request.url.startsWith(self.location.origin) || 
                networkResponse.type === 'opaque' || 
                event.request.method === 'HEAD') {
              return networkResponse;
            }
            
            // Only cache successful responses
            if (!networkResponse || networkResponse.status !== 200) {
              return networkResponse;
            }
            
            try {
              // Cache the response for future requests
              let responseCopy = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseCopy);
                })
                .catch(err => console.error('Cache put error:', err));
            } catch (error) {
              console.error('Caching error:', error);
            }
              
            return networkResponse;
          })
          .catch(error => {
            console.error('Fetch failed:', error);
            // You could return a custom offline page here
          });
      })
  );
});
