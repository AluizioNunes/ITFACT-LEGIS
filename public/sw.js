/// <reference lib="webworker" />

const CACHE_NAME = 'itfact-legis-v1';
const STATIC_ASSETS = [
    '/',
    '/dashboard',
    '/dashboard/sessoes/painel',
    '/dashboard/sessoes/presenca',
    '/dashboard/proposituras',
    '/manifest.json',
];

// Install — cache estáticos
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate — limpa caches antigos
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
        )
    );
    self.clients.claim();
});

// Fetch — Network First para API, Cache First para estáticos
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // API calls — sempre network first
    if (url.pathname.startsWith('/api') || url.pathname.startsWith('/portal') || url.pathname.startsWith('/sessao-ao-vivo')) {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    // Cache GET requests que retornam 200
                    if (event.request.method === 'GET' && response.status === 200) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                    }
                    return response;
                })
                .catch(() => caches.match(event.request))
        );
        return;
    }

    // Static assets — cache first
    event.respondWith(
        caches.match(event.request).then((cached) => {
            if (cached) return cached;
            return fetch(event.request).then((response) => {
                if (response.status === 200) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                }
                return response;
            });
        })
    );
});

// Push notifications — session alerts
self.addEventListener('push', (event) => {
    const data = event.data?.json() || {};
    const options = {
        body: data.body || 'Nova movimentação legislativa',
        icon: '/icon-192.png',
        badge: '/icon-badge.png',
        tag: data.tag || 'legis-update',
        data: { url: data.url || '/dashboard' },
        actions: [
            { action: 'open', title: 'Abrir' },
            { action: 'dismiss', title: 'Dispensar' },
        ],
    };
    event.waitUntil(self.registration.showNotification(data.title || 'ITFACT-LEGIS', options));
});

// Notification click
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    if (event.action === 'open' || !event.action) {
        event.waitUntil(self.clients.openWindow(event.notification.data.url));
    }
});
