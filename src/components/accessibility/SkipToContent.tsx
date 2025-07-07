import React from 'react';

/**
 * SkipToContent component provides a way for keyboard users to bypass navigation
 * and jump straight to the main content. This link is visually hidden until focused.
 * 
 * Usage:
 * - Place this component at the very beginning of your page layout
 * - Ensure your main content has an id="main-content"
 */
export function SkipToContent() {
  return (
    <a 
      href="#main-content" 
      className="skip-to-content"
    >
      Skip to content
    </a>
  );
}

/**
 * MainContentArea component wraps the main content and provides the target
 * for the skip link. It also ensures proper semantic structure with the main tag.
 */
export function MainContentArea({ 
  children, 
  className = "",
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main 
      id="main-content" 
      tabIndex={-1} // Makes the element focusable but not in the tab order
      className={`outline-none ${className}`}
    >
      {children}
    </main>
  );
}