'use client';

import React, { useState, useEffect } from 'react';
import { useImagePerformanceMonitoring } from '@/services/imagePerformanceMonitor';

interface DashboardProps {
    timeRange?: number; // hours
    autoRefresh?: boolean;
    refreshInterval?: number; // milliseconds
}

export function ImagePerformanceDashboard({
    timeRange = 24,
    autoRefresh = true,
    refreshInterval = 30000
}: DashboardProps) {
    const { getStats, getAlerts, getProblematicImages } = useImagePerformanceMonitoring();
    const [stats, setStats] = useState(getStats(timeRange));
    const [alerts, setAlerts] = useState(getAlerts(10));
    const [problematicImages, setProblematicImages] = useState(getProblematicImages(timeRange));
    const [selectedTab, setSelectedTab] = useState<'overview' | 'alerts' | 'problems'>('overview');

    useEffect(() => {
        const refreshData = () => {
            setStats(getStats(timeRange));
            setAlerts(getAlerts(10));
            setProblematicImages(getProblematicImages(timeRange));
        };

        // Initial data load
        refreshData();

        if (autoRefresh) {
            const interval = setInterval(refreshData, refreshInterval);
            return () => clearInterval(interval);
        }

        // Return undefined for the else case
        return undefined;
    }, [timeRange, autoRefresh, refreshInterval, getStats, getAlerts, getProblematicImages]);

    const formatLoadTime = (ms: number) => {
        if (ms < 1000) return `${ms.toFixed(0)}ms`;
        return `${(ms / 1000).toFixed(1)}s`;
    };

    const formatPercentage = (value: number) => {
        return `${(value * 100).toFixed(1)}%`;
    };

    const getStatusColor = (successRate: number) => {
        if (successRate >= 0.95) return 'text-green-600';
        if (successRate >= 0.85) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getLoadTimeColor = (loadTime: number) => {
        if (loadTime <= 1000) return 'text-green-600';
        if (loadTime <= 2000) return 'text-yellow-600';
        return 'text-red-600';
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Image Performance Dashboard
                </h2>
                <p className="text-gray-600">
                    Monitoring image loading performance over the last {timeRange} hours
                </p>
            </div>

            {/* Tab Navigation */}
            <div className="mb-6 border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    {[
                        { id: 'overview', label: 'Overview' },
                        { id: 'alerts', label: `Alerts (${alerts.length})` },
                        { id: 'problems', label: `Problem Images (${problematicImages.length})` }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setSelectedTab(tab.id as any)}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${selectedTab === tab.id
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Overview Tab */}
            {selectedTab === 'overview' && (
                <div className="space-y-6">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-500">Total Images</h3>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalImages}</p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-500">Success Rate</h3>
                            <p className={`text-2xl font-bold ${getStatusColor(stats.successRate)}`}>
                                {formatPercentage(stats.successRate)}
                            </p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-500">Avg Load Time</h3>
                            <p className={`text-2xl font-bold ${getLoadTimeColor(stats.averageLoadTime)}`}>
                                {formatLoadTime(stats.averageLoadTime)}
                            </p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-500">P95 Load Time</h3>
                            <p className={`text-2xl font-bold ${getLoadTimeColor(stats.p95LoadTime)}`}>
                                {formatLoadTime(stats.p95LoadTime)}
                            </p>
                        </div>
                    </div>

                    {/* Performance by Device */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Performance by Device</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {Object.entries(stats.performanceByDevice).map(([device, data]) => (
                                <div key={device} className="bg-white p-3 rounded border">
                                    <h4 className="font-medium text-gray-700 capitalize">{device}</h4>
                                    <div className="mt-2 space-y-1 text-sm">
                                        <div>
                                            Success Rate:
                                            <span className={`ml-1 font-medium ${getStatusColor(data.successRate)}`}>
                                                {formatPercentage(data.successRate)}
                                            </span>
                                        </div>
                                        <div>
                                            Avg Load Time:
                                            <span className={`ml-1 font-medium ${getLoadTimeColor(data.averageLoadTime)}`}>
                                                {formatLoadTime(data.averageLoadTime)}
                                            </span>
                                        </div>
                                        <div>Requests: <span className="font-medium">{data.count}</span></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Error Types */}
                    {Object.keys(stats.errorsByType).length > 0 && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Errors by Type</h3>
                            <div className="space-y-2">
                                {Object.entries(stats.errorsByType).map(([type, count]) => (
                                    <div key={type} className="flex justify-between items-center">
                                        <span className="text-gray-700 capitalize">{type}</span>
                                        <span className="font-medium text-red-600">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Slowest Images */}
                    {stats.slowestImages.length > 0 && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Slowest Images</h3>
                            <div className="space-y-2">
                                {stats.slowestImages.slice(0, 5).map((image, index) => (
                                    <div key={index} className="flex justify-between items-center text-sm">
                                        <span className="text-gray-700 truncate flex-1 mr-4">
                                            {image.url}
                                        </span>
                                        <span className={`font-medium ${getLoadTimeColor(image.loadTime)}`}>
                                            {formatLoadTime(image.loadTime)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Alerts Tab */}
            {selectedTab === 'alerts' && (
                <div className="space-y-4">
                    {alerts.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No recent alerts. System is performing well!
                        </div>
                    ) : (
                        alerts.map((alert, index) => (
                            <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3 flex-1">
                                        <h3 className="text-sm font-medium text-red-800">
                                            {alert.type.replace(/_/g, ' ').toUpperCase()}
                                        </h3>
                                        <p className="text-sm text-red-700 mt-1">{alert.message}</p>
                                        <p className="text-xs text-red-600 mt-2">
                                            {alert.timestamp.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Problem Images Tab */}
            {selectedTab === 'problems' && (
                <div className="space-y-4">
                    {problematicImages.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No problematic images detected. All images are loading well!
                        </div>
                    ) : (
                        problematicImages.map((image, index) => (
                            <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-medium text-gray-900 truncate">
                                            {image.url}
                                        </h4>
                                        <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-500">Failure Rate:</span>
                                                <span className={`ml-1 font-medium ${image.failureRate > 0.2 ? 'text-red-600' : 'text-yellow-600'
                                                    }`}>
                                                    {formatPercentage(image.failureRate)}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Avg Load Time:</span>
                                                <span className={`ml-1 font-medium ${getLoadTimeColor(image.averageLoadTime)}`}>
                                                    {formatLoadTime(image.averageLoadTime)}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Requests:</span>
                                                <span className="ml-1 font-medium">{image.totalRequests}</span>
                                            </div>
                                            {image.lastError && (
                                                <div>
                                                    <span className="text-gray-500">Last Error:</span>
                                                    <span className="ml-1 font-medium text-red-600 capitalize">
                                                        {image.lastError}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Auto-refresh indicator */}
            {autoRefresh && (
                <div className="mt-6 text-xs text-gray-500 text-center">
                    Auto-refreshing every {refreshInterval / 1000} seconds
                </div>
            )}
        </div>
    );
}