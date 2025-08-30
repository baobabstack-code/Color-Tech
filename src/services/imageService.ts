/**
 * Image Service - Comprehensive error handling and logging for image operations
 */

export interface ImageError {
    url: string;
    error: string;
    timestamp: Date;
    userAgent: string;
    retryCount: number;
    resolved: boolean;
    errorType: 'network' | 'validation' | 'optimization' | 'unknown';
    fallbackUsed?: string;
}

export interface ImageLoadMetrics {
    totalRequests: number;
    successfulLoads: number;
    failedLoads: number;
    averageLoadTime: number;
    errorsByType: Record<string, number>;
}

class ImageErrorService {
    private errors: ImageError[] = [];
    private metrics: ImageLoadMetrics = {
        totalRequests: 0,
        successfulLoads: 0,
        failedLoads: 0,
        averageLoadTime: 0,
        errorsByType: {}
    };
    private loadTimes: number[] = [];

    /**
     * Log an image loading error
     */
    logImageError(
        url: string,
        error: Error | string,
        errorType: ImageError['errorType'] = 'unknown',
        fallbackUsed?: string
    ): void {
        const imageError: ImageError = {
            url,
            error: typeof error === 'string' ? error : error.message,
            timestamp: new Date(),
            userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
            retryCount: 0,
            resolved: false,
            errorType,
            fallbackUsed
        };

        this.errors.push(imageError);
        this.updateMetrics('error', errorType);

        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error('Image loading error:', {
                url,
                error: typeof error === 'string' ? error : error.message,
                errorType,
                fallbackUsed
            });
        }

        // Send to external logging service in production
        if (process.env.NODE_ENV === 'production') {
            this.sendToExternalLogger(imageError);
        }
    }

    /**
     * Log successful image load
     */
    logImageSuccess(url: string, loadTime?: number): void {
        this.updateMetrics('success');

        if (loadTime) {
            this.loadTimes.push(loadTime);
            this.calculateAverageLoadTime();
        }

        // Mark any previous errors for this URL as resolved
        this.errors
            .filter(error => error.url === url && !error.resolved)
            .forEach(error => {
                error.resolved = true;
            });
    }

    /**
     * Increment retry count for a specific URL
     */
    incrementRetryCount(url: string): void {
        const recentError = this.errors
            .filter(error => error.url === url && !error.resolved)
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];

        if (recentError) {
            recentError.retryCount++;
        }
    }

    /**
     * Get error statistics
     */
    getErrorStats(): ImageLoadMetrics {
        return { ...this.metrics };
    }

    /**
     * Get recent errors (last 100)
     */
    getRecentErrors(limit: number = 100): ImageError[] {
        return this.errors
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, limit);
    }

    /**
     * Get errors for a specific URL
     */
    getErrorsForUrl(url: string): ImageError[] {
        return this.errors.filter(error => error.url === url);
    }

    /**
     * Check if URL has recent failures
     */
    hasRecentFailures(url: string, timeWindowMs: number = 300000): boolean {
        const cutoff = new Date(Date.now() - timeWindowMs);
        return this.errors.some(error =>
            error.url === url &&
            error.timestamp > cutoff &&
            !error.resolved
        );
    }

    /**
     * Clear old errors (older than specified days)
     */
    clearOldErrors(daysOld: number = 7): void {
        const cutoff = new Date(Date.now() - (daysOld * 24 * 60 * 60 * 1000));
        this.errors = this.errors.filter(error => error.timestamp > cutoff);
    }

    /**
     * Generate user-friendly error message
     */
    getUserFriendlyErrorMessage(errorType: ImageError['errorType']): string {
        switch (errorType) {
            case 'network':
                return 'Image temporarily unavailable. Please check your connection.';
            case 'validation':
                return 'Invalid image format. Using default image.';
            case 'optimization':
                return 'Image optimization failed. Loading original image.';
            default:
                return 'Image could not be loaded. Using fallback image.';
        }
    }

    private updateMetrics(type: 'success' | 'error', errorType?: string): void {
        this.metrics.totalRequests++;

        if (type === 'success') {
            this.metrics.successfulLoads++;
        } else {
            this.metrics.failedLoads++;
            if (errorType) {
                this.metrics.errorsByType[errorType] = (this.metrics.errorsByType[errorType] || 0) + 1;
            }
        }
    }

    private calculateAverageLoadTime(): void {
        if (this.loadTimes.length > 0) {
            const sum = this.loadTimes.reduce((acc, time) => acc + time, 0);
            this.metrics.averageLoadTime = sum / this.loadTimes.length;
        }
    }

    private async sendToExternalLogger(error: ImageError): Promise<void> {
        try {
            // In a real application, this would send to a logging service like Sentry, LogRocket, etc.
            // For now, we'll just store it locally
            if (typeof window !== 'undefined' && window.localStorage) {
                const existingLogs = JSON.parse(localStorage.getItem('imageErrors') || '[]');
                existingLogs.push(error);
                // Keep only last 1000 errors in localStorage
                if (existingLogs.length > 1000) {
                    existingLogs.splice(0, existingLogs.length - 1000);
                }
                localStorage.setItem('imageErrors', JSON.stringify(existingLogs));
            }
        } catch (e) {
            console.error('Failed to log image error externally:', e);
        }
    }
}

