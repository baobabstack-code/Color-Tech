/**
 * Focus management utilities for improved keyboard navigation
 * These utilities help manage focus for modals, dialogs, and other interactive components
 */

/**
 * Traps focus within a container element
 * @param containerElement The element to trap focus within
 * @returns A cleanup function to remove the trap
 */
export function trapFocus(containerElement: HTMLElement): () => void {
  if (!containerElement) return () => {};

  // Find all focusable elements within the container
  const focusableElements = getFocusableElements(containerElement);
  if (focusableElements.length === 0) return () => {};

  // Store the element that was focused before trapping
  const previouslyFocused = document.activeElement as HTMLElement;

  // Focus the first element if nothing inside the container is focused
  if (!containerElement.contains(document.activeElement)) {
    focusableElements[0].focus();
  }

  // Handle tab key to cycle through focusable elements
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Tab') return;

    // Don't trap if the container or its children don't have focus
    if (!containerElement.contains(document.activeElement)) return;

    const firstFocusableEl = focusableElements[0];
    const lastFocusableEl = focusableElements[focusableElements.length - 1];

    // Shift+Tab on first element should wrap to last element
    if (event.shiftKey && document.activeElement === firstFocusableEl) {
      lastFocusableEl.focus();
      event.preventDefault();
    }
    // Tab on last element should wrap to first element
    else if (!event.shiftKey && document.activeElement === lastFocusableEl) {
      firstFocusableEl.focus();
      event.preventDefault();
    }
  };

  // Add event listener
  document.addEventListener('keydown', handleKeyDown);

  // Return cleanup function
  return () => {
    document.removeEventListener('keydown', handleKeyDown);
    // Restore focus to previously focused element
    if (previouslyFocused && previouslyFocused.focus) {
      previouslyFocused.focus();
    }
  };
}

/**
 * Gets all focusable elements within a container
 * @param container The container element
 * @returns Array of focusable elements
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  if (!container) return [];

  // Selector for all potentially focusable elements
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    'details summary',
    'details',
    'iframe',
    '[contenteditable=""]',
    '[contenteditable="true"]',
  ].join(',');

  return Array.from(container.querySelectorAll<HTMLElement>(selector))
    .filter(el => {
      // Filter out hidden elements
      return (
        el.offsetWidth > 0 &&
        el.offsetHeight > 0 &&
        window.getComputedStyle(el).visibility !== 'hidden'
      );
    });
}

/**
 * Focuses the first focusable element within a container
 * @param container The container element
 * @returns Whether an element was successfully focused
 */
export function focusFirstElement(container: HTMLElement): boolean {
  const focusableElements = getFocusableElements(container);
  if (focusableElements.length > 0) {
    focusableElements[0].focus();
    return true;
  }
  return false;
}

/**
 * Creates an announcement for screen readers
 * @param message The message to announce
 * @param priority Whether to use an assertive (urgent) announcement
 */
export function announce(message: string, priority: 'assertive' | 'polite' = 'polite'): void {
  // Create or get the live region element
  let liveRegion = document.getElementById(`sr-live-region-${priority}`);
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = `sr-live-region-${priority}`;
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.setAttribute('aria-relevant', 'additions');
    liveRegion.setAttribute('aria-atomic', 'true');
    
    // Hide visually but keep available to screen readers
    Object.assign(liveRegion.style, {
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: '0',
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      whiteSpace: 'nowrap',
      border: '0',
    });
    
    document.body.appendChild(liveRegion);
  }

  // Update the content to trigger announcement
  liveRegion.textContent = '';
  // Use setTimeout to ensure the DOM update is processed
  setTimeout(() => {
    liveRegion!.textContent = message;
  }, 50);
}