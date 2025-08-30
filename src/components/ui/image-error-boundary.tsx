'use client';

import React, { Component, ReactNode } from 'react';
import { imageErrorService, ImageError } from '@/services/imageService';

interface ImageErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ImageErrorBoundaryState {
    hasError: boolean;
    error?: Error;
    errorType?: ImageError['errorType'];
}

/**
 * Error boundary specifically for image-related errors
 */
export class ImageErrorBoundary extends Component<
    ImageErrorBoundaryProps,
    ImageErrorBoundaryState
> {
    constructor(props: ImageErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ImageErrorBoundaryState {
        // Determine error type based on error message
        let errorType: ImageError['errorType'] = 'unknown';

        if (error.message.includes('network') || error.message.includes('fetch')) {
            errorType = 'network';
        } else if (error.message.includes('optimization') || error.message.includes('next/image')) {
            errorType = 'optimization';
        } else if (error.message.includes('invalid') || error.message.includes('format')) {
            errorType = 'validation';
        }

        return {
            hasError: true,
            error,
            errorType
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Log the error
        imageErrorService.logImageError(
            'component-boundary',
            error,
            this.state.errorType || 'unknown'
        );

        // Call custom error handler if provided
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }
    }

    render() {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default fallback UI
            return (
                <div className="flex items-center justify-center p-4 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                    <div className="text-center">
                        <div className="text-gray-500 mb-2">
                            <svg
                                className="w-12 h-12 mx-auto"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                        <p className="text-sm text-gray-600">
                            {imageErrorService.getUserFriendlyErrorMessage(
                                this.state.errorType || 'unknown'
                            )}
                        </p>
                        <button
                            onClick={() => this.setState({ hasError: false })}
                            className="mt-2 px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

/**
 * Hook-based error boundary for functional components
 */
export function useImageErrorBoundary() {
    const [error, setError] = React.useState<Error | null>(null);
    const [errorType, setErrorType] = React.useState<ImageError['errorType']>('unknown');

    const resetError = () => {
        setError(null);
        setErrorType('unknown');
    };

    const handleError = (error: Error, type: ImageError['errorType'] = 'unknown') => {
        setError(error);
        setErrorType(type);
        imageErrorService.logImageError('hook-boundary', error, type);
    };

    return {
        error,
        errorType,
        resetError,
        handleError,
        hasError: error !== null
    };
}