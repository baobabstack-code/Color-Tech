/**
 * Enhanced image loading utilities for ColorTech website
 * Handles Cloudinary URL validation, sanitization, and fallback logic
 */

export interface ImageOptions {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
    crop?: 'fill' | 'fit' | 'scale' | 'pad';
}

export interface ImageConfig {
    cloudinaryBaseUrl: string;
    defaultFallbacks: {
        hero: string;
        gallery: string;
        blog: string;
        avatar: string;
        general: string;
    };
    optimizationSettings: {
        quality: number;
        formats: string[];
        sizes: number[];
    };
}

export type ContentType = 'hero' | 'gallery' | 'blog' | 'avatar' | 'general';

// Default configuration
const DEFAULT_CONFIG: ImageConfig = {
    cloudinaryBaseUrl: 'https://res.cloudinary.com',
    defaultFallbacks: {
        hero: '/images/fallbacks/hero-fallback.jpg',
        gallery: '/images/fallbacks/gallery-fallback.jpg',
        blog: '/images/fallbacks/blog-fallback.jpg',
        avatar: '/images/fallbacks/avatar-fallback.jpg',
        general: '/images/fallbacks/general-fallback.jpg',
    },
    optimizationSettings: {
        quality: 80,
        formats: ['webp', 'jpg'],
        sizes: [640, 768, 1024, 1280, 1920],
    },
};

/**
 * Validates if a URL is a properly formatted Cloudinary URL
 */
export function validateCloudinaryUrl(url: string): boolean {
    if (!url || typeof url !== 'string') {
        return false;
    }

    try {
        const urlObj = new URL(url);

        // Must be HTTPS
        if (urlObj.protocol !== 'https:') {
            return false;
        }

        // Check if it's a Cloudinary URL
        const cloudinaryPattern = /^res\.cloudinary\.com$/;
        if (!cloudinaryPattern.test(urlObj.hostname)) {
            return false;
        }

        // Check if it has the proper path structure: /cloud_name/image/upload/...
        const pathPattern = /^\/[^\/]+\/image\/upload\/.+/;
        if (!pathPattern.test(urlObj.pathname)) {
            return false;
        }

        return true;
    } catch {
        return false;
    }
}

/**
 * Sanitizes and validates Cloudinary URL parameters
 */
export function sanitizeCloudinaryUrl(url: string): string {
    if (!validateCloudinaryUrl(url)) {
        throw new Error('Invalid Cloudinary URL format');
    }

    try {
        const urlObj = new URL(url);

        // Remove potentially harmful parameters
        const allowedParams = ['v', 'q', 'f', 'w', 'h', 'c', 'g', 'x', 'y', 'r', 'e', 'o', 'co', 'b'];
        const searchParams = new URLSearchParams();

        urlObj.searchParams.forEach((value, key) => {
            if (allowedParams.includes(key)) {
                // Validate parameter values
                if (key === 'q' && (isNaN(Number(value)) || Number(value) < 1 || Number(value) > 100)) {
                    return; // Skip invalid quality values
                }
                if ((key === 'w' || key === 'h') && (isNaN(Number(value)) || Number(value) < 1 || Number(value) > 5000)) {
                    return; // Skip invalid width/height values
                }
                searchParams.set(key, value);
            }
        });

        urlObj.search = searchParams.toString();
        return urlObj.toString();
    } catch (error) {
        throw new Error(`Failed to sanitize Cloudinary URL: ${error}`);
    }
}

/**
 * Generates optimized Cloudinary URL with specified options
 */
export function generateOptimizedCloudinaryUrl(url: string, options: ImageOptions = {}): string {
    if (!validateCloudinaryUrl(url)) {
        throw new Error('Invalid Cloudinary URL format');
    }

    try {
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split('/');

        // Find the upload index to insert transformations
        const uploadIndex = pathParts.findIndex(part => part === 'upload');
        if (uploadIndex === -1) {
            throw new Error('Invalid Cloudinary URL structure');
        }

        // Build transformation string
        const transformations: string[] = [];

        if (options.width) transformations.push(`w_${options.width}`);
        if (options.height) transformations.push(`h_${options.height}`);
        if (options.quality) transformations.push(`q_${Math.min(100, Math.max(1, options.quality))}`);
        if (options.format) transformations.push(`f_${options.format}`);
        if (options.crop) transformations.push(`c_${options.crop}`);

        // Add default optimizations if none specified
        if (transformations.length === 0) {
            transformations.push('f_auto', 'q_auto');
        }

        // Insert transformations into path
        if (transformations.length > 0) {
            pathParts.splice(uploadIndex + 1, 0, transformations.join(','));
        }

        urlObj.pathname = pathParts.join('/');
        return urlObj.toString();
    } catch (error) {
        throw new Error(`Failed to generate optimized URL: ${error}`);
    }
}

