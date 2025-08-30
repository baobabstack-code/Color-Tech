// Service Worker for Advanced Image Caching
const CACHE_NAME = 'image-cache-v1';
const IMAGE_CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

// Install event
self.addEventListener('install', (event) => {
    console.log('Image cache service worker installed');
    self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
    console.log('Image cache service worker activated');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch event - handle image requests
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Only handle image requests
    if (isImageRequest(event.request)) {
        event.respondWith(handleImageRequest(event.request));
    }
});

function isImageRequest(request) {
    const url = new URL(request.url);
    const pathname = url.pathname.toLowerCase();

    // Check for image file extensions
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg'];
    const hasImageExtension = imageExtensions.some(ext => pathname.endsWith(ext));

    // Check for Cloudinary or other CDN image URLs
    const isCloudinaryImage = url.hostname.includes('cloudinary.com');
    const isNextImageOptimized = pathname.startsWith('/_next/image');

    // Check Accept header
    const acceptsImages = request.headers.get('accept')?.includes('image/');

    return hasImageExtension || isCloudinaryImage || isNextImageOptimized || acceptsImages;
}

async function handleImageRequest(request) {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);

    // Return cached version if available and not expired
    if (cachedResponse) {
        const cachedDate = cachedResponse.headers.get('sw-cached-date');
        if (cachedDate) {
            const cacheAge = Date.now() - parseInt(cachedDate);
            if (cacheAge < IMAGE_CACHE_DURATION) {
                console.log('Serving cached image:', request.url);
                return cachedResponse;
            }
        }
    }

    try {
        // Fetch from network
        console.log('Fetching image from network:', request.url);
        const networkResponse = await fetch(request);

        // Only cache successful responses
        if (networkResponse.ok) {
            // Clone the response to cache it
            const responseToCache = networkResponse.clone();

            // Add cache timestamp
            const headers = new Headers(responseToCache.headers);
            headers.set('sw-cached-date', Date.now().toString());

            const cachedResponse = new Response(responseToCache.body, {
                status: responseToCache.status,
                statusText: responseToCache.statusText,
                headers: headers
            });

            // Cache the response
            cache.put(request, cachedResponse);
        }

        return networkResponse;
    } catch (error) {
        console.error('Failed to fetch image:', request.url, error);

        // Return cached version even if expired as fallback
        if (cachedResponse) {
            console.log('Serving expired cached image as fallback:', request.url);
            return cachedResponse;
        }

        // Return a placeholder image or error response
        return new Response('Image not available', {
            status: 404,
            statusText: 'Not Found'
        });
    }
}

// Handle messages from the main thread
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'PRELOAD_IMAGES') {
        preloadImages(event.data.urls);
    } else if (event.data && event.data.type === 'CLEAR_IMAGE_CACHE') {
        clearImageCache();
    }
});

async function preloadImages(urls) {
    const cache = await caches.open(CACHE_NAME);

    for (const url of urls) {
        try {
            const request = new Request(url);
            const cachedResponse = await cache.match(request);

            if (!cachedResponse) {
                console.log('Preloading image:', url);
                const response = await fetch(request);

                if (response.ok) {
                    const headers = new Headers(response.headers);
                    headers.set('sw-cached-date', Date.now().toString());

                    const cachedResponse = new Response(response.body, {
                        status: response.status,
                        statusText: response.statusText,
                        headers: headers
                    });

                    await cache.put(request, cachedResponse);
                }
            }
        } catch (error) {
            console.error('Failed to preload image:', url, error);
        }
    }
}

async function clearImageCache() {
    try {
        await caches.delete(CACHE_NAME);
        console.log('Image cache cleared');
    } catch (error) {
        console.error('Failed to clear image cache:', error);
    }
}