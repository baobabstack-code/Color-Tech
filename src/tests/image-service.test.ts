import { imageErrorService, ImageErrorRecovery } from '@/services/imageService';

// Mock localStorage for Node environment
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
};

// Mock window and localStorage
const windowMock = {
    localStorage: localStorageMock,
    navigator: {
        userAgent: 'test-agent'
    }
};

// Mock global objects
(global as any).window = windowMock;
(global as any).localStorage = localStorageMock;

// Mock Image constructor for Node environment
(global as any).Image = class {
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    src: string = '';

    constructor() {
        setTimeout(() => {
            if (this.src.includes('valid')) {
                this.onload?.();
            } else {
                this.onerror?.();
            }
        }, 10);
    }
};

describe('ImageErrorService', () => {
    beforeEach(() => {
        // Clear any existing errors
        imageErrorService['errors'] = [];
        imageErrorService['metrics'] = {
            totalRequests: 0,
            successfulLoads: 0,
            failedLoads: 0,
            averageLoadTime: 0,
            errorsByType: {}
        };
        jest.clearAllMocks();
    });

    describe('logImageError', () => {
        it('should log image error with correct details', () => {
            const url = 'https://example.com/image.jpg';
            const error = new Error('Network error');
            const errorType = 'network';

            imageErrorService.logImageError(url, error, errorType);

            const recentErrors = imageErrorService.getRecentErrors(1);
            expect(recentErrors).toHaveLength(1);
            expect(recentErrors[0]).toMatchObject({
                url,
                error: 'Network error',
                errorType: 'network',
                retryCount: 0,
                resolved: false
            });
        });

        it('should update metrics when logging error', () => {
            imageErrorService.logImageError('test.jpg', 'Test error', 'validation');

            const stats = imageErrorService.getErrorStats();
            expect(stats.totalRequests).toBe(1);
            expect(stats.failedLoads).toBe(1);
            expect(stats.successfulLoads).toBe(0);
            expect(stats.errorsByType.validation).toBe(1);
        });

        it('should store errors in localStorage in production', () => {
            const originalEnv = process.env.NODE_ENV;
            (process.env as any).NODE_ENV = 'production';

            localStorageMock.getItem.mockReturnValue('[]');

            imageErrorService.logImageError('test.jpg', 'Test error', 'network');

            expect(localStorageMock.setItem).toHaveBeenCalledWith(
                'imageErrors',
                expect.stringContaining('test.jpg')
            );

            process.env.NODE_ENV = originalEnv;
        });
    });

    describe('logImageSuccess', () => {
        it('should log successful image load', () => {
            const url = 'https://example.com/image.jpg';
            const loadTime = 500;

            imageErrorService.logImageSuccess(url, loadTime);

            const stats = imageErrorService.getErrorStats();
            expect(stats.totalRequests).toBe(1);
            expect(stats.successfulLoads).toBe(1);
            expect(stats.failedLoads).toBe(0);
            expect(stats.averageLoadTime).toBe(500);
        });

        it('should mark previous errors as resolved', () => {
            const url = 'https://example.com/image.jpg';

            // Log an error first
            imageErrorService.logImageError(url, 'Test error', 'network');

            // Then log success
            imageErrorService.logImageSuccess(url);

            const errors = imageErrorService.getErrorsForUrl(url);
            expect(errors[0].resolved).toBe(true);
        });
    });

    describe('hasRecentFailures', () => {
        it('should return true for recent unresolved failures', () => {
            const url = 'https://example.com/image.jpg';

            imageErrorService.logImageError(url, 'Test error', 'network');

            expect(imageErrorService.hasRecentFailures(url)).toBe(true);
        });

        it('should return false for resolved failures', () => {
            const url = 'https://example.com/image.jpg';

            imageErrorService.logImageError(url, 'Test error', 'network');
            imageErrorService.logImageSuccess(url);

            expect(imageErrorService.hasRecentFailures(url)).toBe(false);
        });

        it('should return false for old failures outside time window', () => {
            const url = 'https://example.com/image.jpg';

            imageErrorService.logImageError(url, 'Test error', 'network');

            // Test with very short time window (wait a bit to ensure time passes)
            await new Promise(resolve => setTimeout(resolve, 10));
            expect(imageErrorService.hasRecentFailures(url, 1)).toBe(false);
        });
    });

    describe('getUserFriendlyErrorMessage', () => {
        it('should return appropriate messages for different error types', () => {
            expect(imageErrorService.getUserFriendlyErrorMessage('network'))
                .toBe('Image temporarily unavailable. Please check your connection.');

            expect(imageErrorService.getUserFriendlyErrorMessage('validation'))
                .toBe('Invalid image format. Using default image.');

            expect(imageErrorService.getUserFriendlyErrorMessage('optimization'))
                .toBe('Image optimization failed. Loading original image.');

            expect(imageErrorService.getUserFriendlyErrorMessage('unknown'))
                .toBe('Image could not be loaded. Using fallback image.');
        });
    });

    describe('clearOldErrors', () => {
        it('should remove errors older than specified days', () => {
            // Create an old error by manually setting timestamp
            imageErrorService.logImageError('old.jpg', 'Old error', 'network');
            const errors = imageErrorService['errors'];
            errors[0].timestamp = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000); // 8 days ago

            // Add a recent error
            imageErrorService.logImageError('recent.jpg', 'Recent error', 'network');

            imageErrorService.clearOldErrors(7);

            const remainingErrors = imageErrorService.getRecentErrors();
            expect(remainingErrors).toHaveLength(1);
            expect(remainingErrors[0].url).toBe('recent.jpg');
        });
    });

    describe('incrementRetryCount', () => {
        it('should increment retry count for existing error', () => {
            const url = 'https://example.com/image.jpg';

            imageErrorService.logImageError(url, 'Test error', 'network');
            imageErrorService.incrementRetryCount(url);

            const errors = imageErrorService.getErrorsForUrl(url);
            expect(errors[0].retryCount).toBe(1);
        });
    });
});

