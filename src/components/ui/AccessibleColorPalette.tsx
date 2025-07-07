import React from 'react';
import { getContrastRatio, meetsContrastStandard } from '@/lib/color-utils';

type ColorCombination = {
  foreground: string;
  background: string;
  name: string;
};

type AccessibleColorPaletteProps = {
  combinations: ColorCombination[];
  showContrast?: boolean;
  showWCAGLevel?: boolean;
  textSize?: 'normal' | 'large';
  className?: string;
};

/**
 * Component for displaying a set of accessible color combinations with contrast information
 */
export function AccessibleColorPalette({
  combinations,
  showContrast = true,
  showWCAGLevel = true,
  textSize = 'normal',
  className = '',
}: AccessibleColorPaletteProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {combinations.map((combo, index) => (
        <ColorCombinationCard
          key={index}
          foreground={combo.foreground}
          background={combo.background}
          name={combo.name}
          showContrast={showContrast}
          showWCAGLevel={showWCAGLevel}
          textSize={textSize}
        />
      ))}
    </div>
  );
}

type ColorCombinationCardProps = {
  foreground: string;
  background: string;
  name: string;
  showContrast: boolean;
  showWCAGLevel: boolean;
  textSize: 'normal' | 'large';
};

/**
 * Card displaying a single color combination with contrast information
 */
function ColorCombinationCard({
  foreground,
  background,
  name,
  showContrast,
  showWCAGLevel,
  textSize,
}: ColorCombinationCardProps) {
  const contrastRatio = getContrastRatio(foreground, background);
  const wcagLevel = meetsContrastStandard(contrastRatio, textSize === 'large');
  
  // Determine if the contrast is sufficient for the text size
  const isAccessible = 
    (textSize === 'normal' && contrastRatio >= 4.5) || 
    (textSize === 'large' && contrastRatio >= 3);
  
  return (
    <div 
      className="border-2 rounded-lg overflow-hidden shadow-md"
      style={{ borderColor: isAccessible ? '#22c55e' : '#ef4444' }}
    >
      <div 
        className="p-6 flex flex-col items-center justify-center min-h-[150px]"
        style={{ backgroundColor: background, color: foreground }}
      >
        <span className="text-xl font-semibold">{name}</span>
        <span className="mt-2 text-lg">{foreground} on {background}</span>
      </div>
      
      <div className="p-4 bg-white dark:bg-gray-800">
        <div className="flex justify-between items-center">
          {showContrast && (
            <div className="text-sm">
              <span className="font-medium">Contrast: </span>
              <span className={contrastRatio >= 4.5 ? 'text-green-600 dark:text-green-400' : contrastRatio >= 3 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}>
                {contrastRatio.toFixed(2)}:1
              </span>
            </div>
          )}
          
          {showWCAGLevel && (
            <div className="text-sm">
              <span className="font-medium">WCAG: </span>
              <span className={
                wcagLevel === 'AAA' ? 'text-green-600 dark:text-green-400' : 
                wcagLevel === 'AA' ? 'text-green-600 dark:text-green-400' : 
                wcagLevel === 'AA Large' ? 'text-yellow-600 dark:text-yellow-400' : 
                'text-red-600 dark:text-red-400'
              }>
                {wcagLevel}
              </span>
            </div>
          )}
        </div>
        
        <div className="mt-3 text-sm">
          <span className="font-medium">Sample Text: </span>
          <div 
            className="mt-1 p-2 rounded"
            style={{ backgroundColor: background, color: foreground }}
          >
            <p className={textSize === 'large' ? 'text-lg font-bold' : 'text-base'}>
              The quick brown fox jumps over the lazy dog.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Component for displaying a color palette with accessibility information
 */
export function AccessibleColorGrid({
  colors,
  className = '',
}: {
  colors: { name: string; value: string }[];
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 ${className}`}>
      {colors.map((color, index) => (
        <ColorSwatch key={index} name={color.name} value={color.value} />
      ))}
    </div>
  );
}

/**
 * Component for displaying a single color swatch
 */
function ColorSwatch({ name, value }: { name: string; value: string }) {
  // Calculate contrast with white and black to determine text color
  const contrastWithWhite = getContrastRatio(value, '#ffffff');
  const contrastWithBlack = getContrastRatio(value, '#000000');
  const textColor = contrastWithWhite > contrastWithBlack ? '#ffffff' : '#000000';
  
  return (
    <div className="flex flex-col rounded-lg overflow-hidden shadow-md border border-gray-200 dark:border-gray-700">
      <div 
        className="h-24 flex items-center justify-center p-2 text-center"
        style={{ backgroundColor: value, color: textColor }}
      >
        <span className="font-medium">{value}</span>
      </div>
      <div className="p-2 bg-white dark:bg-gray-800 text-center">
        <span className="text-sm font-medium">{name}</span>
      </div>
    </div>
  );
}