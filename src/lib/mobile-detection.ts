/**
 * Mobile detection utilities with error handling
 */

const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

export interface MobileDetectionResult {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    breakpoint: string;
    screenWidth?: number;
}

/**
 * Safe mobile detection that works in SSR and handles errors gracefully
 */
export function detectMobileDevice(): MobileDetectionResult {
    // Default values for SSR
    const defaultResult: MobileDetectionResult = {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        breakpoint: 'desktop'
    };

    // Return default during SSR
    if (typeof window === 'undefined') {
        return defaultResult;
    }

    try {
        const screenWidth = window.innerWidth;
        const isMobile = screenWidth < MOBILE_BREAKPOINT;
        const isTablet = screenWidth >= MOBILE_BREAKPOINT && screenWidth < TABLET_BREAKPOINT;
        const isDesktop = screenWidth >= TABLET_BREAKPOINT;

        let breakpoint = 'desktop';
        if (isMobile) breakpoint = 'mobile';
        else if (isTablet) breakpoint = 'tablet';

        return {
            isMobile,
            isTablet,
            isDesktop,
            breakpoint,
            screenWidth
        };
    } catch (error) {
        console.warn('Error detecting mobile device:', error);
        return defaultResult;
    }
}

/**
 * Check if device is mobile using user agent (fallback method)
 */
export function isMobileUserAgent(): boolean {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
        return false;
    }

    try {
        const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

        // Mobile device patterns
        const mobilePatterns = [
            /Android/i,
            /webOS/i,
            /iPhone/i,
            /iPad/i,
            /iPod/i,
            /BlackBerry/i,
            /Windows Phone/i,
            /Mobile/i
        ];

        return mobilePatterns.some(pattern => pattern.test(userAgent));
    } catch (error) {
        console.warn('Error checking mobile user agent:', error);
        return false;
    }
}

/**
 * Safe media query check
 */
export function checkMediaQuery(query: string): boolean {
    if (typeof window === 'undefined' || !window.matchMedia) {
        return false;
    }

    try {
        return window.matchMedia(query).matches;
    } catch (error) {
        console.warn('Error checking media query:', error);
        return false;
    }
}

/**
 * Get responsive breakpoint name
 */
export function getBreakpointName(width?: number): string {
    const screenWidth = width !== undefined ? width : (typeof window !== 'undefined' ? window.innerWidth : 1200);

    if (screenWidth < MOBILE_BREAKPOINT) return 'mobile';
    if (screenWidth < TABLET_BREAKPOINT) return 'tablet';
    return 'desktop';
}