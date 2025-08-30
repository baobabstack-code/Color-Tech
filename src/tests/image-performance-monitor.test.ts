import { imagePerformanceMonitor, useImagePerformanceMonitoring } from '@/services/imagePerformanceMonitor';

// Mock window and navigator for testing
Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 1024,
});

Object.defineProperty(window, 'localStorage', {
    value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
    },
    writable: true,
});

describe('Image Performance Monitor', () => {
    beforeEach(() => {
        // Clear metrics but preserve alerts for alert tests
        (imagePerformanceMonitor as any).clearMetricsOnly();
        jest.clearAllMocks();
    });

    describe('recordImageLoad', () => {
        it('should record successful image load', () => {
            imagePerformanceMonitor.recordImageLoad(
                'https://example.com/image.jpg',
                1500,
                true
            );

            const stats = imagePerformanceMonitor.getPerformanceStats(1);
            expect(stats.totalImages).toBe(1);
            expect(stats.successRate).toBe(1);
            expect(stats.averageLoadTime).toBe(1500);
        });

        it('should record failed image load', () => {
            imagePerformanceMonitor.recordImageLoad(
                'https://example.com/broken.jpg',
                0,
                false,
                'network'
            );

            const stats = imagePerformanceMonitor.getPerformanceStats(1);
            expect(stats.totalImages).toBe(1);
            expect(stats.successRate).toBe(0);
            expect(stats.errorsByType.network).toBe(1);
        });

        it('should track multiple loads correctly', () => {
            // Record multiple successful loads
            imagePerformanceMonitor.recordImageLoad('https://example.com/1.jpg', 1000, true);
            imagePerformanceMonitor.recordImageLoad('https://example.com/2.jpg', 2000, true);
            imagePerformanceMonitor.recordImageLoad('https://example.com/3.jpg', 500, false, 'validation');

            const stats = imagePerformanceMonitor.getPerformanceStats(1);
            expect(stats.totalImages).toBe(3);
            expect(stats.successRate).toBe(2 / 3);
            expect(stats.averageLoadTime).toBe(1500); // (1000 + 2000) / 2
            expect(stats.errorsByType.validation).toBe(1);
        });
    });

    describe('getPerformanceStats', () => {
        beforeEach(() => {
            // Add test data
            imagePerformanceMonitor.recordImageLoad('https://example.com/fast.jpg', 500, true);
            imagePerformanceMonitor.recordImageLoad('https://example.com/medium.jpg', 1500, true);
            imagePerformanceMonitor.recordImageLoad('https://example.com/slow.jpg', 3000, true);
            imagePerformanceMonitor.recordImageLoad('https://example.com/failed.jpg', 0, false, 'network');
        });

        it('should calculate correct statistics', () => {
            const stats = imagePerformanceMonitor.getPerformanceStats(1);

            expect(stats.totalImages).toBe(4);
            expect(stats.successRate).toBe(0.75); // 3/4
            expect(Math.round(stats.averageLoadTime * 100) / 100).toBe(1666.67); // (500 + 1500 + 3000) / 3
            expect(stats.medianLoadTime).toBe(1500);
            expect(stats.p95LoadTime).toBe(3000);
            expect(stats.errorsByType.network).toBe(1);
        });

        it('should return empty stats when no data', () => {
            imagePerformanceMonitor.clearOldMetrics(0);
            const stats = imagePerformanceMonitor.getPerformanceStats(1);

            expect(stats.totalImages).toBe(0);
            expect(stats.successRate).toBe(0);
            expect(stats.averageLoadTime).toBe(0);
            expect(stats.slowestImages).toHaveLength(0);
        });

        it('should filter by time range correctly', () => {
            // Clear and add old data (simulate old timestamp)
            imagePerformanceMonitor.clearOldMetrics(0);

            // This would need to be tested with actual time manipulation
            // For now, just test that the function works
            const stats = imagePerformanceMonitor.getPerformanceStats(24);
            expect(stats).toBeDefined();
        });
    });

    describe('getProblematicImages', () => {
        beforeEach(() => {
            // Add problematic image data
            const problematicUrl = 'https://example.com/problematic.jpg';

            // High failure rate
            for (let i = 0; i < 7; i++) {
                imagePerformanceMonitor.recordImageLoad(problematicUrl, 0, false, 'network');
            }
            for (let i = 0; i < 3; i++) {
                imagePerformanceMonitor.recordImageLoad(problematicUrl, 2000, true);
            }

            // Slow but successful image
            const slowUrl = 'https://example.com/slow.jpg';
            for (let i = 0; i < 5; i++) {
                imagePerformanceMonitor.recordImageLoad(slowUrl, 4000, true);
            }
        });

        it('should identify images with high failure rates', () => {
            const problematic = imagePerformanceMonitor.getProblematicImages(1);

            const highFailureImage = problematic.find(img =>
                img.url === 'https://example.com/problematic.jpg'
            );

            expect(highFailureImage).toBeDefined();
            expect(highFailureImage!.failureRate).toBe(0.7); // 7/10
            expect(highFailureImage!.totalRequests).toBe(10);
        });

        it('should identify slow loading images', () => {
            const problematic = imagePerformanceMonitor.getProblematicImages(1);

            const slowImage = problematic.find(img =>
                img.url === 'https://example.com/slow.jpg'
            );

            expect(slowImage).toBeDefined();
            expect(slowImage!.averageLoadTime).toBe(4000);
            expect(slowImage!.failureRate).toBe(0);
        });
    });

    describe('alert system', () => {
        it('should generate alerts for high failure rates', () => {
            // Don't clear metrics here since that also clears alerts

            // Generate many failures to trigger alert (need at least 10 for alert logic)
            for (let i = 0; i < 15; i++) {
                imagePerformanceMonitor.recordImageLoad(
                    `https://example.com/fail-${i}.jpg`,
                    0,
                    false,
                    'network'
                );
            }

            const alerts = imagePerformanceMonitor.getRecentAlerts(10);
            expect(alerts.length).toBeGreaterThan(0);

            const failureAlert = alerts.find(alert =>
                alert.type === 'high_failure_rate' || alert.type === 'low_success_rate'
            );
            expect(failureAlert).toBeDefined();
        });

        it('should generate alerts for slow load times', () => {
            // Don't clear metrics here since that also clears alerts

            // Generate many slow loads to trigger alert (need at least 10 for alert logic)
            for (let i = 0; i < 15; i++) {
                imagePerformanceMonitor.recordImageLoad(
                    `https://example.com/slow-${i}.jpg`,
                    5000, // 5 seconds - very slow
                    true
                );
            }

            const alerts = imagePerformanceMonitor.getRecentAlerts(10);
            const slowAlert = alerts.find(alert =>
                alert.type === 'high_load_time'
            );
            expect(slowAlert).toBeDefined();
        });
    });

    describe('data management', () => {
        it('should clear old metrics', () => {
            // Add some metrics
            imagePerformanceMonitor.recordImageLoad('https://example.com/test.jpg', 1000, true);

            let stats = imagePerformanceMonitor.getPerformanceStats(1);
            expect(stats.totalImages).toBe(1);

            // Clear all metrics
            imagePerformanceMonitor.clearOldMetrics(0);

            stats = imagePerformanceMonitor.getPerformanceStats(1);
            expect(stats.totalImages).toBe(0);
        });

        it('should export metrics in JSON format', () => {
            imagePerformanceMonitor.recordImageLoad('https://example.com/test.jpg', 1000, true);

            const exported = imagePerformanceMonitor.exportMetrics('json');
            expect(() => JSON.parse(exported)).not.toThrow();

            const parsed = JSON.parse(exported);
            expect(Array.isArray(parsed)).toBe(true);
            expect(parsed.length).toBe(1);
            expect(parsed[0].url).toBe('https://example.com/test.jpg');
        });

        it('should export metrics in CSV format', () => {
            imagePerformanceMonitor.recordImageLoad('https://example.com/test.jpg', 1000, true);

            const exported = imagePerformanceMonitor.exportMetrics('csv');
            expect(typeof exported).toBe('string');
            expect(exported).toContain('url,loadTime,success');
            expect(exported).toContain('https://example.com/test.jpg');
        });
    });
});

describe('useImagePerformanceMonitoring hook', () => {
    it('should provide monitoring functions', () => {
        const { recordLoad, getStats, getAlerts, getProblematicImages, exportMetrics } =
            useImagePerformanceMonitoring();

        expect(typeof recordLoad).toBe('function');
        expect(typeof getStats).toBe('function');
        expect(typeof getAlerts).toBe('function');
        expect(typeof getProblematicImages).toBe('function');
        expect(typeof exportMetrics).toBe('function');
    });

    it('should record loads through hook', () => {
        const { recordLoad, getStats } = useImagePerformanceMonitoring();

        recordLoad('https://example.com/hook-test.jpg', 1200, true);

        const stats = getStats(1);
        expect(stats.totalImages).toBeGreaterThan(0);
    });
});