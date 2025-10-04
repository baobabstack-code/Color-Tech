import { describe, it, expect } from '@jest/globals';

// Mock Next.js config for testing
const mockNextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
            {
                protocol: "https",
                hostname: "via.placeholder.com",
            },
            {
                protocol: "https",
                hostname: "*.public.blob.vercel-storage.com",
            },
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
                pathname: "/**",
            },
        ],
        domains: ["localhost"],
        formats: ["image/webp", "image/avif"],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        minimumCacheTTL: 60,
        dangerouslyAllowSVG: false,
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
        unoptimized: false,
        loader: "default",
    },
};

describe('Next.js Image Configuration', () => {
    it('should have proper Cloudinary domain configuration', () => {
        const cloudinaryPattern = mockNextConfig.images.remotePatterns.find(
            pattern => pattern.hostname === 'res.cloudinary.com'
        );

        expect(cloudinaryPattern).toBeDefined();
        expect(cloudinaryPattern?.protocol).toBe('https');
        expect(cloudinaryPattern?.pathname).toBe('/**');
    });

    it('should have optimized image formats configured', () => {
        expect(mockNextConfig.images.formats).toContain('image/webp');
        expect(mockNextConfig.images.formats).toContain('image/avif');
    });

    it('should have proper device sizes for responsive images', () => {
        const deviceSizes = mockNextConfig.images.deviceSizes;
        expect(deviceSizes).toContain(640); // Mobile
        expect(deviceSizes).toContain(1080); // Desktop
        expect(deviceSizes).toContain(1920); // Large desktop
    });

    it('should have proper image sizes for different use cases', () => {
        const imageSizes = mockNextConfig.images.imageSizes;
        expect(imageSizes).toContain(64); // Small icons
        expect(imageSizes).toContain(128); // Medium thumbnails
        expect(imageSizes).toContain(256); // Large thumbnails
    });

    it('should have security settings configured', () => {
        expect(mockNextConfig.images.dangerouslyAllowSVG).toBe(false);
        expect(mockNextConfig.images.contentSecurityPolicy).toContain("default-src 'self'");
    });

    it('should have caching configured', () => {
        expect(mockNextConfig.images.minimumCacheTTL).toBe(60);
    });

    it('should have proper loader configuration', () => {
        expect(mockNextConfig.images.loader).toBe('default');
    });

    it('should have image optimization enabled', () => {
        expect(mockNextConfig.images.unoptimized).toBe(false);
    });
});

// Test Cloudinary URL validation
describe('Cloudinary URL Validation', () => {
    const validCloudinaryUrls = [
        'https://res.cloudinary.com/demo/image/upload/sample.jpg',
        'https://res.cloudinary.com/mycloud/image/upload/v1234567890/folder/image.png',
        'https://res.cloudinary.com/test/image/upload/w_300,h_200,c_fill/sample.webp',
    ];

    const invalidUrls = [
        'http://res.cloudinary.com/demo/image/upload/sample.jpg', // HTTP instead of HTTPS
        'https://other-domain.com/image.jpg',
        'https://res.cloudinary.com/demo/video/upload/sample.mp4', // Video instead of image
    ];

    it('should validate proper Cloudinary URLs', () => {
        validCloudinaryUrls.forEach(url => {
            const urlObj = new URL(url);
            expect(urlObj.hostname).toBe('res.cloudinary.com');
            expect(urlObj.protocol).toBe('https:');
            expect(urlObj.pathname).toMatch(/^\/[^\/]+\/image\/upload\//);
        });
    });

    it('should reject invalid URLs', () => {
        invalidUrls.forEach(url => {
            try {
                const urlObj = new URL(url);
                const isValidCloudinary =
                    urlObj.hostname === 'res.cloudinary.com' &&
                    urlObj.protocol === 'https:' &&
                    urlObj.pathname.includes('/image/upload/');
                expect(isValidCloudinary).toBe(false);
            } catch (error) {
                // Invalid URL format
                expect(error).toBeInstanceOf(Error);
            }
        });
    });
});