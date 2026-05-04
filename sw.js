// Service Worker — Casa Caipira PDV
// Permite uso offline após primeiro acesso
const CACHE = 'casacaipira-pdv-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700;800&family=Lato:wght@300;400;700&display=swap'
];

self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(cache){
      return cache.addAll(ASSETS).catch(function(){ return; });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.filter(function(k){ return k !== CACHE; })
            .map(function(k){ return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e){
  e.respondWith(
    caches.match(e.request).then(function(cached){
      return cached || fetch(e.request).catch(function(){
        return caches.match('./index.html');
      });
    })
  );
});
