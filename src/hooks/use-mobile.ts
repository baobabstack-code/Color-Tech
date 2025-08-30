import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    // Ensure we're in a browser environment
    if (typeof window === 'undefined') {
      return undefined;
    }

    try {
      const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

      const onChange = () => {
        try {
          setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
        } catch (error) {
          console.warn('Error updating mobile state:', error);
        }
      };

      // Set initial value
      onChange();

      // Add listener with error handling
      mql.addEventListener("change", onChange);

      return () => {
        try {
          mql.removeEventListener("change", onChange);
        } catch (error) {
          console.warn('Error removing mobile detection listener:', error);
        }
      };
    } catch (error) {
      console.warn('Error setting up mobile detection:', error);
      // Fallback to a reasonable default
      setIsMobile(false);
      return undefined;
    }
  }, []);

  // Return false during SSR to prevent hydration mismatches
  if (typeof window === 'undefined') {
    return false;
  }

  return !!isMobile;
}
