import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { EnhancedImage } from '@/components/ui/enhanced-image';
import { imageErrorService, ImageErrorRecovery } from '@/services/imageService';

// Mock the image service components for testing
jest.mock('@/services/imageService');

// Mock Next.js Image component
jest.mock('next/image', () => {
    return function MockImage({ src, alt, onError, onLoad, ...props }: any) {
        return (
            <img
                src={src}
                alt={alt}
                onError={onError}
                onLoad={onLoad}
                {...props}
                data-testid="mock-image"
            />
        );
    };
});

describe('Image Error Handling Integration', () => {
    const mockImageErrorService = imageErrorService as jest.Mocked<typeof imageErrorService>;
    const mockImageErrorRecovery = ImageErrorRecovery as jest.Mocked<typeof ImageErrorRecovery>;

    beforeEach(() => {
        jest.clearAllMocks();
        mockImageErrorService.logImageError = jest.fn();
        mockImageErrorService.logImageSuccess = jest.fn();
        mockImageErrorService.hasRecentFailures = jest.fn().mockReturnValue(false);
        mockImageErrorService.getUserFriendlyErrorMessage = jest.fn().mockReturnValue('Image could not be loaded');
        mockImageErrorRecovery.attemptRecovery = jest.fn().mockResolvedValue(null);
    });

    it('should handle image loading errors gracefully', async () => {
        const testUrl = 'https://example.com/broken-image.jpg';

        render(
            <EnhancedImage
                src={testUrl}
                alt="Test image"
                width={400}
                height={300}
                contentType="general"
            />
        );

        const image = screen.getByTestId('mock-image');

        // Simulate image error
        const errorEvent = new Event('error');
        image.dispatchEvent(errorEvent);

        await waitFor(() => {
            expect(mockImageErrorService.logImageError).toHaveBeenCalledWith(
                testUrl,
                expect.any(String),
                'network'
            );
        });
    });

    it('should attempt error recovery when image fails', async () => {
        const testUrl = 'https://example.com/broken-image.jpg';
        const recoveredUrl = 'https://example.com/recovered-image.jpg';

        mockImageErrorRecovery.attemptRecovery.mockResolvedValue(recoveredUrl);

        render(
            <EnhancedImage
                src={testUrl}
                alt="Test image"
                width={400}
                height={300}
                contentType="general"
            />
        );

        const image = screen.getByTestId('mock-image');

        // Simulate image error
        const errorEvent = new Event('error');
        image.dispatchEvent(errorEvent);

        await waitFor(() => {
            expect(mockImageErrorRecovery.attemptRecovery).toHaveBeenCalledWith(
                testUrl,
                'network',
                0
            );
        });
    });

    it('should log successful image loads', async () => {
        const testUrl = 'https://example.com/working-image.jpg';

        render(
            <EnhancedImage
                src={testUrl}
                alt="Test image"
                width={400}
                height={300}
                contentType="general"
            />
        );

        const image = screen.getByTestId('mock-image');

        // Simulate successful image load
        const loadEvent = new Event('load');
        image.dispatchEvent(loadEvent);

        await waitFor(() => {
            expect(mockImageErrorService.logImageSuccess).toHaveBeenCalledWith(
                testUrl,
                expect.any(Number)
            );
        });
    });

    it('should use fallback image when recovery fails', async () => {
        const testUrl = 'https://example.com/broken-image.jpg';

        mockImageErrorRecovery.attemptRecovery.mockResolvedValue(null);

        render(
            <EnhancedImage
                src={testUrl}
                alt="Test image"
                width={400}
                height={300}
                contentType="hero"
            />
        );

        const image = screen.getByTestId('mock-image') as HTMLImageElement;

        // Simulate image error
        const errorEvent = new Event('error');
        image.dispatchEvent(errorEvent);

        await waitFor(() => {
            expect(mockImageErrorService.logImageError).toHaveBeenCalled();
        });

        // Should eventually use fallback
        await waitFor(() => {
            expect(image.src).toContain('fallback');
        }, { timeout: 3000 });
    });

    it('should handle multiple retry attempts', async () => {
        const testUrl = 'https://example.com/unstable-image.jpg';

        mockImageErrorRecovery.attemptRecovery
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce('https://example.com/recovered-image.jpg');

        render(
            <EnhancedImage
                src={testUrl}
                alt="Test image"
                width={400}
                height={300}
                contentType="general"
                maxRetries={3}
            />
        );

        const image = screen.getByTestId('mock-image');

        // Simulate multiple image errors
        for (let i = 0; i < 3; i++) {
            const errorEvent = new Event('error');
            image.dispatchEvent(errorEvent);
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        await waitFor(() => {
            expect(mockImageErrorRecovery.attemptRecovery).toHaveBeenCalledTimes(3);
        });
    });

    it('should prevent loading images with recent failures', () => {
        const testUrl = 'https://example.com/recently-failed-image.jpg';

        mockImageErrorService.hasRecentFailures.mockReturnValue(true);

        render(
            <EnhancedImage
                src={testUrl}
                alt="Test image"
                width={400}
                height={300}
                contentType="general"
            />
        );

        // Should use fallback immediately without attempting to load
        const image = screen.getByTestId('mock-image') as HTMLImageElement;
        expect(image.src).toContain('fallback');
    });

    it('should display user-friendly error messages', async () => {
        const testUrl = 'https://example.com/broken-image.jpg';
        const errorMessage = 'Image temporarily unavailable. Please check your connection.';

        mockImageErrorService.getUserFriendlyErrorMessage.mockReturnValue(errorMessage);

        render(
            <EnhancedImage
                src={testUrl}
                alt="Test image"
                width={400}
                height={300}
                contentType="general"
                showErrorMessage={true}
            />
        );

        const image = screen.getByTestId('mock-image');

        // Simulate image error
        const errorEvent = new Event('error');
        image.dispatchEvent(errorEvent);

        await waitFor(() => {
            expect(screen.getByText(errorMessage)).toBeInTheDocument();
        });
    });
});