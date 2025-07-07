import React, { useState, useEffect } from 'react';

type ContrastRating = 'Poor' | 'AA Large' | 'AA' | 'AAA';

interface ContrastCheckerProps {
  foregroundColor: string;
  backgroundColor: string;
  fontSize?: number; // in pixels
  isBold?: boolean;
}

/**
 * Converts a hex color to RGB values
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
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
 * Calculates the relative luminance of an RGB color
 * Formula from WCAG 2.0: https://www.w3.org/TR/WCAG20/#relativeluminancedef
 */
function getLuminance(rgb: { r: number; g: number; b: number }): number {
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
 */
function getContrastRatio(foreground: string, background: string): number {
  const fgRgb = hexToRgb(foreground);
  const bgRgb = hexToRgb(background);
  
  if (!fgRgb || !bgRgb) return 0;
  
  const fgLuminance = getLuminance(fgRgb);
  const bgLuminance = getLuminance(bgRgb);
  
  // Calculate contrast ratio
  const lighter = Math.max(fgLuminance, bgLuminance);
  const darker = Math.min(fgLuminance, bgLuminance);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Determines the WCAG rating based on contrast ratio and text size
 */
function getContrastRating(ratio: number, fontSize: number, isBold: boolean): ContrastRating {
  // Large text is defined as 18pt (24px) or 14pt (18.67px) bold
  const isLargeText = fontSize >= 24 || (fontSize >= 18.67 && isBold);
  
  if (ratio >= 7) {
    return 'AAA';
  } else if (ratio >= 4.5) {
    return isLargeText ? 'AAA' : 'AA';
  } else if (ratio >= 3) {
    return isLargeText ? 'AA' : 'Poor';
  } else {
    return 'Poor';
  }
}

/**
 * ContrastChecker component displays the contrast ratio between two colors
 * and indicates whether it meets WCAG 2.0 accessibility standards
 */
export function ContrastChecker({
  foregroundColor,
  backgroundColor,
  fontSize = 16,
  isBold = false,
}: ContrastCheckerProps) {
  const [contrastRatio, setContrastRatio] = useState<number>(0);
  const [rating, setRating] = useState<ContrastRating>('Poor');
  
  useEffect(() => {
    const ratio = getContrastRatio(foregroundColor, backgroundColor);
    setContrastRatio(ratio);
    setRating(getContrastRating(ratio, fontSize, isBold));
  }, [foregroundColor, backgroundColor, fontSize, isBold]);
  
  return (
    <div className="p-4 border rounded-md">
      <div 
        className="p-4 mb-4 rounded flex items-center justify-center" 
        style={{ 
          color: `#${foregroundColor}`, 
          backgroundColor: `#${backgroundColor}`,
          fontSize: `${fontSize}px`,
          fontWeight: isBold ? 'bold' : 'normal'
        }}
      >
        Sample Text
      </div>
      
      <div className="space-y-2">
        <p>
          <strong>Contrast Ratio:</strong> {contrastRatio.toFixed(2)}:1
        </p>
        
        <p>
          <strong>WCAG Rating:</strong>{' '}
          <span 
            className={`font-bold ${rating === 'Poor' ? 'text-destructive' : 
              rating === 'AAA' ? 'text-green-600' : 'text-amber-600'}`}
          >
            {rating}
          </span>
        </p>
        
        <div className="text-sm">
          <p className={contrastRatio >= 3 ? 'text-green-600' : 'text-destructive'}>
            ✓ AA for large text (18pt+): {contrastRatio >= 3 ? 'Pass' : 'Fail'}
          </p>
          <p className={contrastRatio >= 4.5 ? 'text-green-600' : 'text-destructive'}>
            ✓ AA for normal text: {contrastRatio >= 4.5 ? 'Pass' : 'Fail'}
          </p>
          <p className={contrastRatio >= 7 ? 'text-green-600' : 'text-destructive'}>
            ✓ AAA for normal text: {contrastRatio >= 7 ? 'Pass' : 'Fail'}
          </p>
        </div>
      </div>
    </div>
  );
}