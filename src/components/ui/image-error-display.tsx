'use client';

import React from 'react';
import { ImageError, imageErrorService } from '@/services/imageService';

interface ImageErrorDisplayProps {
    error?: Error | string;
    errorType?: ImageError['errorType'];
    fallbackSrc?: string;
    onRetry?: () => void;
    showRetryButton?: boolean;
    className?: string;
    size?: 'small' | 'medium' | 'large';
}

/**
 * User-friendly error display component for image loading failures
 */
export function ImageErrorDisplay({
    error,
    errorType = 'unknown',
    fallbackSrc,
    onRetry,
    showRetryButton = true,
    className = '',
    size = 'medium'
}: ImageErrorDisplayProps) {
    const sizeClasses = {
        small: 'w-16 h-16',
        medium: 'w-32 h-32',
        large: 'w-48 h-48'
    };

    const iconSizes = {
        small: 'w-6 h-6',
        medium: 'w-12 h-12',
        large: 'w-16 h-16'
    };

    const textSizes = {
        small: 'text-xs',
        medium: 'text-sm',
        large: 'text-base'
    };

    const userMessage = imageErrorService.getUserFriendlyErrorMessage(errorType);

    return (
        <div className={`
      flex items-center justify-center 
      bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg
      ${sizeClasses[size]} ${className}
    `}>
            <div className="text-center p-2">
                {/* Error Icon */}
                <div className="text-gray-400 mb-2">
                    {errorType === 'network' ? (
                        <svg
                            className={`${iconSizes[size]} mx-auto`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    ) : (
                        <svg
                            className={`${iconSizes[size]} mx-auto`}
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
                    )}
                </div>

                {/* Error Message */}
                <p className={`text-gray-600 ${textSizes[size]} mb-2`}>
                    {userMessage}
                </p>

                {/* Retry Button */}
                {showRetryButton && onRetry && (
                    <button
                        onClick={onRetry}
                        className={`
              px-2 py-1 bg-blue-500 text-white rounded 
              hover:bg-blue-600 transition-colors
              ${textSizes[size]}
            `}
                    >
                        Try Again
                    </button>
                )}

                {/* Fallback Image */}
                {fallbackSrc && (
                    <div className="mt-2">
                        <img
                            src={fallbackSrc}
                            alt="Fallback"
                            className="max-w-full max-h-full object-contain"
                            onError={(e) => {
                                // Hide fallback image if it also fails
                                (e.target as HTMLImageElement).style.display = 'none';
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

/**
 * Inline error message component for smaller spaces
 */
export function InlineImageError({
    errorType = 'unknown',
    onRetry,
    className = ''
}: {
    errorType?: ImageError['errorType'];
    onRetry?: () => void;
    className?: string;
}) {
    const userMessage = imageErrorService.getUserFriendlyErrorMessage(errorType);

    return (
        <div className={`flex items-center space-x-2 text-sm text-gray-600 ${className}`}>
            <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            </svg>
            <span>{userMessage}</span>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="text-blue-500 hover:text-blue-600 underline"
                >
                    Retry
                </button>
            )}
        </div>
    );
}

/**
 * Loading state component with error fallback
 */
export function ImageLoadingState({
    isLoading,
    error,
    errorType,
    onRetry,
    className = '',
    size = 'medium'
}: {
    isLoading: boolean;
    error?: Error | string;
    errorType?: ImageError['errorType'];
    onRetry?: () => void;
    className?: string;
    size?: 'small' | 'medium' | 'large';
}) {
    if (error) {
        return (
            <ImageErrorDisplay
                error={error}
                errorType={errorType}
                onRetry={onRetry}
                className={className}
                size={size}
            />
        );
    }

    if (isLoading) {
        const sizeClasses = {
            small: 'w-16 h-16',
            medium: 'w-32 h-32',
            large: 'w-48 h-48'
        };

        return (
            <div className={`
        flex items-center justify-center 
        bg-gray-100 rounded-lg animate-pulse
        ${sizeClasses[size]} ${className}
      `}>
                <div className="text-gray-400">
                    <svg
                        className="w-8 h-8 animate-spin"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                    </svg>
                </div>
            </div>
        );
    }

    return null;
}