/**
 * Color utility functions for accessibility
 */

/**
 * Converts a hex color to RGB values
 * @param hex Hex color code (with or without #)
 * @returns RGB object or null if invalid
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  // Remove # if present
  hex = hex.replace(/^#/, '');
  
  // Handle shorthand hex
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Converts RGB values to a hex color
 * @param r Red (0-255)
 * @param g Green (0-255)
 * @param b Blue (0-255)
 * @returns Hex color code with #
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b]
    .map(x => {
      const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    })
    .join('')}`;
}

/**
 * Calculates the relative luminance of an RGB color
 * Formula from WCAG 2.0: https://www.w3.org/TR/WCAG20/#relativeluminancedef
 * @param rgb RGB color object
 * @returns Luminance value (0-1)
 */
export function getLuminance(rgb: { r: number; g: number; b: number }): number {
  const { r, g, b } = rgb;
  
  // Convert RGB to sRGB
  const sR = r / 255;
  const sG = g / 255;
  const sB = b / 255;
  
  // Calculate luminance
  const R = sR <= 0.03928 ? sR / 12.92 : Math.pow((sR + 0.055) / 1.055, 2.4);
  const G = sG <= 0.03928 ? sG / 12.92 : Math.pow((sG + 0.055) / 1.055, 2.4);
  const B = sB <= 0.03928 ? sB / 12.92 : Math.pow((sB + 0.055) / 1.055, 2.4);
  
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/**
 * Calculates the contrast ratio between two colors
 * Formula from WCAG 2.0: https://www.w3.org/TR/WCAG20/#contrast-ratiodef
 * @param color1 First color (hex)
 * @param color2 Second color (hex)
 * @returns Contrast ratio (1-21)
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return 1;
  
  const lum1 = getLuminance(rgb1);
  const lum2 = getLuminance(rgb2);
  
  // Calculate contrast ratio
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Checks if a contrast ratio meets WCAG 2.0 standards
 * @param ratio Contrast ratio
 * @param level 'AA' or 'AAA'
 * @param isLargeText Whether the text is large (18pt+/14pt+ bold)
 * @returns Whether the contrast meets the specified level
 */
export function meetsContrastStandard(
  ratio: number,
  level: 'AA' | 'AAA' = 'AA',
  isLargeText: boolean = false
): boolean {
  if (level === 'AAA') {
    return isLargeText ? ratio >= 4.5 : ratio >= 7;
  } else {
    // AA level
    return isLargeText ? ratio >= 3 : ratio >= 4.5;
  }
}

/**
 * Adjusts a color's brightness to meet a target contrast ratio with another color
 * @param color Color to adjust (hex)
 * @param backgroundColor Background color to contrast with (hex)
 * @param targetRatio Target contrast ratio (typically 4.5 for AA, 7 for AAA)
 * @returns Adjusted color (hex)
 */
export function adjustColorForContrast(
  color: string,
  backgroundColor: string,
  targetRatio: number = 4.5
): string {
  const rgb = hexToRgb(color);
  const bgRgb = hexToRgb(backgroundColor);
  
  if (!rgb || !bgRgb) return color;
  
  const currentRatio = getContrastRatio(color, backgroundColor);
  
  // If we already meet the target ratio, return the original color
  if (currentRatio >= targetRatio) return color;
  
  // Determine if we need to lighten or darken the color
  const bgLuminance = getLuminance(bgRgb);
  const colorLuminance = getLuminance(rgb);
  
  // If background is dark, we need to lighten the color, otherwise darken it
  const shouldLighten = bgLuminance < 0.5;
  
  // Adjust the color in steps until we reach the target ratio
  let adjustedRgb = { ...rgb };
  let adjustedRatio = currentRatio;
  let step = shouldLighten ? 5 : -5; // Step size for adjustment
  
  while (adjustedRatio < targetRatio) {
    // Adjust RGB values
    adjustedRgb = {
      r: Math.max(0, Math.min(255, adjustedRgb.r + step)),
      g: Math.max(0, Math.min(255, adjustedRgb.g + step)),
      b: Math.max(0, Math.min(255, adjustedRgb.b + step)),
    };
    
    // Calculate new ratio
    const adjustedHex = rgbToHex(adjustedRgb.r, adjustedRgb.g, adjustedRgb.b);
    adjustedRatio = getContrastRatio(adjustedHex, backgroundColor);
    
    // If we've reached the limits of adjustment and still haven't met the target,
    // we'll return the best we can do
    if (
      (shouldLighten && (adjustedRgb.r >= 255 && adjustedRgb.g >= 255 && adjustedRgb.b >= 255)) ||
      (!shouldLighten && (adjustedRgb.r <= 0 && adjustedRgb.g <= 0 && adjustedRgb.b <= 0))
    ) {
      break;
    }
  }
  
  return rgbToHex(adjustedRgb.r, adjustedRgb.g, adjustedRgb.b);
}

/**
 * Generates a color palette with accessible contrast ratios
 * @param baseColor Base color for the palette (hex)
 * @param backgroundColor Background color to ensure contrast with (hex)
 * @param minContrastRatio Minimum contrast ratio to maintain (default: 4.5 for AA)
 * @returns Object with light and dark variations of the color
 */
export function generateAccessiblePalette(
  baseColor: string,
  backgroundColor: string = '#ffffff',
  minContrastRatio: number = 4.5
): { [key: string]: string } {
  const baseRgb = hexToRgb(baseColor);
  if (!baseRgb) return {};
  
  const palette: { [key: string]: string } = {
    50: '',
    100: '',
    200: '',
    300: '',
    400: '',
    500: baseColor,
    600: '',
    700: '',
    800: '',
    900: '',
  };
  
  // Generate lighter shades (50-400)
  for (let i = 4; i >= 0; i--) {
    const lightness = 1 - i * 0.15; // 0.4 to 1.0
    const shade = {
      r: Math.min(255, baseRgb.r + (255 - baseRgb.r) * lightness),
      g: Math.min(255, baseRgb.g + (255 - baseRgb.g) * lightness),
      b: Math.min(255, baseRgb.b + (255 - baseRgb.b) * lightness),
    };
    
    const key = String((4 - i) * 100);
    palette[key] = rgbToHex(shade.r, shade.g, shade.b);
  }
  
  // Generate darker shades (600-900)
  for (let i = 1; i <= 4; i++) {
    const darkness = 0.7 - (i * 0.15); // 0.55 to 0.1
    const shade = {
      r: baseRgb.r * darkness,
      g: baseRgb.g * darkness,
      b: baseRgb.b * darkness,
    };
    
    const key = String((i + 5) * 100);
    palette[key] = rgbToHex(shade.r, shade.g, shade.b);
  }
  
  // Ensure text colors have sufficient contrast with the background
  ['700', '800', '900'].forEach(key => {
    const contrastRatio = getContrastRatio(palette[key], backgroundColor);
    if (contrastRatio < minContrastRatio) {
      palette[key] = adjustColorForContrast(palette[key], backgroundColor, minContrastRatio);
    }
  });
  
  return palette;
}