describe('ImageErrorRecovery', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('attemptRecovery', () => {
        it('should return null after max retries', async () => {
            const result = await ImageErrorRecovery.attemptRecovery(
                'https://invalid.com/image.jpg',
                'network',
                3
            );

            expect(result).toBeNull();
        });

        it('should attempt direct load for optimization errors', async () => {
            const nextImageUrl = '/_next/image?url=https%3A//valid.com/image.jpg&w=800&q=75';

            const result = await ImageErrorRecovery.attemptRecovery(
                nextImageUrl,
                'optimization',
                0
            );

            expect(result).toBe('https://valid.com/image.jpg');
        });

        it('should try alternative sources for network errors', async () => {
            const cloudinaryUrl = 'https://res.cloudinary.com/demo/image/upload/q_80/valid.jpg';

            const result = await ImageErrorRecovery.attemptRecovery(
                cloudinaryUrl,
                'network',
                0
            );

            // Should try with different quality settings
            expect(result).toContain('valid.jpg');
        });

        it('should fix common URL issues for validation errors', async () => {
            const httpUrl = 'http://valid.com/image.jpg';

            const result = await ImageErrorRecovery.attemptRecovery(
                httpUrl,
                'validation',
                0
            );

            expect(result).toBe('https://valid.com/image.jpg');
        });
    });
});

describe('Error Recovery Integration', () => {
    it('should handle recovery workflow correctly', async () => {
        const url = 'https://invalid.com/image.jpg';

        // Log initial error
        imageErrorService.logImageError(url, 'Network error', 'network');

        // Attempt recovery
        const recoveredUrl = await ImageErrorRecovery.attemptRecovery(url, 'network', 0);

        if (recoveredUrl) {
            // Log successful recovery
            imageErrorService.logImageSuccess(recoveredUrl);

            const errors = imageErrorService.getErrorsForUrl(url);
            expect(errors[0].resolved).toBe(true);
        }

        const stats = imageErrorService.getErrorStats();
        expect(stats.totalRequests).toBeGreaterThan(0);
    });
});