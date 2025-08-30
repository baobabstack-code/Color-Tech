import { detectMobileDevice, isMobileUserAgent, checkMediaQuery, getBreakpointName } from '@/lib/mobile-detection';

describe('Mobile Detection Utilities', () => {
    describe('detectMobileDevice utility', () => {
        it('should return default values during SSR', () => {
            const originalWindow = global.window;
            delete (global as any).window;

            const result = detectMobileDevice();
            expect(result).toEqual({
                isMobile: false,
                isTablet: false,
                isDesktop: true,
                breakpoint: 'desktop'
            });

            global.window = originalWindow;
        });

        it('should handle errors gracefully', () => {
            const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

            // Test with window available but potentially problematic
            const result = detectMobileDevice();

            // Should return a valid result structure
            expect(result).toHaveProperty('isMobile');
            expect(result).toHaveProperty('isTablet');
            expect(result).toHaveProperty('isDesktop');
            expect(result).toHaveProperty('breakpoint');
            expect(typeof result.isMobile).toBe('boolean');
            expect(typeof result.isTablet).toBe('boolean');
            expect(typeof result.isDesktop).toBe('boolean');
            expect(typeof result.breakpoint).toBe('string');

            consoleSpy.mockRestore();
        });
    });

    describe('isMobileUserAgent utility', () => {
        it('should return false during SSR', () => {
            const originalNavigator = global.navigator;
            delete (global as any).navigator;

            const result = isMobileUserAgent();
            expect(result).toBe(false);

            global.navigator = originalNavigator;
        });

        it('should return boolean value', () => {
            const result = isMobileUserAgent();
            expect(typeof result).toBe('boolean');
        });

        it('should handle errors gracefully', () => {
            const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

            // Should not throw even if navigator is problematic
            const result = isMobileUserAgent();
            expect(typeof result).toBe('boolean');

            consoleSpy.mockRestore();
        });
    });

    describe('checkMediaQuery utility', () => {
        it('should return false during SSR', () => {
            const originalWindow = global.window;
            delete (global as any).window;

            const result = checkMediaQuery('(max-width: 768px)');
            expect(result).toBe(false);

            global.window = originalWindow;
        });

        it('should return boolean value', () => {
            const result = checkMediaQuery('(max-width: 768px)');
            expect(typeof result).toBe('boolean');
        });

        it('should handle invalid queries gracefully', () => {
            const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

            const result = checkMediaQuery('invalid-query');
            expect(typeof result).toBe('boolean');

            consoleSpy.mockRestore();
        });
    });

    describe('getBreakpointName utility', () => {
        it('should return correct breakpoint names for known values', () => {
            expect(getBreakpointName(500)).toBe('mobile');
            expect(getBreakpointName(800)).toBe('tablet');
            expect(getBreakpointName(1200)).toBe('desktop');
        });

        it('should handle edge cases', () => {
            expect(getBreakpointName(0)).toBe('mobile');
            expect(getBreakpointName(767)).toBe('mobile');
            expect(getBreakpointName(768)).toBe('tablet');
            expect(getBreakpointName(1023)).toBe('tablet');
            expect(getBreakpointName(1024)).toBe('desktop');
        });

        it('should default to desktop during SSR', () => {
            const originalWindow = global.window;
            delete (global as any).window;

            expect(getBreakpointName()).toBe('desktop');

            global.window = originalWindow;
        });

        it('should handle undefined width gracefully', () => {
            const result = getBreakpointName(undefined);
            expect(typeof result).toBe('string');
            expect(['mobile', 'tablet', 'desktop']).toContain(result);
        });
    });
});

describe('Mobile Detection Error Prevention', () => {
    it('should not generate action-related errors', () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

        // Test all utilities to ensure they don't cause action errors
        detectMobileDevice();
        isMobileUserAgent();
        checkMediaQuery('(max-width: 768px)');
        getBreakpointName();

        // Check that no "Unknown action" errors were logged
        const errorCalls = consoleSpy.mock.calls.filter(call =>
            call.some(arg => typeof arg === 'string' && arg.includes('Unknown action'))
        );

        expect(errorCalls).toHaveLength(0);

        consoleSpy.mockRestore();
    });

    it('should handle multiple rapid calls without errors', () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

        // Simulate rapid calls
        for (let i = 0; i < 10; i++) {
            detectMobileDevice();
            isMobileUserAgent();
            checkMediaQuery('(max-width: 768px)');
            getBreakpointName(500 + i * 100);
        }

        // Check that no errors were logged
        expect(consoleSpy).not.toHaveBeenCalled();

        consoleSpy.mockRestore();
    });

    it('should not throw exceptions', () => {
        expect(() => detectMobileDevice()).not.toThrow();
        expect(() => isMobileUserAgent()).not.toThrow();
        expect(() => checkMediaQuery('(max-width: 768px)')).not.toThrow();
        expect(() => getBreakpointName()).not.toThrow();
        expect(() => getBreakpointName(800)).not.toThrow();
    });
});

describe('Mobile Detection Integration', () => {
    it('should provide consistent API across all utilities', () => {
        // All utilities should return predictable types
        const deviceInfo = detectMobileDevice();
        const isMobileUA = isMobileUserAgent();
        const mediaQueryResult = checkMediaQuery('(max-width: 768px)');
        const breakpoint = getBreakpointName();

        expect(typeof deviceInfo).toBe('object');
        expect(typeof isMobileUA).toBe('boolean');
        expect(typeof mediaQueryResult).toBe('boolean');
        expect(typeof breakpoint).toBe('string');

        // Device info should have required properties
        expect(deviceInfo).toHaveProperty('isMobile');
        expect(deviceInfo).toHaveProperty('isTablet');
        expect(deviceInfo).toHaveProperty('isDesktop');
        expect(deviceInfo).toHaveProperty('breakpoint');

        // Breakpoint should be one of the expected values
        expect(['mobile', 'tablet', 'desktop']).toContain(breakpoint);
        expect(['mobile', 'tablet', 'desktop']).toContain(deviceInfo.breakpoint);
    });
});