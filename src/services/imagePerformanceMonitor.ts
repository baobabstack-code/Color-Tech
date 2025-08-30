/**
 * Image Performance Monitoring Service
 * Tracks image loading performance and provides monitoring dashboard data
 */

export interface ImageLoadMetrics {
    url: string;
    loadTime: number;
    size?: number;
    timestamp: Date;
    success: boolean;
    errorType?: string;
    retryCount: number;
    deviceType: 'mobile' | 'tablet' | 'desktop';
    connectionType?: string;
}

export interface PerformanceStats {
    totalImages: number;
    successRate: number;
    averageLoadTime: number;
    medianLoadTime: number;
    p95LoadTime: number;
    slowestImages: ImageLoadMetrics[];
    errorsByType: Record<string, number>;
    performanceByDevice: Record<string, {
        averageLoadTime: number;
        successRate: number;
        count: number;
    }>;
    timeSeriesData: Array<{
        timestamp: Date;
        averageLoadTime: number;
        successRate: number;
        totalRequests: number;
    }>;
}

export interface AlertConfig {
    maxFailureRate: number; // 0-1 (e.g., 0.1 for 10%)
    maxAverageLoadTime: number; // milliseconds
    minSuccessRate: number; // 0-1
    alertCooldown: number; // milliseconds
}

class ImagePerformanceMonitor {
    private metrics: ImageLoadMetrics[] = [];
    private alerts: Array<{ type: string; message: string; timestamp: Date }> = [];
    private lastAlertTime: Record<string, number> = {};

    private readonly alertConfig: AlertConfig = {
        maxFailureRate: 0.15, // 15% failure rate threshold
        maxAverageLoadTime: 3000, // 3 second average load time threshold
        minSuccessRate: 0.85, // 85% minimum success rate
        alertCooldown: 300000 // 5 minute cooldown between alerts
    };

    /**
     * Record image loading metrics
     */
    recordImageLoad(
        url: string,
        loadTime: number,
        success: boolean,
        errorType?: string,
        retryCount: number = 0,
        size?: number
    ): void {
        const metric: ImageLoadMetrics = {
            url,
            loadTime,
            size,
            timestamp: new Date(),
            success,
            errorType,
            retryCount,
            deviceType: this.detectDeviceType(),
            connectionType: this.getConnectionType()
        };

        this.metrics.push(metric);

        // Keep only last 10000 metrics to prevent memory issues
        if (this.metrics.length > 10000) {
            this.metrics = this.metrics.slice(-10000);
        }

        // Check for performance issues
        this.checkPerformanceAlerts();

        // Log to external monitoring service in production
        if (process.env.NODE_ENV === 'production') {
            this.sendToMonitoringService(metric);
        }
    }

    /**
     * Get comprehensive performance statistics
     */
    getPerformanceStats(timeRangeHours: number = 24): PerformanceStats {
        const cutoff = new Date(Date.now() - (timeRangeHours * 60 * 60 * 1000));
        const recentMetrics = this.metrics.filter(m => m.timestamp > cutoff);

        if (recentMetrics.length === 0) {
            return this.getEmptyStats();
        }

        const successfulMetrics = recentMetrics.filter(m => m.success);
        const loadTimes = successfulMetrics.map(m => m.loadTime).sort((a, b) => a - b);

        return {
            totalImages: recentMetrics.length,
            successRate: successfulMetrics.length / recentMetrics.length,
            averageLoadTime: this.calculateAverage(loadTimes),
            medianLoadTime: this.calculateMedian(loadTimes),
            p95LoadTime: this.calculatePercentile(loadTimes, 95),
            slowestImages: this.getSlowestImages(recentMetrics, 10),
            errorsByType: this.getErrorsByType(recentMetrics),
            performanceByDevice: this.getPerformanceByDevice(recentMetrics),
            timeSeriesData: this.getTimeSeriesData(recentMetrics)
        };
    }

