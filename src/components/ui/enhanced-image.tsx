"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";
import {
    imageService,
    ContentType,
    ImageOptions,
    determineContentType
} from "@/lib/image-utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileDetectionBoundary } from "./mobile-detection-boundary";
import { useImageErrorHandling, ImageErrorRecovery, ImageError } from "@/services/imageService";
import { ImageErrorDisplay, ImageLoadingState } from "./image-error-display";
import { useImagePerformanceMonitoring } from "@/services/imagePerformanceMonitor";

interface EnhancedImageProps extends Omit<ImageProps, "src" | "alt" | "onError" | "onLoad"> {
    /**
     * Image source URL
     */
    src: string;

    /**
     * Alternative text for the image (required for accessibility)
     */
    alt: string;

    /**
     * Content type for fallback selection
     */
    contentType?: ContentType;

    /**
     * Custom fallback image URL
     */
    fallbackSrc?: string;

    /**
     * Image optimization options
     */
    imageOptions?: ImageOptions;

    /**
     * Maximum number of retry attempts
     */
    maxRetries?: number;

    /**
     * Retry delay in milliseconds
     */
    retryDelay?: number;

    /**
     * Show loading skeleton
     */
    showLoadingSkeleton?: boolean;

    /**
     * Show error state UI
     */
    showErrorState?: boolean;

    /**
     * Custom loading component
     */
    loadingComponent?: React.ReactNode;

    /**
     * Custom error component
     */
    errorComponent?: React.ReactNode;

    /**
     * Callback when image loads successfully
     */
    onLoad?: () => void;

    /**
     * Callback when image fails to load (after all retries)
     */
    onError?: (error: Error) => void;

    /**
     * Callback when retry attempt is made
     */
    onRetry?: (attempt: number) => void;

    /**
     * Additional CSS classes
     */
    className?: string;

    /**
     * Whether the image is decorative only
     */
    decorative?: boolean;

    /**
     * Optional caption
     */
    caption?: React.ReactNode;

    /**
     * Long description for complex images
     */
    longDescription?: string;
}

interface ImageState {
    isLoading: boolean;
    hasError: boolean;
    retryCount: number;
    currentSrc: string;
    errorMessage?: string;
    errorType?: ImageError['errorType'];
    loadStartTime?: number;
}

/**
 * Enhanced Image component with automatic error handling, fallbacks, and retry logic
 */
