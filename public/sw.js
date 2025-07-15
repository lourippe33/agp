const CACHE_NAME = 'agp-chrono-v1.0.0';
const STATIC_CACHE_URLS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/assets/images/icon.png',
  '/assets/images/favicon.png',
  '/manifest.json'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Installation');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Service Worker: Mise en cache des ressources statiques');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        console.log('✅ Service Worker: Installation terminée');
        return self.skipWaiting();
      })
  );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: Activation');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Service Worker: Suppression ancien cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker: Activation terminée');
      return self.clients.claim();
    })
  );
});

// Stratégie de cache : Cache First pour les ressources statiques, Network First pour les données
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorer les requêtes non-HTTP
  if (!request.url.startsWith('http')) {
    return;
  }

  // Cache First pour les ressources statiques
  if (
    request.destination === 'image' ||
    request.destination === 'script' ||
    request.destination === 'style' ||
    url.pathname.includes('/assets/') ||
    url.pathname.includes('/static/')
  ) {
    event.respondWith(
      caches.match(request)
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(request).then((response) => {
            // Mettre en cache les nouvelles ressources
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return response;
          });
        })
        .catch(() => {
          // Fallback pour les images
          if (request.destination === 'image') {
            return caches.match('/assets/images/icon.png');
          }
        })
    );
    return;
  }

  // Network First pour les pages et données
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Mettre en cache les pages réussies
        if (response.status === 200 && request.method === 'GET') {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback vers le cache
        return caches.match(request).then((response) => {
          if (response) {
            return response;
          }
          // Fallback vers la page d'accueil pour les routes
          if (request.mode === 'navigate') {
            return caches.match('/');
          }
        });
      })
  );
});

// Gestion des messages du client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Notification de mise à jour disponible
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});