    /**
     * Get recent alerts
     */
    getRecentAlerts(limit: number = 50): Array<{ type: string; message: string; timestamp: Date }> {
        return this.alerts
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, limit);
    }

    /**
     * Get images with performance issues
     */
    getProblematicImages(timeRangeHours: number = 24): Array<{
        url: string;
        failureRate: number;
        averageLoadTime: number;
        totalRequests: number;
        lastError?: string;
    }> {
        const cutoff = new Date(Date.now() - (timeRangeHours * 60 * 60 * 1000));
        const recentMetrics = this.metrics.filter(m => m.timestamp > cutoff);

        const imageStats = new Map<string, {
            total: number;
            failures: number;
            loadTimes: number[];
            lastError?: string;
        }>();

        recentMetrics.forEach(metric => {
            const stats = imageStats.get(metric.url) || {
                total: 0,
                failures: 0,
                loadTimes: [],
                lastError: undefined
            };

            stats.total++;
            if (!metric.success) {
                stats.failures++;
                stats.lastError = metric.errorType;
            } else {
                stats.loadTimes.push(metric.loadTime);
            }

            imageStats.set(metric.url, stats);
        });

        return Array.from(imageStats.entries())
            .map(([url, stats]) => ({
                url,
                failureRate: stats.failures / stats.total,
                averageLoadTime: this.calculateAverage(stats.loadTimes),
                totalRequests: stats.total,
                lastError: stats.lastError
            }))
            .filter(item =>
                item.failureRate > 0.1 || // More than 10% failure rate
                item.averageLoadTime > 2000 || // Slower than 2 seconds
                item.totalRequests >= 5 // Minimum requests to be significant
            )
            .sort((a, b) => b.failureRate - a.failureRate);
    }

    /**
     * Clear old metrics
     */
    clearOldMetrics(daysOld: number = 7): void {
        const cutoff = new Date(Date.now() - (daysOld * 24 * 60 * 60 * 1000));
        this.metrics = this.metrics.filter(m => m.timestamp > cutoff);
        this.alerts = this.alerts.filter(a => a.timestamp > cutoff);
    }

    /**
     * Clear metrics only (for testing)
     */
    clearMetricsOnly(): void {
        this.metrics = [];
    }

    /**
     * Export metrics for external analysis
     */
    exportMetrics(format: 'json' | 'csv' = 'json'): string {
        if (format === 'csv') {
            const headers = ['url', 'loadTime', 'success', 'timestamp', 'deviceType', 'errorType', 'retryCount'];
            const rows = this.metrics.map(m => [
                m.url,
                m.loadTime,
                m.success,
                m.timestamp.toISOString(),
                m.deviceType,
                m.errorType || '',
                m.retryCount
            ]);

            return [headers, ...rows].map(row => row.join(',')).join('\n');
        }

        return JSON.stringify(this.metrics, null, 2);
    }

    private detectDeviceType(): 'mobile' | 'tablet' | 'desktop' {
        if (typeof window === 'undefined') return 'desktop';

        const width = window.innerWidth;
        if (width < 768) return 'mobile';
        if (width < 1024) return 'tablet';
        return 'desktop';
    }

    private getConnectionType(): string | undefined {
        if (typeof navigator !== 'undefined' && 'connection' in navigator) {
            const connection = (navigator as any).connection;
            return connection?.effectiveType || connection?.type;
        }
        return undefined;
    }

    private checkPerformanceAlerts(): void {
        const recentMetrics = this.metrics.slice(-100); // Check last 100 requests
        if (recentMetrics.length < 10) return; // Need minimum data

        const now = Date.now();
        const successRate = recentMetrics.filter(m => m.success).length / recentMetrics.length;
        const averageLoadTime = this.calculateAverage(
            recentMetrics.filter(m => m.success).map(m => m.loadTime)
        );

        // Check success rate alert
        if (successRate < this.alertConfig.minSuccessRate) {
            this.triggerAlert(
                'low_success_rate',
                `Image success rate dropped to ${(successRate * 100).toFixed(1)}%`,
                now
            );
        }

        // Check average load time alert
        if (averageLoadTime > this.alertConfig.maxAverageLoadTime) {
            this.triggerAlert(
                'high_load_time',
                `Average image load time increased to ${averageLoadTime.toFixed(0)}ms`,
                now
            );
        }

        // Check failure rate spike
        const recentFailures = recentMetrics.filter(m => !m.success).length;
        const failureRate = recentFailures / recentMetrics.length;
        if (failureRate > this.alertConfig.maxFailureRate) {
            this.triggerAlert(
                'high_failure_rate',
                `Image failure rate spiked to ${(failureRate * 100).toFixed(1)}%`,
                now
            );
        }
    }

    private triggerAlert(type: string, message: string, timestamp: number): void {
        const lastAlert = this.lastAlertTime[type] || 0;

        // Check cooldown
        if (timestamp - lastAlert < this.alertConfig.alertCooldown) {
            return;
        }

        this.alerts.push({
            type,
            message,
            timestamp: new Date(timestamp)
        });

        this.lastAlertTime[type] = timestamp;

        // Log alert
        console.warn(`Image Performance Alert [${type}]: ${message}`);

        // Send to external alerting service in production
        if (process.env.NODE_ENV === 'production') {
            this.sendAlert(type, message);
        }
    }

    private calculateAverage(numbers: number[]): number {
        if (numbers.length === 0) return 0;
        return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
    }

    private calculateMedian(numbers: number[]): number {
        if (numbers.length === 0) return 0;
        const sorted = [...numbers].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 === 0
            ? (sorted[mid - 1] + sorted[mid]) / 2
            : sorted[mid];
    }

    private calculatePercentile(numbers: number[], percentile: number): number {
        if (numbers.length === 0) return 0;
        const sorted = [...numbers].sort((a, b) => a - b);
        const index = Math.ceil((percentile / 100) * sorted.length) - 1;
        return sorted[Math.max(0, index)];
    }

    private getSlowestImages(metrics: ImageLoadMetrics[], limit: number): ImageLoadMetrics[] {
        return metrics
            .filter(m => m.success)
            .sort((a, b) => b.loadTime - a.loadTime)
            .slice(0, limit);
    }

    private getErrorsByType(metrics: ImageLoadMetrics[]): Record<string, number> {
        const errors: Record<string, number> = {};
        metrics
            .filter(m => !m.success && m.errorType)
            .forEach(m => {
                errors[m.errorType!] = (errors[m.errorType!] || 0) + 1;
            });
        return errors;
    }

    private getPerformanceByDevice(metrics: ImageLoadMetrics[]): Record<string, {
        averageLoadTime: number;
        successRate: number;
        count: number;
    }> {
        const deviceStats: Record<string, {
            loadTimes: number[];
            successes: number;
            total: number;
        }> = {};

        metrics.forEach(m => {
            const stats = deviceStats[m.deviceType] || {
                loadTimes: [],
                successes: 0,
                total: 0
            };

            stats.total++;
            if (m.success) {
                stats.successes++;
                stats.loadTimes.push(m.loadTime);
            }

            deviceStats[m.deviceType] = stats;
        });

        const result: Record<string, {
            averageLoadTime: number;
            successRate: number;
            count: number;
        }> = {};

        Object.entries(deviceStats).forEach(([device, stats]) => {
            result[device] = {
                averageLoadTime: this.calculateAverage(stats.loadTimes),
                successRate: stats.successes / stats.total,
                count: stats.total
            };
        });

        return result;
    }

    private getTimeSeriesData(metrics: ImageLoadMetrics[]): Array<{
        timestamp: Date;
        averageLoadTime: number;
        successRate: number;
        totalRequests: number;
    }> {
        // Group metrics by hour
        const hourlyData = new Map<string, {
            loadTimes: number[];
            successes: number;
            total: number;
        }>();

        metrics.forEach(m => {
            const hour = new Date(m.timestamp);
            hour.setMinutes(0, 0, 0);
            const key = hour.toISOString();

            const data = hourlyData.get(key) || {
                loadTimes: [],
                successes: 0,
                total: 0
            };

            data.total++;
            if (m.success) {
                data.successes++;
                data.loadTimes.push(m.loadTime);
            }

            hourlyData.set(key, data);
        });

        return Array.from(hourlyData.entries())
            .map(([timestamp, data]) => ({
                timestamp: new Date(timestamp),
                averageLoadTime: this.calculateAverage(data.loadTimes),
                successRate: data.successes / data.total,
                totalRequests: data.total
            }))
            .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    }

    private getEmptyStats(): PerformanceStats {
        return {
            totalImages: 0,
            successRate: 0,
            averageLoadTime: 0,
            medianLoadTime: 0,
            p95LoadTime: 0,
            slowestImages: [],
            errorsByType: {},
            performanceByDevice: {},
            timeSeriesData: []
        };
    }

    private async sendToMonitoringService(metric: ImageLoadMetrics): Promise<void> {
        try {
            // In a real application, this would send to a monitoring service
            // like DataDog, New Relic, or custom analytics endpoint
            if (typeof window !== 'undefined' && window.localStorage) {
                const existingMetrics = JSON.parse(localStorage.getItem('imageMetrics') || '[]');
                existingMetrics.push(metric);

                // Keep only last 5000 metrics in localStorage
                if (existingMetrics.length > 5000) {
                    existingMetrics.splice(0, existingMetrics.length - 5000);
                }

                localStorage.setItem('imageMetrics', JSON.stringify(existingMetrics));
            }
        } catch (error) {
            console.error('Failed to send metrics to monitoring service:', error);
        }
    }

    private async sendAlert(type: string, message: string): Promise<void> {
        try {
            // In a real application, this would send to alerting services
            // like PagerDuty, Slack, email, etc.
            console.warn(`ALERT [${type}]: ${message}`);
        } catch (error) {
            console.error('Failed to send alert:', error);
        }
    }
}

// Export singleton instance
export const imagePerformanceMonitor = new ImagePerformanceMonitor();

/**
 * React hook for accessing performance monitoring
 */
export function useImagePerformanceMonitoring() {
    const recordLoad = (
        url: string,
        loadTime: number,
        success: boolean,
        errorType?: string,
        retryCount?: number,
        size?: number
    ) => {
        imagePerformanceMonitor.recordImageLoad(url, loadTime, success, errorType, retryCount, size);
    };

    const getStats = (timeRangeHours?: number) => {
        return imagePerformanceMonitor.getPerformanceStats(timeRangeHours);
    };

    const getAlerts = (limit?: number) => {
        return imagePerformanceMonitor.getRecentAlerts(limit);
    };

    const getProblematicImages = (timeRangeHours?: number) => {
        return imagePerformanceMonitor.getProblematicImages(timeRangeHours);
    };

    return {
        recordLoad,
        getStats,
        getAlerts,
        getProblematicImages,
        exportMetrics: (format?: 'json' | 'csv') => imagePerformanceMonitor.exportMetrics(format)
    };
}