// Export singleton instance
export const imageErrorService = new ImageErrorService();

/**
 * Error recovery mechanisms
 */
export class ImageErrorRecovery {
    private static readonly MAX_RETRIES = 3;
    private static readonly RETRY_DELAYS = [1000, 2000, 4000]; // Progressive delays

    /**
     * Attempt to recover from image loading error
     */
    static async attemptRecovery(
        originalUrl: string,
        errorType: ImageError['errorType'],
        retryCount: number = 0
    ): Promise<string | null> {
        // If we've exceeded max retries, return null
        if (retryCount >= this.MAX_RETRIES) {
            return null;
        }

        // Wait before retry
        if (retryCount > 0) {
            await this.delay(this.RETRY_DELAYS[retryCount - 1] || 4000);
        }

        try {
            // Different recovery strategies based on error type
            switch (errorType) {
                case 'optimization':
                    // Try loading without Next.js optimization
                    return this.tryDirectLoad(originalUrl);

                case 'network':
                    // Try with different parameters or CDN
                    return this.tryAlternativeSource(originalUrl);

                case 'validation':
                    // Try to fix URL format
                    return this.tryUrlFix(originalUrl);

                default:
                    // Generic retry
                    return this.tryGenericRecovery(originalUrl);
            }
        } catch (error) {
            imageErrorService.logImageError(
                originalUrl,
                error as Error,
                errorType
            );

            // Increment retry count and try again
            imageErrorService.incrementRetryCount(originalUrl);
            return this.attemptRecovery(originalUrl, errorType, retryCount + 1);
        }
    }

    private static async tryDirectLoad(url: string): Promise<string | null> {
        // Remove Next.js optimization parameters and try direct load
        const directUrl = url.replace(/\/_next\/image\?.*?url=([^&]+).*/, '$1');
        const decodedUrl = decodeURIComponent(directUrl);

        if (await this.testImageLoad(decodedUrl)) {
            return decodedUrl;
        }
        return null;
    }

    private static async tryAlternativeSource(url: string): Promise<string | null> {
        // Try different Cloudinary transformations
        if (url.includes('cloudinary.com')) {
            const alternatives = [
                url.replace(/\/q_\d+/, '/q_auto'),
                url.replace(/\/f_\w+/, '/f_auto'),
                url.replace(/\/w_\d+,h_\d+/, '/w_auto,h_auto')
            ];

            for (const altUrl of alternatives) {
                if (await this.testImageLoad(altUrl)) {
                    return altUrl;
                }
            }
        }
        return null;
    }

    private static async tryUrlFix(url: string): Promise<string | null> {
        // Try to fix common URL issues
        const fixes = [
            url.replace(/^http:/, 'https:'),
            url.replace(/\/+/g, '/').replace(':/', '://'),
            url.trim()
        ];

        for (const fixedUrl of fixes) {
            if (await this.testImageLoad(fixedUrl)) {
                return fixedUrl;
            }
        }
        return null;
    }

    private static async tryGenericRecovery(url: string): Promise<string | null> {
        // Simple retry of original URL
        if (await this.testImageLoad(url)) {
            return url;
        }
        return null;
    }

    private static async testImageLoad(url: string): Promise<boolean> {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;

            // Timeout after 5 seconds
            setTimeout(() => resolve(false), 5000);
        });
    }

    private static delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

/**
 * Hook for using image error service in React components
 */
export function useImageErrorHandling() {
    const handleImageError = (
        url: string,
        error: Error | string,
        errorType: ImageError['errorType'] = 'unknown'
    ) => {
        imageErrorService.logImageError(url, error, errorType);
    };

    const handleImageSuccess = (url: string, loadTime?: number) => {
        imageErrorService.logImageSuccess(url, loadTime);
    };

    const getUserFriendlyMessage = (errorType: ImageError['errorType']) => {
        return imageErrorService.getUserFriendlyErrorMessage(errorType);
    };

    const hasRecentFailures = (url: string) => {
        return imageErrorService.hasRecentFailures(url);
    };

    return {
        handleImageError,
        handleImageSuccess,
        getUserFriendlyMessage,
        hasRecentFailures,
        getErrorStats: () => imageErrorService.getErrorStats(),
        getRecentErrors: (limit?: number) => imageErrorService.getRecentErrors(limit)
    };
}