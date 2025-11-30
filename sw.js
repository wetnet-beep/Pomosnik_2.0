const CACHE_NAME = 'school-app-v1.2';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/app.js',
    '/manifest.json'
];

// Установка Service Worker
self.addEventListener('install', function(event) {
    console.log('Service Worker: Установка');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Service Worker: Кэширование файлов');
                return cache.addAll(urlsToCache);
            })
            .then(function() {
                console.log('Service Worker: Все файлы закэшированы');
                return self.skipWaiting();
            })
    );
});

// Активация Service Worker
self.addEventListener('activate', function(event) {
    console.log('Service Worker: Активация');
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Удаление старого кэша', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(function() {
            console.log('Service Worker: Активирован');
            return self.clients.claim();
        })
    );
});

// Перехват запросов
self.addEventListener('fetch', function(event) {
    console.log('Service Worker: Запрос', event.request.url);
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Возвращаем кэшированную версию или загружаем из сети
                if (response) {
                    console.log('Service Worker: Используется кэш для', event.request.url);
                    return response;
                }
                
                console.log('Service Worker: Загрузка из сети', event.request.url);
                return fetch(event.request).then(function(response) {
                    // Проверяем валидный ли ответ
                    if(!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    
                    // Клонируем ответ
                    var responseToCache = response.clone();
                    
                    caches.open(CACHE_NAME)
                        .then(function(cache) {
                            cache.put(event.request, responseToCache);
                        });
                    
                    return response;
                });
            }).catch(function() {
                // Fallback для offline режима
                console.log('Service Worker: Offline режим');
                return new Response('Оффлайн режим');
            })
    );
});