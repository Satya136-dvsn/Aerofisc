// BudgetWise Service Worker
// Version: 1.0.1 (Dev Fix)

const CACHE_NAME = 'budgetwise-v1';
const STATIC_CACHE_NAME = 'budgetwise-static-v1';
const DYNAMIC_CACHE_NAME = 'budgetwise-dynamic-v1';

// Static assets to cache on install
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/offline.html'
];

// API routes that should always go to network
const NETWORK_ONLY_ROUTES = [
    '/api/auth/',
    '/api/transactions',
    '/api/budgets',
    '/api/goals',
    '/api/dashboard'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('[ServiceWorker] Install');

    event.waitUntil(
        caches.open(STATIC_CACHE_NAME)
            .then((cache) => {
                console.log('[ServiceWorker] Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[ServiceWorker] Activate');

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((cacheName) => {
                            return cacheName.startsWith('budgetwise-') &&
                                cacheName !== STATIC_CACHE_NAME &&
                                cacheName !== DYNAMIC_CACHE_NAME;
                        })
                        .map((cacheName) => {
                            console.log('[ServiceWorker] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        })
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch event - network-first for API, cache-first for static
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // 1. SKIP non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // 2. SKIP non-http/https schemes (extensions, etc)
    if (!url.protocol.startsWith('http')) {
        return;
    }

    // 3. SKIP Vite Development Resources (CRITICAL for localhost)
    // Exclude: node_modules, src, @vite, @react-refresh, *.jsx, *.tsx, hot-updates
    const isDevResource =
        url.pathname.includes('node_modules') ||
        url.pathname.includes('/src/') ||
        url.pathname.includes('/@') ||
        url.search.includes('t=') ||
        url.pathname.endsWith('.jsx') ||
        url.pathname.endsWith('.tsx') ||
        url.pathname.endsWith('.ts');

    if (isDevResource) {
        return; // Let browser handle network request
    }

    // 4. API Routes: Network-only
    if (NETWORK_ONLY_ROUTES.some((route) => url.pathname.startsWith(route))) {
        event.respondWith(
            fetch(request)
                .catch(() => {
                    return caches.match(request);
                })
        );
        return;
    }

    // 5. Static Assets: Cache-first (Stale-while-revalidate)
    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                // Network fetch for update
                const fetchPromise = fetchAndCache(request).catch(err => {
                    if (cachedResponse) return cachedResponse;
                    // If strictly a document navigation and failed, show offline
                    if (request.destination === 'document') {
                        return caches.match('/offline.html');
                    }
                    // Otherwise throw to let browser show error
                    throw err;
                });

                // Return cached if available, but update in background
                if (cachedResponse) {
                    event.waitUntil(fetchPromise.catch(() => { }));
                    return cachedResponse;
                }

                return fetchPromise;
            })
    );
});

// Fetch and cache helper
async function fetchAndCache(request) {
    try {
        const response = await fetch(request);

        // Only cache valid http/https responses
        if (response && response.status === 200 && response.type === 'basic') {
            const cache = await caches.open(DYNAMIC_CACHE_NAME);
            cache.put(request, response.clone());
        }

        return response;
    } catch (error) {
        console.log('[ServiceWorker] Fetch failed:', error);
        throw error;
    }
}

// Update cache in background
async function updateCache(request) {
    try {
        const response = await fetch(request);

        if (response && response.status === 200 && response.type === 'basic') {
            const cache = await caches.open(DYNAMIC_CACHE_NAME);
            cache.put(request, response.clone());
        }
    } catch (error) {
        // Silently fail - we already have cached version
    }
}

// Handle push notifications
self.addEventListener('push', (event) => {
    const options = {
        body: event.data?.text() || 'New notification from BudgetWise',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            { action: 'explore', title: 'View Details' },
            { action: 'close', title: 'Close' }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('BudgetWise', options)
    );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/dashboard')
        );
    }
});

// Background sync
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-transactions') {
        event.waitUntil(syncTransactions());
    }
});

async function syncTransactions() {
    console.log('[ServiceWorker] Syncing transactions...');
}
