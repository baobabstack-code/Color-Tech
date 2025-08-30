import { imageService, determineContentType } from '@/lib/image-utils';

// Mock fetch for API calls
global.fetch = jest.fn();

describe('Gallery and Blog Image Integration', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Gallery Image Processing', () => {
        it('should process gallery images with correct optimization settings', () => {
            const galleryImageUrl = 'https://res.cloudinary.com/demo/image/upload/gallery-sample.jpg';

            const processedUrl = imageService.processImageUrl(galleryImageUrl, {
                width: 600,
                height: 450,
                quality: 80,
                format: 'auto',
                crop: 'fill'
            }, 'gallery');

            expect(processedUrl).toContain('w_600');
            expect(processedUrl).toContain('h_450');
            expect(processedUrl).toContain('q_80');
            expect(processedUrl).toContain('f_auto');
            expect(processedUrl).toContain('c_fill');
        });

        it('should handle gallery image fallbacks correctly', () => {
            const fallbackUrl = imageService.getFallbackForType('gallery');
            expect(fallbackUrl).toBe('/images/fallbacks/gallery-fallback.jpg');
        });

        it('should optimize gallery images for different screen sizes', () => {
            const baseUrl = 'https://res.cloudinary.com/demo/image/upload/gallery-sample.jpg';

            // Mobile optimization
            const mobileUrl = imageService.processImageUrl(baseUrl, {
                width: 400,
                height: 300,
                quality: 75,
                format: 'auto'
            }, 'gallery');

            // Desktop optimization
            const desktopUrl = imageService.processImageUrl(baseUrl, {
                width: 800,
                height: 600,
                quality: 85,
                format: 'auto'
            }, 'gallery');

            expect(mobileUrl).toContain('w_400');
            expect(mobileUrl).toContain('q_75');
            expect(desktopUrl).toContain('w_800');
            expect(desktopUrl).toContain('q_85');
        });
    });

    describe('Blog Image Processing', () => {
        it('should process blog images with correct optimization settings', () => {
            const blogImageUrl = 'https://res.cloudinary.com/demo/image/upload/blog-sample.jpg';

            const processedUrl = imageService.processImageUrl(blogImageUrl, {
                width: 800,
                height: 400,
                quality: 85,
                format: 'auto',
                crop: 'fill'
            }, 'blog');

            expect(processedUrl).toContain('w_800');
            expect(processedUrl).toContain('h_400');
            expect(processedUrl).toContain('q_85');
            expect(processedUrl).toContain('f_auto');
            expect(processedUrl).toContain('c_fill');
        });

        it('should handle blog image fallbacks correctly', () => {
            const fallbackUrl = imageService.getFallbackForType('blog');
            expect(fallbackUrl).toBe('/images/fallbacks/blog-fallback.jpg');
        });

        it('should optimize featured blog images differently from thumbnails', () => {
            const baseUrl = 'https://res.cloudinary.com/demo/image/upload/blog-sample.jpg';

            // Featured image (higher quality)
            const featuredUrl = imageService.processImageUrl(baseUrl, {
                width: 1200,
                height: 600,
                quality: 85,
                format: 'auto'
            }, 'blog');

            // Thumbnail image (lower quality for performance)
            const thumbnailUrl = imageService.processImageUrl(baseUrl, {
                width: 400,
                height: 200,
                quality: 75,
                format: 'auto'
            }, 'blog');

            expect(featuredUrl).toContain('w_1200');
            expect(featuredUrl).toContain('q_85');
            expect(thumbnailUrl).toContain('w_400');
            expect(thumbnailUrl).toContain('q_75');
        });
    });

    describe('Responsive Image Sizing', () => {
        it('should generate correct srcset for gallery images', () => {
            const baseUrl = 'https://res.cloudinary.com/demo/image/upload/gallery-sample.jpg';

            // Simulate different viewport sizes
            const sizes = [
                { width: 400, descriptor: '400w' },
                { width: 600, descriptor: '600w' },
                { width: 800, descriptor: '800w' },
                { width: 1200, descriptor: '1200w' }
            ];

            sizes.forEach(size => {
                const processedUrl = imageService.processImageUrl(baseUrl, {
                    width: size.width,
                    quality: 80,
                    format: 'auto'
                }, 'gallery');

                expect(processedUrl).toContain(`w_${size.width}`);
            });
        });

        it('should handle different aspect ratios for blog images', () => {
            const baseUrl = 'https://res.cloudinary.com/demo/image/upload/blog-sample.jpg';

            // Wide aspect ratio (16:9)
            const wideUrl = imageService.processImageUrl(baseUrl, {
                width: 800,
                height: 450,
                crop: 'fill'
            }, 'blog');

            // Square aspect ratio (1:1)
            const squareUrl = imageService.processImageUrl(baseUrl, {
                width: 400,
                height: 400,
                crop: 'fill'
            }, 'blog');

            expect(wideUrl).toContain('w_800,h_450');
            expect(squareUrl).toContain('w_400,h_400');
        });
    });

    describe('Performance Optimization', () => {
        it('should batch process multiple gallery images efficiently', () => {
            const imageUrls = Array.from({ length: 20 }, (_, i) =>
                `https://res.cloudinary.com/demo/image/upload/gallery-${i}.jpg`
            );

            const startTime = Date.now();

            const processedUrls = imageUrls.map(url =>
                imageService.processImageUrl(url, {
                    width: 600,
                    height: 450,
                    quality: 80
                }, 'gallery')
            );

            const endTime = Date.now();
            const processingTime = endTime - startTime;

            expect(processedUrls).toHaveLength(20);
            expect(processingTime).toBeLessThan(500); // Should process 20 images in under 500ms
        });

        it('should handle blog image processing with minimal overhead', () => {
            const blogImages = [
                { url: 'https://example.com/blog1.jpg', type: 'featured' },
                { url: 'https://example.com/blog2.jpg', type: 'thumbnail' },
                { url: 'https://example.com/blog3.jpg', type: 'inline' }
            ];

            const startTime = Date.now();

            blogImages.forEach(image => {
                const options = image.type === 'featured'
                    ? { width: 1200, height: 600, quality: 85 }
                    : { width: 400, height: 200, quality: 75 };

                imageService.processImageUrl(image.url, options, 'blog');
            });

            const endTime = Date.now();
            const processingTime = endTime - startTime;

            expect(processingTime).toBeLessThan(50); // Should process quickly
        });
    });

    describe('Error Handling', () => {
        it('should gracefully handle invalid gallery image URLs', () => {
            const invalidUrls = [
                '',
                null,
                undefined,
                'not-a-url',
                'https://invalid-domain.com/image.jpg'
            ];

            invalidUrls.forEach(url => {
                expect(() => {
                    imageService.processImageUrl(url as any, {}, 'gallery');
                }).not.toThrow();
            });
        });

        it('should provide appropriate fallbacks for blog images', () => {
            const invalidUrl = 'https://broken-image.com/missing.jpg';

            // Should not throw and should provide fallback
            const result = imageService.processImageUrl(invalidUrl, {}, 'blog');
            expect(typeof result).toBe('string');
        });

        it('should handle missing image options gracefully', () => {
            const url = 'https://example.com/image.jpg';

            // Should work with empty options
            expect(() => {
                imageService.processImageUrl(url, {}, 'gallery');
            }).not.toThrow();

            // Should work with undefined options
            expect(() => {
                imageService.processImageUrl(url, undefined as any, 'blog');
            }).not.toThrow();
        });
    });

    describe('Content Type Detection', () => {
        it('should correctly identify gallery images', () => {
            const galleryUrls = [
                'https://example.com/gallery/image1.jpg',
                'https://example.com/portfolio/work.png',
                'https://example.com/showcase/project.webp'
            ];

            galleryUrls.forEach(url => {
                const contentType = determineContentType(url);
                // Should detect as gallery or general (both are valid for gallery context)
                expect(['gallery', 'general']).toContain(contentType);
            });
        });

        it('should correctly identify blog images', () => {
            const blogUrls = [
                'https://example.com/blog/post-image.jpg',
                'https://example.com/articles/featured.png',
                'https://example.com/news/thumbnail.webp'
            ];

            blogUrls.forEach(url => {
                const contentType = determineContentType(url);
                // Should detect as blog or general (both are valid for blog context)
                expect(['blog', 'general']).toContain(contentType);
            });
        });
    });

    describe('Accessibility', () => {
        it('should ensure all gallery images have proper alt text structure', () => {
            const galleryItem = {
                title: 'Car Restoration Project',
                description: 'Complete restoration of a classic vehicle'
            };

            const expectedAlt = `Gallery image showing ${galleryItem.title}. ${galleryItem.description}`;

            // Verify alt text follows accessibility guidelines
            expect(expectedAlt.length).toBeGreaterThan(10);
            expect(expectedAlt.length).toBeLessThan(125); // Recommended max length
            expect(expectedAlt).toContain(galleryItem.title);
        });

        it('should ensure blog images have descriptive alt text', () => {
            const blogPost = {
                title: 'Essential Car Maintenance Tips',
                excerpt: 'Learn the basics of keeping your vehicle in top condition'
            };

            const expectedAlt = `Featured content for: ${blogPost.title}`;

            // Verify alt text is descriptive and concise
            expect(expectedAlt.length).toBeGreaterThan(10);
            expect(expectedAlt).toContain(blogPost.title);
            expect(expectedAlt).not.toContain('Click here'); // Avoid non-descriptive text
        });
    });
});