/**
 * Service Worker for Multiplication Adventure
 * Enhanced for Android tablet PWA compatibility
 */

const CACHE_NAME = 'multi-adv-cache-v1';
const APP_SHELL = [
  './',
  './index.html',
  './styles.css',
  './css/flipCardGame.css',
  './manifest.json'
];

const ASSETS = [
  './js/core.js',
  './js/ui.js',
  './js/practice.js',
  './js/confetti.js',
  './js/confetti-fix.js',
  './js/soundManager.js',
  './js/soundCheck.js',
  './js/createSounds.js',
  './js/game.js',
  './js/settings.js',
  './js/flipCardGame.js',
  './js/assessment.js',
  './js/rewards.js',
  './js/tableReference.js',
  './js/mathUtils.js',
  './js/multiplicationTables.js',
  './images/icon-192.png',
  './images/icon-512.png',
  './images/dancing_dog.gif'
];

// Combine app shell (critical resources) and assets
const RESOURCES_TO_CACHE = APP_SHELL.concat(ASSETS);

// Install event - cache assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching app shell and assets...');
        return cache.addAll(RESOURCES_TO_CACHE);
      })
      .then(() => {
        console.log('Service Worker: All resources cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Cache failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Service Worker: Clearing old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Now ready to handle fetches');
        return self.clients.claim();
      })
  );
});

// Fetch event with network-first strategy for dynamic content,
// cache-first for app shell and static assets
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests like CDN resources
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Parse the URL
  const requestURL = new URL(event.request.url);
  
  // App shell resources - cache first strategy
  if (APP_SHELL.includes(requestURL.pathname) || 
      requestURL.pathname.startsWith('/css/') ||
      requestURL.pathname.startsWith('/js/') ||
      requestURL.pathname.startsWith('/images/')) {
    
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          return fetch(event.request)
            .then((response) => {
              // Don't cache responses that aren't successful
              if (!response || response.status !== 200) {
                return response;
              }
              
              // Cache the new resource
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
                
              return response;
            })
            .catch(() => {
              // Return offline page if network fails
              if (event.request.mode === 'navigate') {
                return caches.match('./index.html');
              }
            });
        })
    );
  } else {
    // For other requests, try network first, then cache
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200) {
            return response;
          }
          
          // Cache the new resource
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
            
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
  }
});

// Handle push notifications (if needed in future)
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);
  // Handle push notification
});

console.log('Advanced Service Worker loaded');
