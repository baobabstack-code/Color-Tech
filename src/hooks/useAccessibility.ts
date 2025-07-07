import { useRef, useEffect, useState, useCallback } from 'react';
import { announce, trapFocus } from '@/lib/focus-management';

/**
 * Hook for managing focus trapping within a component
 * Useful for modals, dialogs, and other components that need to trap focus
 */
export function useFocusTrap() {
  const elementRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    // Set up focus trapping
    const cleanup = trapFocus(element);
    
    return () => {
      cleanup();
    };
  }, []);
  
  return elementRef;
}

/**
 * Hook for managing screen reader announcements
 */
export function useAnnouncement() {
  const announceMessage = useCallback((message: string, priority: 'assertive' | 'polite' = 'polite') => {
    announce(message, priority);
  }, []);
  
  return { announce: announceMessage };
}

/**
 * Hook for managing focus restoration
 * Useful for components that need to restore focus when unmounted
 */
export function useFocusReturn() {
  const previousFocusRef = useRef<HTMLElement | null>(null);
  
  useEffect(() => {
    // Store the currently focused element
    previousFocusRef.current = document.activeElement as HTMLElement;
    
    return () => {
      // Restore focus when component unmounts
      if (previousFocusRef.current && previousFocusRef.current.focus) {
        // Delay focus to avoid issues with animation
        setTimeout(() => {
          previousFocusRef.current?.focus();
        }, 0);
      }
    };
  }, []);
}

/**
 * Hook for managing escape key press
 * Useful for closing modals, dialogs, etc.
 */
export function useEscapeKey(callback: () => void) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        callback();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [callback]);
}

/**
 * Hook for managing keyboard navigation in lists
 * Useful for menus, dropdowns, etc.
 */
export function useListNavigation(itemCount: number) {
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (itemCount === 0) return;
      
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setFocusedIndex((prev) => (prev === itemCount - 1 ? 0 : prev + 1));
          break;
        case 'ArrowUp':
          event.preventDefault();
          setFocusedIndex((prev) => (prev <= 0 ? itemCount - 1 : prev - 1));
          break;
        case 'Home':
          event.preventDefault();
          setFocusedIndex(0);
          break;
        case 'End':
          event.preventDefault();
          setFocusedIndex(itemCount - 1);
          break;
      }
    },
    [itemCount]
  );
  
  return { focusedIndex, setFocusedIndex, handleKeyDown };
}

/**
 * Hook for managing reduced motion preference
 * Respects user's preference for reduced motion
 */
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    // Check if window is defined (for SSR)
    if (typeof window === 'undefined') return false;
    
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };
    
    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    // Older browsers
    else {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);
  
  return prefersReducedMotion;
}