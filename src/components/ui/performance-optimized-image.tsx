"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";
import { EnhancedImage } from "./enhanced-image";

interface PerformanceOptimizedImageProps extends Omit<React.ComponentProps<typeof EnhancedImage>, 'placeholder'> {
    /**
     * Enable lazy loading (default: true for below-the-fold images)
     */
    lazy?: boolean;

    /**
     * Preload this image (for critical above-the-fold content)
     */
    preload?: boolean;

    /**
     * Priority loading (for LCP images)
     */
    priority?: boolean;

    /**
     * Intersection observer root margin for lazy loading
     */
    rootMargin?: string;

    /**
     * Threshold for intersection observer
     */
    threshold?: number;

    /**
     * Placeholder strategy
     */
    placeholder?: 'blur' | 'empty' | 'skeleton';

    /**
     * Blur data URL for placeholder
     */
    blurDataURL?: string;

    /**
     * Enable progressive loading
     */
    progressive?: boolean;

    /**
     * Cache strategy
     */
    cacheStrategy?: 'default' | 'force-cache' | 'no-cache' | 'reload';
}

/**
 * Performance-optimized image component with lazy loading, preloading, and caching
 */
export function PerformanceOptimizedImage({
    lazy = true,
    preload = false,
    priority = false,
    rootMargin = "50px",
    threshold = 0.1,
    placeholder = 'skeleton',
    blurDataURL,
    progressive = true,
    cacheStrategy = 'default',
    className,
    ...props
}: PerformanceOptimizedImageProps) {
    const [isInView, setIsInView] = useState(!lazy);
    const [shouldLoad, setShouldLoad] = useState(priority || preload || !lazy);
    const imgRef = useRef<HTMLDivElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    // Intersection Observer for lazy loading
    useEffect(() => {
        if (!lazy || shouldLoad) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsInView(true);
                        setShouldLoad(true);
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                rootMargin,
                threshold,
            }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        observerRef.current = observer;

        return () => {
            observer.disconnect();
        };
    }, [lazy, shouldLoad, rootMargin, threshold]);

    // Preload image if needed
    useEffect(() => {
        if (preload && props.src) {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = props.src;

            // Add responsive preload hints
            if (props.sizes) {
                link.setAttribute('imagesizes', props.sizes);
            }

            document.head.appendChild(link);

            return () => {
                document.head.removeChild(link);
            };
        }

        return undefined;
    }, [preload, props.src, props.sizes]);

    // Generate blur placeholder
    const generateBlurPlaceholder = useCallback(() => {
        if (blurDataURL) return blurDataURL;

        // Generate a simple blur placeholder
        const canvas = document.createElement('canvas');
        canvas.width = 10;
        canvas.height = 10;
        const ctx = canvas.getContext('2d');

        if (ctx) {
            // Create a simple gradient
            const gradient = ctx.createLinearGradient(0, 0, 10, 10);
            gradient.addColorStop(0, '#f3f4f6');
            gradient.addColorStop(1, '#e5e7eb');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 10, 10);
        }

        return canvas.toDataURL();
    }, [blurDataURL]);

    // Skeleton placeholder component
    const SkeletonPlaceholder = () => (
        <div
            className={cn(
                "animate-pulse bg-gray-200 rounded",
                className
            )}
            style={{
                width: props.width || '100%',
                height: props.height || '200px',
                aspectRatio: props.width && props.height ? `${props.width}/${props.height}` : undefined
            }}
        />
    );

    // Enhanced image options with performance optimizations
    const enhancedImageOptions = {
        ...props.imageOptions,
        // Enable progressive JPEG
        progressive: progressive,
        // Optimize quality based on device capabilities
        quality: props.imageOptions?.quality || (
            typeof window !== 'undefined' &&
                (window.navigator as any)?.connection?.effectiveType === '4g' ? 85 : 75
        ),
        // Auto format selection
        format: props.imageOptions?.format || 'auto',
    };

    // Don't render anything if lazy loading and not in view
    if (lazy && !shouldLoad) {
        return (
            <div ref={imgRef} className={className}>
                {placeholder === 'skeleton' && <SkeletonPlaceholder />}
                {placeholder === 'blur' && (
                    <div
                        className={cn("bg-gray-100 rounded", className)}
                        style={{
                            backgroundImage: `url(${generateBlurPlaceholder()})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            filter: 'blur(10px)',
                            width: props.width || '100%',
                            height: props.height || '200px',
                        }}
                    />
                )}
            </div>
        );
    }

    return (
        <div ref={imgRef} className="relative">
            <EnhancedImage
                {...props}
                imageOptions={enhancedImageOptions}
                priority={priority}
                placeholder={placeholder === 'blur' ? 'blur' : 'empty'}
                blurDataURL={placeholder === 'blur' ? generateBlurPlaceholder() : undefined}
                className={className}
                // Add loading strategy
                loading={priority ? 'eager' : 'lazy'}
            />
        </div>
    );
}

/**
 * Hook for preloading images
 */
export function useImagePreloader() {
    const preloadedImages = useRef(new Set<string>());

    const preloadImage = useCallback((src: string, options?: {
        sizes?: string;
        priority?: boolean;
    }) => {
        if (preloadedImages.current.has(src)) return;

        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;

        if (options?.sizes) {
            link.setAttribute('imagesizes', options.sizes);
        }

        if (options?.priority) {
            link.setAttribute('fetchpriority', 'high');
        }

        document.head.appendChild(link);
        preloadedImages.current.add(src);

        // Clean up after a delay
        setTimeout(() => {
            if (document.head.contains(link)) {
                document.head.removeChild(link);
            }
        }, 10000); // Remove after 10 seconds
    }, []);

    const preloadImages = useCallback((images: Array<{
        src: string;
        sizes?: string;
        priority?: boolean;
    }>) => {
        images.forEach(image => preloadImage(image.src, image));
    }, [preloadImage]);

    return { preloadImage, preloadImages };
}

/**
 * Hook for managing image cache
 */
export function useImageCache() {
    const cache = useRef(new Map<string, {
        blob: Blob;
        timestamp: number;
        url: string;
    }>());

    const getCachedImage = useCallback((src: string) => {
        const cached = cache.current.get(src);
        if (!cached) return null;

        // Check if cache is still valid (24 hours)
        const isValid = Date.now() - cached.timestamp < 24 * 60 * 60 * 1000;
        if (!isValid) {
            cache.current.delete(src);
            URL.revokeObjectURL(cached.url);
            return null;
        }

        return cached.url;
    }, []);

    const cacheImage = useCallback(async (src: string) => {
        try {
            const response = await fetch(src);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            cache.current.set(src, {
                blob,
                timestamp: Date.now(),
                url
            });

            return url;
        } catch (error) {
            console.warn('Failed to cache image:', src, error);
            return src;
        }
    }, []);

    const clearCache = useCallback(() => {
        cache.current.forEach(cached => {
            URL.revokeObjectURL(cached.url);
        });
        cache.current.clear();
    }, []);

    return { getCachedImage, cacheImage, clearCache };
}

/**
 * Component for critical above-the-fold images
 */
export function CriticalImage(props: PerformanceOptimizedImageProps) {
    return (
        <PerformanceOptimizedImage
            {...props}
            priority={true}
            lazy={false}
            preload={true}
            placeholder="blur"
        />
    );
}

/**
 * Component for below-the-fold images with aggressive lazy loading
 */
export function LazyImage(props: PerformanceOptimizedImageProps) {
    return (
        <PerformanceOptimizedImage
            {...props}
            priority={false}
            lazy={true}
            preload={false}
            placeholder="skeleton"
            rootMargin="100px"
        />
    );
}