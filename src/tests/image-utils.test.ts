/**
 * Unit tests for image loading utilities
 */

import {
    validateCloudinaryUrl,
    sanitizeCloudinaryUrl,
    generateOptimizedCloudinaryUrl,
    getFallbackImage,
    determineContentType,
    validateImageParameters,
    extractCloudinaryPublicId,
    ImageLoadingService,
    ImageOptions,
    ContentType,
} from '../lib/image-utils';

describe('Image Utils', () => {
    describe('validateCloudinaryUrl', () => {
        it('should validate correct Cloudinary URLs', () => {
            const validUrls = [
                'https://res.cloudinary.com/demo/image/upload/sample.jpg',
                'https://res.cloudinary.com/my-cloud/image/upload/v1234567890/folder/image.png',
                'https://res.cloudinary.com/test/image/upload/w_300,h_200/sample.webp',
            ];

            validUrls.forEach(url => {
                expect(validateCloudinaryUrl(url)).toBe(true);
            });
        });

        it('should reject invalid Cloudinary URLs', () => {
            const invalidUrls = [
                '',
                null as any,
                undefined as any,
                'not-a-url',
                'https://example.com/image.jpg',
                'https://cloudinary.com/image/upload/sample.jpg', // Wrong subdomain
                'https://res.cloudinary.com/demo/video/upload/sample.mp4', // Video, not image
                'https://res.cloudinary.com/demo/sample.jpg', // Missing /image/upload/
                'http://res.cloudinary.com/demo/image/upload/sample.jpg', // HTTP instead of HTTPS
            ];

            invalidUrls.forEach(url => {
                expect(validateCloudinaryUrl(url)).toBe(false);
            });
        });
    });

    describe('sanitizeCloudinaryUrl', () => {
        it('should sanitize valid Cloudinary URLs', () => {
            const url = 'https://res.cloudinary.com/demo/image/upload/w_300,h_200,q_80/sample.jpg';
            const sanitized = sanitizeCloudinaryUrl(url);
            expect(sanitized).toContain('res.cloudinary.com');
            expect(sanitized).toContain('sample.jpg');
        });

        it('should remove dangerous parameters', () => {
            const url = 'https://res.cloudinary.com/demo/image/upload/w_300,h_200/sample.jpg?script=alert(1)&w=300';
            const sanitized = sanitizeCloudinaryUrl(url);
            expect(sanitized).not.toContain('script=alert(1)');
            expect(sanitized).toContain('w=300'); // Valid parameter should remain
        });

        it('should validate parameter values', () => {
            const url = 'https://res.cloudinary.com/demo/image/upload/sample.jpg?q=150&w=-100&h=abc';
            const sanitized = sanitizeCloudinaryUrl(url);
            expect(sanitized).not.toContain('q=150'); // Invalid quality > 100
            expect(sanitized).not.toContain('w=-100'); // Invalid negative width
            expect(sanitized).not.toContain('h=abc'); // Invalid non-numeric height
        });

        it('should throw error for invalid URLs', () => {
            expect(() => sanitizeCloudinaryUrl('https://example.com/image.jpg')).toThrow();
            expect(() => sanitizeCloudinaryUrl('invalid-url')).toThrow();
        });
    });

    describe('generateOptimizedCloudinaryUrl', () => {
        const baseUrl = 'https://res.cloudinary.com/demo/image/upload/sample.jpg';

        it('should add optimization parameters', () => {
            const options: ImageOptions = {
                width: 300,
                height: 200,
                quality: 80,
                format: 'webp',
                crop: 'fill',
            };

            const optimized = generateOptimizedCloudinaryUrl(baseUrl, options);
            expect(optimized).toContain('w_300');
            expect(optimized).toContain('h_200');
            expect(optimized).toContain('q_80');
            expect(optimized).toContain('f_webp');
            expect(optimized).toContain('c_fill');
        });

        it('should add default optimizations when no options provided', () => {
            const optimized = generateOptimizedCloudinaryUrl(baseUrl);
            expect(optimized).toContain('f_auto');
            expect(optimized).toContain('q_auto');
        });

        it('should clamp quality values', () => {
            const options: ImageOptions = { quality: 150 };
            const optimized = generateOptimizedCloudinaryUrl(baseUrl, options);
            expect(optimized).toContain('q_100'); // Should be clamped to 100
        });

        it('should throw error for invalid URLs', () => {
            expect(() => generateOptimizedCloudinaryUrl('https://example.com/image.jpg')).toThrow();
        });
    });

    describe('getFallbackImage', () => {
        it('should return correct fallback for each content type', () => {
            const contentTypes: ContentType[] = ['hero', 'gallery', 'blog', 'avatar', 'general'];

            contentTypes.forEach(type => {
                const fallback = getFallbackImage(type);
                expect(fallback).toContain(`${type}-fallback.jpg`);
            });
        });

        it('should return general fallback for unknown types', () => {
            const fallback = getFallbackImage('unknown' as ContentType);
            expect(fallback).toContain('general-fallback.jpg');
        });
    });

    describe('determineContentType', () => {
        it('should detect hero images', () => {
            expect(determineContentType('https://example.com/hero-image.jpg')).toBe('hero');
            expect(determineContentType('https://example.com/image.jpg', 'hero section')).toBe('hero');
            expect(determineContentType('https://example.com/image.jpg', 'banner image')).toBe('hero');
        });

        it('should detect gallery images', () => {
            expect(determineContentType('https://example.com/gallery/image.jpg')).toBe('gallery');
            expect(determineContentType('https://example.com/portfolio-item.jpg')).toBe('gallery');
            expect(determineContentType('https://example.com/image.jpg', 'gallery item')).toBe('gallery');
        });

        it('should detect blog images', () => {
            expect(determineContentType('https://example.com/blog/post-image.jpg')).toBe('blog');
            expect(determineContentType('https://example.com/article-header.jpg')).toBe('blog');
            expect(determineContentType('https://example.com/image.jpg', 'blog post')).toBe('blog');
        });

        it('should detect avatar images', () => {
            expect(determineContentType('https://example.com/avatar.jpg')).toBe('avatar');
            expect(determineContentType('https://example.com/profile-pic.jpg')).toBe('avatar');
            expect(determineContentType('https://example.com/image.jpg', 'user avatar')).toBe('avatar');
        });

        it('should default to general for unknown types', () => {
            expect(determineContentType('https://example.com/random-image.jpg')).toBe('general');
            expect(determineContentType('https://example.com/image.jpg', 'some context')).toBe('general');
        });
    });

    describe('validateImageParameters', () => {
        it('should allow safe parameters', () => {
            const safeParams = {
                width: '300',
                height: '200',
                quality: '80',
                format: 'webp',
            };
            expect(validateImageParameters(safeParams)).toBe(true);
        });

        it('should reject dangerous parameters', () => {
            const dangerousParams: Record<string, string>[] = [
                { script: 'javascript:alert(1)' },
                { data: 'data:text/html,<script>alert(1)</script>' },
                { onclick: 'alert(1)' },
                { onload: 'malicious()' },
                { vbscript: 'vbscript:msgbox(1)' },
                { content: '<script>alert(1)</script>' },
            ];

            dangerousParams.forEach(params => {
                expect(validateImageParameters(params)).toBe(false);
            });
        });
    });

    describe('extractCloudinaryPublicId', () => {
        it('should extract public ID from simple URLs', () => {
            const url = 'https://res.cloudinary.com/demo/image/upload/sample.jpg';
            expect(extractCloudinaryPublicId(url)).toBe('sample');
        });

        it('should extract public ID from URLs with transformations', () => {
            const url = 'https://res.cloudinary.com/demo/image/upload/w_300,h_200/sample.jpg';
            expect(extractCloudinaryPublicId(url)).toBe('sample');
        });

        it('should extract public ID from URLs with version', () => {
            const url = 'https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg';
            expect(extractCloudinaryPublicId(url)).toBe('sample');
        });

        it('should extract public ID from URLs with folders', () => {
            const url = 'https://res.cloudinary.com/demo/image/upload/folder/subfolder/sample.jpg';
            expect(extractCloudinaryPublicId(url)).toBe('folder/subfolder/sample');
        });

        it('should return null for invalid URLs', () => {
            expect(extractCloudinaryPublicId('https://example.com/image.jpg')).toBeNull();
            expect(extractCloudinaryPublicId('invalid-url')).toBeNull();
        });
    });

    describe('ImageLoadingService', () => {
        let service: ImageLoadingService;

        beforeEach(() => {
            service = new ImageLoadingService();
        });

        describe('processImageUrl', () => {
            it('should process valid Cloudinary URLs', () => {
                const url = 'https://res.cloudinary.com/demo/image/upload/sample.jpg';
                const processed = service.processImageUrl(url, { width: 300 });
                expect(processed).toContain('w_300');
                expect(processed).toContain('sample.jpg');
            });

            it('should return fallback for invalid URLs', () => {
                const processed = service.processImageUrl('invalid-url', {}, 'hero');
                expect(processed).toBe('/images/fallbacks/hero-fallback.jpg');
            });

            it('should pass through valid non-Cloudinary URLs', () => {
                const url = 'https://example.com/image.jpg';
                const processed = service.processImageUrl(url);
                expect(processed).toBe(url);
            });

            it('should determine content type automatically', () => {
                const processed = service.processImageUrl('invalid-hero-url');
                expect(processed).toBe('/images/fallbacks/hero-fallback.jpg');
            });
        });

        describe('getFallbackForType', () => {
            it('should return correct fallback for each type', () => {
                expect(service.getFallbackForType('hero')).toBe('/images/fallbacks/hero-fallback.jpg');
                expect(service.getFallbackForType('gallery')).toBe('/images/fallbacks/gallery-fallback.jpg');
                expect(service.getFallbackForType('blog')).toBe('/images/fallbacks/blog-fallback.jpg');
                expect(service.getFallbackForType('avatar')).toBe('/images/fallbacks/avatar-fallback.jpg');
                expect(service.getFallbackForType('general')).toBe('/images/fallbacks/general-fallback.jpg');
            });
        });

        describe('updateConfig', () => {
            it('should update configuration', () => {
                const newConfig = {
                    defaultFallbacks: {
                        hero: '/custom/hero.jpg',
                        gallery: '/custom/gallery.jpg',
                        blog: '/custom/blog.jpg',
                        avatar: '/custom/avatar.jpg',
                        general: '/custom/general.jpg',
                    },
                };

                service.updateConfig(newConfig);
                expect(service.getFallbackForType('hero')).toBe('/custom/hero.jpg');
            });
        });
    });

    describe('Edge Cases and Error Handling', () => {
        it('should handle malformed URLs gracefully', () => {
            const malformedUrls = [
                'https://',
                'https://res.cloudinary.com',
                'https://res.cloudinary.com/',
                'https://res.cloudinary.com/demo',
                'https://res.cloudinary.com/demo/image',
            ];

            malformedUrls.forEach(url => {
                expect(validateCloudinaryUrl(url)).toBe(false);
            });
        });

        it('should handle empty or null inputs', () => {
            expect(validateCloudinaryUrl('')).toBe(false);
            expect(validateCloudinaryUrl(null as any)).toBe(false);
            expect(validateCloudinaryUrl(undefined as any)).toBe(false);
        });

        it('should handle URLs with special characters', () => {
            const url = 'https://res.cloudinary.com/demo/image/upload/special%20chars%20&%20symbols.jpg';
            expect(validateCloudinaryUrl(url)).toBe(true);
        });

        it('should handle very long URLs', () => {
            const longPath = 'a'.repeat(1000);
            const url = `https://res.cloudinary.com/demo/image/upload/${longPath}.jpg`;
            expect(validateCloudinaryUrl(url)).toBe(true);
        });
    });
});