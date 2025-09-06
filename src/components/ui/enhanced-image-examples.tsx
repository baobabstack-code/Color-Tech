/**
 * Example usage of the EnhancedImage component
 * This file demonstrates various use cases and configurations
 */

import React from 'react';
import { EnhancedImage, EnhancedDecorativeImage, useImagePreloader } from './enhanced-image';

// Basic usage example
export function BasicImageExample() {
    return (
        <EnhancedImage
            src="https://res.cloudinary.com/your-cloud/image/upload/v1234567890/sample.jpg"
            alt="A sample image"
            width={800}
            height={600}
        />
    );
}

// Hero image with custom fallback
export function HeroImageExample() {
    return (
        <EnhancedImage
            src="https://res.cloudinary.com/your-cloud/image/upload/v1234567890/hero-image.jpg"
            alt="ColorTech hero image showcasing our services"
            contentType="hero"
            // No fallback image - will show error state instead
            imageOptions={{
                width: 1920,
                height: 1080,
                quality: 90,
                format: 'webp',
                crop: 'fill'
            }}
            priority
            className="w-full h-auto"
            caption="Transform your space with ColorTech"
        />
    );
}

// Gallery image with retry configuration
export function GalleryImageExample() {
    return (
        <EnhancedImage
            src="https://res.cloudinary.com/your-cloud/image/upload/v1234567890/gallery-item.jpg"
            alt="Before and after comparison of a ColorTech project"
            contentType="gallery"
            maxRetries={5}
            retryDelay={2000}
            imageOptions={{
                width: 600,
                height: 400,
                quality: 85,
                format: 'auto'
            }}
            onError={(error) => console.error('Gallery image failed to load:', error)}
            onRetry={(attempt) => console.log(`Retrying gallery image, attempt ${attempt}`)}
            className="rounded-lg shadow-md"
        />
    );
}

// Blog post image with long description
export function BlogImageExample() {
    return (
        <EnhancedImage
            src="https://res.cloudinary.com/your-cloud/image/upload/v1234567890/blog-post.jpg"
            alt="Professional painter applying ColorTech paint"
            contentType="blog"
            longDescription="A professional painter wearing protective gear carefully applies ColorTech's premium paint to a residential wall. The image shows the smooth, even application technique that results in ColorTech's signature finish quality."
            imageOptions={{
                width: 800,
                height: 500,
                quality: 80
            }}
            caption="Professional application ensures the best results"
            className="my-4"
        />
    );
}

// Avatar image with custom error handling
export function AvatarImageExample() {
    const handleImageError = (error: Error) => {
        // Custom error handling - could send to analytics
        console.error('Avatar failed to load:', error);
    };

    return (
        <EnhancedImage
            src="https://res.cloudinary.com/your-cloud/image/upload/v1234567890/team-member.jpg"
            alt="John Smith, ColorTech Senior Consultant"
            contentType="avatar"
            imageOptions={{
                width: 150,
                height: 150,
                quality: 85,
                crop: 'fill'
            }}
            onError={handleImageError}
            className="rounded-full border-2 border-gray-200"
        />
    );
}

// Decorative image example
export function DecorativeImageExample() {
    return (
        <EnhancedDecorativeImage
            src="https://res.cloudinary.com/your-cloud/image/upload/v1234567890/pattern.jpg"
            width={400}
            height={200}
            imageOptions={{
                quality: 70,
                format: 'webp'
            }}
            className="opacity-20 absolute inset-0"
        />
    );
}

// Image preloader hook example
export function ImagePreloaderExample() {
    const imagesToPreload = [
        'https://res.cloudinary.com/your-cloud/image/upload/v1234567890/image1.jpg',
        'https://res.cloudinary.com/your-cloud/image/upload/v1234567890/image2.jpg',
        'https://res.cloudinary.com/your-cloud/image/upload/v1234567890/image3.jpg',
    ];

    const { loadedImages, failedImages, isLoaded, hasFailed } = useImagePreloader(imagesToPreload);

    return (
        <div>
            <h3>Image Preloader Status</h3>
            <p>Loaded: {loadedImages.size} images</p>
            <p>Failed: {failedImages.size} images</p>

            {imagesToPreload.map((url, index) => (
                <div key={index}>
                    <span>Image {index + 1}: </span>
                    {isLoaded(url) && <span className="text-green-600">✓ Loaded</span>}
                    {hasFailed(url) && <span className="text-red-600">✗ Failed</span>}
                    {!isLoaded(url) && !hasFailed(url) && <span className="text-yellow-600">⏳ Loading...</span>}
                </div>
            ))}
        </div>
    );
}

// Custom loading component example
export function CustomLoadingExample() {
    const CustomLoader = () => (
        <div className="flex items-center justify-center p-8 bg-gray-100 rounded">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading ColorTech image...</span>
        </div>
    );

    return (
        <EnhancedImage
            src="https://res.cloudinary.com/your-cloud/image/upload/v1234567890/slow-loading.jpg"
            alt="Slow loading image example"
            loadingComponent={<CustomLoader />}
            width={600}
            height={400}
        />
    );
}

// Custom error component example
export function CustomErrorExample() {
    const CustomError = () => (
        <div className="flex flex-col items-center justify-center p-8 bg-red-50 border border-red-200 rounded">
            <svg className="w-12 h-12 text-red-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-red-600 font-medium">Image unavailable</p>
            <p className="text-red-500 text-sm">Please try refreshing the page</p>
        </div>
    );

    return (
        <EnhancedImage
            src="https://invalid-url.com/nonexistent.jpg"
            alt="This image will fail to load"
            errorComponent={<CustomError />}
            maxRetries={1}
            width={600}
            height={400}
        />
    );
}

// Responsive image example
export function ResponsiveImageExample() {
    return (
        <EnhancedImage
            src="https://res.cloudinary.com/your-cloud/image/upload/v1234567890/responsive.jpg"
            alt="Responsive ColorTech showcase"
            imageOptions={{
                format: 'auto',
                quality: 80
            }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="w-full h-auto"
            fill
        />
    );
}