function EnhancedImageInner({
    src,
    alt,
    contentType,
    fallbackSrc,
    imageOptions = {},
    maxRetries = 3,
    retryDelay = 1000,
    showLoadingSkeleton = true,
    showErrorState = true,
    loadingComponent,
    errorComponent,
    onLoad,
    onError,
    onRetry,
    className,
    decorative = false,
    caption,
    longDescription,
    ...props
}: EnhancedImageProps) {
    const isMobile = useIsMobile();
    const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const descriptionId = React.useId();
    const { handleImageError, handleImageSuccess, getUserFriendlyMessage, hasRecentFailures } = useImageErrorHandling();
    const { recordLoad } = useImagePerformanceMonitoring();

    // Initialize state
    const [state, setState] = useState<ImageState>(() => {
        const determinedContentType = contentType || determineContentType(src);
        const processedSrc = imageService.processImageUrl(src, imageOptions, determinedContentType);

        return {
            isLoading: true,
            hasError: false,
            retryCount: 0,
            currentSrc: processedSrc,
            loadStartTime: Date.now(),
        };
    });

    // Process image options based on mobile state
    const processedImageOptions = React.useMemo(() => {
        const options = { ...imageOptions };

        // Adjust quality for mobile devices
        if (isMobile && !options.quality) {
            options.quality = 75; // Lower quality for mobile to save bandwidth
        }

        // Auto format selection
        if (!options.format) {
            options.format = 'auto';
        }

        return options;
    }, [imageOptions, isMobile]);

    // Handle successful image load
    const handleLoad = useCallback(() => {
        setState(prev => {
            // Calculate load time if we have a start time
            const loadTime = prev.loadStartTime ? Date.now() - prev.loadStartTime : undefined;

            // Log successful load to error service
            handleImageSuccess(prev.currentSrc, loadTime);

            // Record performance metrics
            if (loadTime !== undefined) {
                recordLoad(prev.currentSrc, loadTime, true, undefined, prev.retryCount);
            }

            return {
                ...prev,
                isLoading: false,
                hasError: false,
            };
        });
        onLoad?.();
    }, [onLoad, handleImageSuccess, recordLoad]);

    // Handle image error with retry logic
    const handleError = useCallback(async (error?: Error) => {
        const errorObj = error || new Error('Image failed to load');

        // Determine error type
        let errorType: ImageError['errorType'] = 'unknown';
        if (errorObj.message.includes('network') || errorObj.message.includes('fetch')) {
            errorType = 'network';
        } else if (errorObj.message.includes('optimization') || errorObj.message.includes('next/image')) {
            errorType = 'optimization';
        } else if (errorObj.message.includes('invalid') || errorObj.message.includes('format')) {
            errorType = 'validation';
        }

        // Log the error
        handleImageError(src, errorObj, errorType);

        // Record performance metrics for failed load
        const loadTime = state.loadStartTime ? Date.now() - state.loadStartTime : 0;
        recordLoad(src, loadTime, false, errorType, state.retryCount);

        setState(prev => {
            // If we haven't exceeded max retries, attempt recovery
            if (prev.retryCount < maxRetries) {
                const newRetryCount = prev.retryCount + 1;

                // Clear any existing timeout
                if (retryTimeoutRef.current) {
                    clearTimeout(retryTimeoutRef.current);
                }

                // Attempt error recovery
                ImageErrorRecovery.attemptRecovery(prev.currentSrc, errorType, newRetryCount - 1)
                    .then(recoveredUrl => {
                        if (recoveredUrl) {
                            // Recovery successful, use recovered URL
                            setState(current => ({
                                ...current,
                                isLoading: true,
                                hasError: false,
                                currentSrc: recoveredUrl,
                                loadStartTime: Date.now(),
                            }));
                        } else {
                            // Recovery failed, schedule normal retry
                            retryTimeoutRef.current = setTimeout(() => {
                                setState(current => ({
                                    ...current,
                                    isLoading: true,
                                    hasError: false,
                                    retryCount: newRetryCount,
                                    loadStartTime: Date.now(),
                                }));
                            }, retryDelay * newRetryCount);
                        }
                    })
                    .catch(() => {
                        // Recovery attempt failed, schedule normal retry
                        retryTimeoutRef.current = setTimeout(() => {
                            setState(current => ({
                                ...current,
                                isLoading: true,
                                hasError: false,
                                retryCount: newRetryCount,
                                loadStartTime: Date.now(),
                            }));
                        }, retryDelay * newRetryCount);
                    });

                onRetry?.(newRetryCount);

                return {
                    ...prev,
                    isLoading: false,
                    hasError: true,
                    retryCount: newRetryCount,
                    errorMessage: `Retry attempt ${newRetryCount}/${maxRetries}`,
                    errorType,
                };
            }

            // Max retries exceeded, use fallback
            const determinedContentType = contentType || determineContentType(src);
            const fallbackUrl = fallbackSrc || imageService.getFallbackForType(determinedContentType);

            // If we're already using a fallback and it failed, show error state
            if (prev.currentSrc === fallbackUrl) {
                onError?.(errorObj);
                return {
                    ...prev,
                    isLoading: false,
                    hasError: true,
                    errorMessage: 'Failed to load image and fallback',
                    errorType,
                };
            }

            // Switch to fallback image
            return {
                ...prev,
                isLoading: true,
                hasError: false,
                currentSrc: fallbackUrl,
                errorMessage: 'Using fallback image',
                loadStartTime: Date.now(),
            };
        });
    }, [src, contentType, fallbackSrc, maxRetries, retryDelay, onError, onRetry, handleImageError, recordLoad, state.loadStartTime, state.retryCount]);

    // Clean up timeout on unmount
    useEffect(() => {
        return () => {
            if (retryTimeoutRef.current) {
                clearTimeout(retryTimeoutRef.current);
            }
        };
    }, []);

    // Update processed src when dependencies change
    useEffect(() => {
        const determinedContentType = contentType || determineContentType(src);
        const processedSrc = imageService.processImageUrl(src, processedImageOptions, determinedContentType);

        setState(prev => ({
            ...prev,
            currentSrc: processedSrc,
            isLoading: true,
            hasError: false,
            retryCount: 0,
            loadStartTime: Date.now(),
        }));
    }, [src, processedImageOptions, contentType]);

    // Loading skeleton component
    const LoadingSkeleton = () => (
        <div
            className={cn(
                "animate-pulse bg-gray-200 dark:bg-gray-700 rounded",
                className
            )}
            style={{
                width: props.width || '100%',
                height: props.height || '200px'
            }}
            aria-label="Loading image..."
        />
    );

    // Error state component
    const ErrorState = () => (
        <div
            className={cn(
                "flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 rounded border-2 border-dashed border-gray-300 dark:border-gray-600 p-4 text-center",
                className
            )}
            style={{
                width: props.width || '100%',
                height: props.height || '200px'
            }}
        >
            <svg
                className="w-8 h-8 text-gray-400 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
            </svg>
            <p className="text-sm text-gray-500 dark:text-gray-400">
                {state.errorMessage || 'Failed to load image'}
            </p>
            {state.retryCount < maxRetries && (
                <p className="text-xs text-gray-400 mt-1">
                    Retrying...
                </p>
            )}
        </div>
    );

    // Show loading state
    if (state.isLoading && showLoadingSkeleton) {
        return loadingComponent || (
            <ImageLoadingState
                isLoading={true}
                className={className}
                size={props.width && props.height ? 'large' : 'medium'}
            />
        );
    }

    // Show error state if image failed and no fallback available
    if (state.hasError && showErrorState && state.currentSrc === (fallbackSrc || imageService.getFallbackForType(contentType || 'general'))) {
        const handleRetry = () => {
            setState(prev => ({
                ...prev,
                isLoading: true,
                hasError: false,
                retryCount: 0,
                loadStartTime: Date.now(),
            }));
        };

        return errorComponent || (
            <ImageErrorDisplay
                error={state.errorMessage}
                errorType={state.errorType}
                onRetry={state.retryCount < maxRetries ? handleRetry : undefined}
                className={className}
                size={props.width && props.height ? 'large' : 'medium'}
            />
        );
    }

    return (
        <figure className={cn("relative", className)}>
            <Image
                {...props}
                src={state.currentSrc}
                alt={decorative ? "" : alt}
                aria-hidden={decorative}
                aria-describedby={longDescription ? descriptionId : undefined}
                onLoad={handleLoad}
                onError={() => handleError()}
                className={cn("max-w-full h-auto", className)}
            />

            {/* Visually hidden long description for screen readers */}
            {longDescription && (
                <div id={descriptionId} className="sr-only">
                    {longDescription}
                </div>
            )}

            {/* Optional visible caption */}
            {caption && (
                <figcaption className="text-sm text-muted-foreground mt-2">
                    {caption}
                </figcaption>
            )}

            {/* Loading overlay for retry states */}
            {state.isLoading && !showLoadingSkeleton && (
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
            )}
        </figure>
    );
}

