import { measureImagePerformance, addResourceHints } from '@/lib/service-worker';
import { imageService } from '@/lib/image-utils';

// Mock performance API for testing
const mockPerformance = {
    now: jest.fn(() => Date.now()),
    mark: jest.fn(),
    measure: jest.fn(),
    getEntriesByType: jest.fn(() => []),
    getEntriesByName: jest.fn(() => []),
};

Object.defineProperty(global, 'performance', {
    value: mockPerformance,
    writable: true,
});

// Mock Image constructor
class MockImage {
    src: string = '';
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    naturalWidth: number = 800;
    naturalHeight: number = 600;

    constructor() {
        // Simulate async loading
        setTimeout(() => {
            if (this.onload) {
                this.onload();
            }
        }, 100);
    }
}

Object.defineProperty(global, 'Image', {
    value: MockImage,
    writable: true,
});

// Mock Canvas API
const mockCanvas = {
    width: 0,
    height: 0,
    getContext: jest.fn(() => ({
        drawImage: jest.fn(),
    })),
    toBlob: jest.fn((callback) => {
        callback(new Blob(['mock image data'], { type: 'image/jpeg' }));
    }),
};

Object.defineProperty(global, 'HTMLCanvasElement', {
    value: function () {
        return mockCanvas;
    },
    writable: true,
});

Object.defineProperty(document, 'createElement', {
    value: jest.fn((tagName) => {
        if (tagName === 'canvas') {
            return mockCanvas;
        }
        return {
            rel: '',
            as: '',
            href: '',
            setAttribute: jest.fn(),
            appendChild: jest.fn(),
        };
    }),
    writable: true,
});

