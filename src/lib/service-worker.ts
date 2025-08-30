import React from 'react';

/**
 * Service Worker utilities for image caching and performance optimization
 */

interface ServiceWorkerManager {
    register: () => Promise<ServiceWorkerRegistration | null>;
    preloadImages: (urls: string[]) => Promise<void>;
    clearImageCache: () => Promise<void>;
    isSupported: () => boolean;
}

class ImageCacheServiceWorker implements ServiceWorkerManager {
    private registration: ServiceWorkerRegistration | null = null;

    /**
     * Check if service workers are supported
     */
    isSupported(): boolean {
        return typeof window !== 'undefined' && 'serviceWorker' in navigator;
    }

    /**
     * Register the image cache service worker
     */
    async register(): Promise<ServiceWorkerRegistration | null> {
        if (!this.isSupported()) {
            console.warn('Service Workers are not supported in this browser');
            return null;
        }

        try {
            this.registration = await navigator.serviceWorker.register('/sw-image-cache.js', {
                scope: '/',
            });

            console.log('Image cache service worker registered successfully');

            // Handle updates
            this.registration.addEventListener('updatefound', () => {
                const newWorker = this.registration?.installing;
                if (newWorker) {
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            console.log('New image cache service worker available');
                            // Optionally notify user about update
                        }
                    });
                }
            });

            return this.registration;
        } catch (error) {
            console.error('Failed to register image cache service worker:', error);
            return null;
        }
    }

    /**
     * Preload images using the service worker
     */
    async preloadImages(urls: string[]): Promise<void> {
        if (!this.isSupported() || !navigator.serviceWorker.controller) {
            console.warn('Service worker not available for image preloading');
            return;
        }

        try {
            navigator.serviceWorker.controller.postMessage({
                type: 'PRELOAD_IMAGES',
                urls: urls
            });
            console.log(`Preloading ${urls.length} images via service worker`);
        } catch (error) {
            console.error('Failed to preload images:', error);
        }
    }

    /**
     * Clear the image cache
     */
    async clearImageCache(): Promise<void> {
        if (!this.isSupported() || !navigator.serviceWorker.controller) {
            console.warn('Service worker not available for cache clearing');
            return;
        }

        try {
            navigator.serviceWorker.controller.postMessage({
                type: 'CLEAR_IMAGE_CACHE'
            });
            console.log('Image cache cleared via service worker');
        } catch (error) {
            console.error('Failed to clear image cache:', error);
        }
    }

    /**
     * Get cache statistics
     */
    async getCacheStats(): Promise<{
        cacheSize: number;
        itemCount: number;
    } | null> {
        if (!this.isSupported()) return null;

        try {
            const cache = await caches.open('image-cache-v1');
            const keys = await cache.keys();

            let totalSize = 0;
            for (const request of keys) {
                const response = await cache.match(request);
                if (response) {
                    const blob = await response.blob();
                    totalSize += blob.size;
                }
            }

            return {
                cacheSize: totalSize,
                itemCount: keys.length
            };
        } catch (error) {
            console.error('Failed to get cache stats:', error);
            return null;
        }
    }
}

// Export singleton instance
export const imageServiceWorker = new ImageCacheServiceWorker();

/**
 * React hook for service worker functionality
 */
export function useImageServiceWorker() {
    const [isRegistered, setIsRegistered] = React.useState(false);
    const [cacheStats, setCacheStats] = React.useState<{
        cacheSize: number;
        itemCount: number;
    } | null>(null);

    React.useEffect(() => {
        // Register service worker on mount
        imageServiceWorker.register().then((registration) => {
            setIsRegistered(!!registration);
        });
    }, []);

    const preloadImages = React.useCallback(async (urls: string[]) => {
        await imageServiceWorker.preloadImages(urls);
    }, []);

    const clearCache = React.useCallback(async () => {
        await imageServiceWorker.clearImageCache();
        setCacheStats(null);
    }, []);

    const updateCacheStats = React.useCallback(async () => {
        const stats = await imageServiceWorker.getCacheStats();
        setCacheStats(stats);
    }, []);

    return {
        isRegistered,
        preloadImages,
        clearCache,
        cacheStats,
        updateCacheStats,
        isSupported: imageServiceWorker.isSupported()
    };
}

/**
 * Utility for critical resource hints
 */
export function addResourceHints(images: Array<{
    src: string;
    priority?: 'high' | 'low';
    sizes?: string;
}>) {
    if (typeof document === 'undefined') return;

    images.forEach(({ src, priority = 'low', sizes }) => {
        // Add preload link
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'preload';
        preloadLink.as = 'image';
        preloadLink.href = src;

        if (priority === 'high') {
            preloadLink.setAttribute('fetchpriority', 'high');
        }

        if (sizes) {
            preloadLink.setAttribute('imagesizes', sizes);
        }

        document.head.appendChild(preloadLink);

        // Add DNS prefetch for external domains
        const url = new URL(src, window.location.origin);
        if (url.origin !== window.location.origin) {
            const dnsLink = document.createElement('link');
            dnsLink.rel = 'dns-prefetch';
            dnsLink.href = url.origin;
            document.head.appendChild(dnsLink);
        }
    });
}

/**
 * Performance monitoring for images
 */
export function measureImagePerformance(src: string): Promise<{
    loadTime: number;
    size: number;
    naturalWidth: number;
    naturalHeight: number;
}> {
    return new Promise((resolve, reject) => {
        const startTime = performance.now();
        const img = new Image();

        img.onload = () => {
            const loadTime = performance.now() - startTime;

            // Estimate size (not exact, but useful for monitoring)
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');

            if (ctx) {
                ctx.drawImage(img, 0, 0);
                canvas.toBlob((blob) => {
                    resolve({
                        loadTime,
                        size: blob?.size || 0,
                        naturalWidth: img.naturalWidth,
                        naturalHeight: img.naturalHeight
                    });
                }, 'image/jpeg', 0.8);
            } else {
                resolve({
                    loadTime,
                    size: 0,
                    naturalWidth: img.naturalWidth,
                    naturalHeight: img.naturalHeight
                });
            }
        };

        img.onerror = () => {
            reject(new Error(`Failed to load image: ${src}`));
        };

        img.src = src;
    });
}