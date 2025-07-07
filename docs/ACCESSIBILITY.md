# Accessibility Guidelines for Color-Tech Auto Detailing

This document outlines accessibility best practices to ensure our website is usable by all visitors, including those with disabilities. Following these guidelines helps us meet WCAG 2.1 AA standards and create an inclusive user experience.

## Text Contrast and Readability

### Color Contrast Requirements

- **Body Text**: Maintain a minimum contrast ratio of 4.5:1 against backgrounds
- **Large Text** (18pt+ or 14pt+ bold): Maintain a minimum contrast ratio of 3:1
- **UI Components**: Maintain a minimum contrast ratio of 3:1 for boundaries

### Font Guidelines

- **Font Size**:
  - Body text: Minimum 16px (1rem)
  - Mobile body text: Minimum 14px
  - Avoid text smaller than 12px in any context

- **Font Weight**:
  - Use normal (400-500) weight for body text
  - Reserve lighter weights (300 and below) for larger headings only
  - Use bold (600-700) for emphasis and headings

- **Line Height and Spacing**:
  - Line height: At least 1.5 times the font size for body text
  - Paragraph spacing: At least 1.5 times larger than line spacing
  - Letter spacing: Normal or slightly increased for better readability

## Interactive Elements

### Buttons and Controls

- Ensure button text has 4.5:1 contrast against button backgrounds
- Minimum touch target size of 44×44 pixels for mobile
- Provide visible focus states for keyboard navigation
- Include hover states that change more than just color

### Focus States

- Never remove focus outlines unless replacing with equally visible alternatives
- Focus indicators should have a 3:1 minimum contrast ratio against adjacent colors

## Color Usage

### Color Palette Guidelines

- Limit the primary palette to 2-3 base colors plus neutrals
- Use color variations systematically (lighter/darker shades of the same hue)
- Test the entire palette for sufficient contrast with text

### Avoiding Color-Only Information

- Never use color alone to convey meaning
- Always pair color with:
  - Text labels
  - Icons or symbols
  - Patterns or textures
  - Underlines, borders, or other visual indicators

## Implementation in Our Codebase

### Tailwind Configuration

Our Tailwind configuration has been set up with accessibility in mind:

```js
// From our tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Primary colors with proper contrast ratios
        primary: {
          50: "#f0f9ff",  // Light background (with dark text)
          // ...
          600: "#0284c7",  // Darker for better contrast on light backgrounds
          // ...
          900: "#0c4a6e",  // Darkest - for text on light backgrounds
        },
      },
      fontSize: {
        // Font sizes with appropriate line heights
        base: ["1rem", { lineHeight: "1.5" }],        // 16px with 24px line height
        lg: ["1.125rem", { lineHeight: "1.5" }],      // 18px with 27px line height
        // ...
      },
    },
  },
}
```

### Accessible Components

We've created several accessible components to ensure consistency:

- `AccessibleImage`: Ensures proper alt text and descriptions
- `FormInput`: Provides properly associated labels and error messages
- `AccessibleDialog`: Manages focus trapping and keyboard navigation
- `SkipToContent`: Allows keyboard users to bypass navigation
- `ErrorMessage`: Properly communicates form errors

### Focus Management

We use dedicated utilities for managing focus:

```typescript
// From our focus-management.ts
export function trapFocus(containerElement: HTMLElement): () => void {
  // Traps keyboard focus within modal dialogs and other components
}

export function announce(message: string, priority: 'assertive' | 'polite'): void {
  // Announces messages to screen readers
}
```

## Testing and Validation

### Automated Testing

- Use tools like Axe, Lighthouse, or WAVE for automated accessibility testing
- Integrate accessibility linting in CI/CD pipelines
- Run regular audits to catch regressions

### Manual Testing

- Test with keyboard navigation only (no mouse)
- Test with screen readers (NVDA, JAWS, VoiceOver)
- Test with different zoom levels (up to 200%)
- Test color contrast with tools like the Color Contrast Analyzer

## Resources

- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [A11Y Project Checklist](https://www.a11yproject.com/checklist/)
- [MDN Accessibility Guide](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [Web Content Accessibility Guidelines (WCAG) 2.1](https://www.w3.org/TR/WCAG21/)
- [Inclusive Components](https://inclusive-components.design/)


---

By following these guidelines, we ensure that Color-Tech is accessible to all users, regardless of their abilities or the devices they use to access our application.