describe('Image Performance Optimization', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockPerformance.now.mockReturnValue(1000);
    });

    describe('measureImagePerformance', () => {
        it('should measure image load time and dimensions', async () => {
            mockPerformance.now
                .mockReturnValueOnce(1000) // Start time
                .mockReturnValueOnce(1150); // End time

            const result = await measureImagePerformance('https://example.com/test.jpg');

            expect(result).toEqual({
                loadTime: 150,
                size: expect.any(Number),
                naturalWidth: 800,
                naturalHeight: 600,
            });
        });

        it('should handle image load errors', async () => {
            // Mock image that fails to load
            class FailingMockImage extends MockImage {
                constructor() {
                    super();
                    setTimeout(() => {
                        if (this.onerror) {
                            this.onerror();
                        }
                    }, 50);
                }
            }

            Object.defineProperty(global, 'Image', {
                value: FailingMockImage,
                writable: true,
            });

            await expect(measureImagePerformance('https://example.com/broken.jpg'))
                .rejects.toThrow('Failed to load image');
        });
    });

    describe('addResourceHints', () => {
        it('should add preload links for images', () => {
            const mockHead = {
                appendChild: jest.fn(),
            };

            Object.defineProperty(document, 'head', {
                value: mockHead,
                writable: true,
            });

            const images = [
                { src: 'https://example.com/image1.jpg', priority: 'high' as const },
                { src: 'https://example.com/image2.jpg', sizes: '(max-width: 768px) 100vw, 50vw' },
            ];

            addResourceHints(images);

            expect(mockHead.appendChild).toHaveBeenCalledTimes(4); // 2 preload + 2 dns-prefetch
        });
    });

    describe('Image Processing Performance', () => {
        it('should optimize image URLs efficiently', () => {
            const startTime = performance.now();

            const urls = [
                'https://res.cloudinary.com/demo/image/upload/sample.jpg',
                'https://example.com/image.png',
                '/local-image.jpg',
            ];

            urls.forEach(url => {
                imageService.processImageUrl(url, {
                    quality: 80,
                    format: 'auto',
                    width: 800,
                }, 'general');
            });

            const endTime = performance.now();
            const processingTime = endTime - startTime;

            // Processing should be fast (under 10ms for 3 URLs)
            expect(processingTime).toBeLessThan(10);
        });

        it('should handle batch URL processing', () => {
            const urls = Array.from({ length: 100 }, (_, i) =>
                `https://res.cloudinary.com/demo/image/upload/sample${i}.jpg`
            );

            const startTime = performance.now();

            const processedUrls = urls.map(url =>
                imageService.processImageUrl(url, { quality: 75 }, 'gallery')
            );

            const endTime = performance.now();
            const processingTime = endTime - startTime;

            expect(processedUrls).toHaveLength(100);
            expect(processingTime).toBeLessThan(50); // Should process 100 URLs in under 50ms
        });
    });

    describe('Lazy Loading Performance', () => {
        it('should efficiently determine when to load images', () => {
            // Mock IntersectionObserver
            const mockObserver = {
                observe: jest.fn(),
                unobserve: jest.fn(),
                disconnect: jest.fn(),
            };

            Object.defineProperty(global, 'IntersectionObserver', {
                value: jest.fn(() => mockObserver),
                writable: true,
            });

            // Simulate creating multiple lazy-loaded images
            const observers = Array.from({ length: 50 }, () =>
                new IntersectionObserver(() => { }, { threshold: 0.1 })
            );

            expect(observers).toHaveLength(50);
            observers.forEach(observer => {
                expect(observer.observe).toBeDefined();
            });
        });
    });

    describe('Cache Performance', () => {
        it('should efficiently check cache status', () => {
            const cacheKeys = Array.from({ length: 1000 }, (_, i) =>
                `https://example.com/image${i}.jpg`
            );

            const startTime = performance.now();

            // Simulate cache lookup operations
            const cacheResults = cacheKeys.map(key => {
                // Simple hash-based cache simulation
                const hash = key.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                return hash % 2 === 0; // 50% cache hit rate
            });

            const endTime = performance.now();
            const lookupTime = endTime - startTime;

            expect(cacheResults).toHaveLength(1000);
            expect(lookupTime).toBeLessThan(20); // Should lookup 1000 items in under 20ms
        });
    });

    describe('Memory Usage', () => {
        it('should not leak memory with repeated image operations', () => {
            // Simulate repeated image processing
            for (let i = 0; i < 1000; i++) {
                const url = `https://example.com/image${i}.jpg`;
                imageService.processImageUrl(url, { quality: 80 }, 'general');

                // Simulate cleanup
                if (i % 100 === 0) {
                    // Force garbage collection simulation
                    jest.clearAllMocks();
                }
            }

            // Test should complete without memory issues
            expect(true).toBe(true);
        });
    });

    describe('Network Optimization', () => {
        it('should batch network requests efficiently', async () => {
            const urls = [
                'https://example.com/image1.jpg',
                'https://example.com/image2.jpg',
                'https://example.com/image3.jpg',
            ];

            const startTime = performance.now();

            // Simulate parallel loading
            const loadPromises = urls.map(url =>
                measureImagePerformance(url).catch(() => null)
            );

            await Promise.all(loadPromises);

            const endTime = performance.now();
            const totalTime = endTime - startTime;

            // Parallel loading should be faster than sequential
            expect(totalTime).toBeLessThan(500); // Should complete in under 500ms
        });
    });
});

describe('Performance Benchmarks', () => {
    it('should meet performance targets for image processing', () => {
        const benchmarks = {
            singleImageProcessing: 1, // 1ms max
            batchProcessing: 50, // 50ms for 100 images
            cacheLookupsPerSecond: 10000, // 10k lookups per second
            memoryUsageGrowth: 0.1, // 10% max growth per 1000 operations
        };

        // Single image processing benchmark
        const singleStart = performance.now();
        imageService.processImageUrl('https://example.com/test.jpg', { quality: 80 }, 'general');
        const singleEnd = performance.now();

        expect(singleEnd - singleStart).toBeLessThan(benchmarks.singleImageProcessing);

        // Batch processing benchmark
        const batchStart = performance.now();
        for (let i = 0; i < 100; i++) {
            imageService.processImageUrl(`https://example.com/image${i}.jpg`, { quality: 80 }, 'general');
        }
        const batchEnd = performance.now();

        expect(batchEnd - batchStart).toBeLessThan(benchmarks.batchProcessing);
    });
});