/**
 * Enhanced Decorative Image component for purely decorative images
 */
export function EnhancedDecorativeImage(
    props: Omit<EnhancedImageProps, "alt" | "decorative">
) {
    return (
        <EnhancedImage
            {...props}
            alt=""
            decorative={true}
        />
    );
}

/**
 * Hook for preloading images
 */
export function useImagePreloader(urls: string[]) {
    const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
    const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

    useEffect(() => {
        const preloadImage = (url: string) => {
            return new Promise<void>((resolve, reject) => {
                const img = new window.Image();
                img.onload = () => {
                    setLoadedImages(prev => new Set(prev).add(url));
                    resolve();
                };
                img.onerror = () => {
                    setFailedImages(prev => new Set(prev).add(url));
                    reject(new Error(`Failed to preload image: ${url}`));
                };
                img.src = url;
            });
        };

        urls.forEach(url => {
            if (!loadedImages.has(url) && !failedImages.has(url)) {
                preloadImage(url).catch(() => {
                    // Error already handled in the promise
                });
            }
        });
    }, [urls, loadedImages, failedImages]);

    return {
        loadedImages,
        failedImages,
        isLoaded: (url: string) => loadedImages.has(url),
        hasFailed: (url: string) => failedImages.has(url),
    };
}

/**
 * Enhanced Image component wrapped with mobile detection error boundary
 */
export function EnhancedImage(props: EnhancedImageProps) {
    return (
        <MobileDetectionBoundary>
            <EnhancedImageInner {...props} />
        </MobileDetectionBoundary>
    );
}

export default EnhancedImage;