/**
 * Selects appropriate fallback image based on content type
 */
export function getFallbackImage(contentType: ContentType, config: ImageConfig = DEFAULT_CONFIG): string {
    return config.defaultFallbacks[contentType] || config.defaultFallbacks.general;
}

/**
 * Determines content type from URL or context
 */
export function determineContentType(url: string, context?: string): ContentType {
    const lowerUrl = url.toLowerCase();
    const lowerContext = context?.toLowerCase() || '';

    // Check for hero images
    if (lowerUrl.includes('hero') || lowerContext.includes('hero') || lowerContext.includes('banner')) {
        return 'hero';
    }

    // Check for gallery images
    if (lowerUrl.includes('gallery') || lowerUrl.includes('portfolio') || lowerContext.includes('gallery')) {
        return 'gallery';
    }

    // Check for blog images
    if (lowerUrl.includes('blog') || lowerUrl.includes('article') || lowerContext.includes('blog')) {
        return 'blog';
    }

    // Check for avatar images
    if (lowerUrl.includes('avatar') || lowerUrl.includes('profile') || lowerContext.includes('avatar')) {
        return 'avatar';
    }

    return 'general';
}

/**
 * Validates image URL parameters for security
 */
export function validateImageParameters(params: Record<string, string>): boolean {
    const dangerousPatterns = [
        /javascript:/i,
        /data:/i,
        /vbscript:/i,
        /<script/i,
        /on\w+=/i,
    ];

    for (const [key, value] of Object.entries(params)) {
        const combined = `${key}=${value}`;
        if (dangerousPatterns.some(pattern => pattern.test(combined))) {
            return false;
        }
    }

    return true;
}

/**
 * Extracts Cloudinary public ID from URL
 */
export function extractCloudinaryPublicId(url: string): string | null {
    if (!validateCloudinaryUrl(url)) {
        return null;
    }

    try {
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split('/');
        const uploadIndex = pathParts.findIndex(part => part === 'upload');

        if (uploadIndex === -1 || uploadIndex >= pathParts.length - 1) {
            return null;
        }

        // Skip transformation parameters and get the public ID
        let publicIdIndex = uploadIndex + 1;

        // Skip transformation parameters (they contain commas or start with v followed by numbers)
        while (publicIdIndex < pathParts.length) {
            const part = pathParts[publicIdIndex];
            if (part.includes(',') || /^v\d+$/.test(part)) {
                publicIdIndex++;
            } else {
                break;
            }
        }

        if (publicIdIndex < pathParts.length) {
            // Join remaining parts as public ID (may contain slashes)
            const publicId = pathParts.slice(publicIdIndex).join('/');
            // Remove file extension
            return publicId.replace(/\.[^/.]+$/, '');
        }

        return null;
    } catch {
        return null;
    }
}

/**
 * Checks if an image URL is accessible
 */
export async function checkImageAccessibility(url: string): Promise<boolean> {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch {
        return false;
    }
}

/**
 * Main image loading service class
 */
export class ImageLoadingService {
    private config: ImageConfig;

    constructor(config: Partial<ImageConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
    }

    /**
     * Validates and processes an image URL
     */
    processImageUrl(url: string, options: ImageOptions = {}, contentType?: ContentType): string {
        try {
            // If it's a Cloudinary URL, validate and optimize it
            if (validateCloudinaryUrl(url)) {
                const sanitizedUrl = sanitizeCloudinaryUrl(url);
                return generateOptimizedCloudinaryUrl(sanitizedUrl, options);
            }

            // For non-Cloudinary URLs, return as-is if they seem valid
            if (this.isValidImageUrl(url)) {
                return url;
            }

            // Return fallback if URL is invalid
            const fallbackType = contentType || determineContentType(url);
            return getFallbackImage(fallbackType, this.config);
        } catch (error) {
            console.warn('Failed to process image URL:', error);
            const fallbackType = contentType || determineContentType(url);
            return getFallbackImage(fallbackType, this.config);
        }
    }

    /**
     * Basic URL validation for non-Cloudinary images
     */
    private isValidImageUrl(url: string): boolean {
        try {
            const urlObj = new URL(url);
            return ['http:', 'https:'].includes(urlObj.protocol);
        } catch {
            return false;
        }
    }

    /**
     * Gets fallback image for content type
     */
    getFallbackForType(contentType: ContentType): string {
        return getFallbackImage(contentType, this.config);
    }

    /**
     * Updates configuration
     */
    updateConfig(newConfig: Partial<ImageConfig>): void {
        this.config = { ...this.config, ...newConfig };
    }
}

// Export default instance
export const imageService = new ImageLoadingService();