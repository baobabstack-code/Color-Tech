import React from 'react';
import { AccessibleColorPalette, AccessibleColorGrid } from '@/components/ui/AccessibleColorPalette';
import { ContrastDemonstration, TextReadabilityDemonstration, TextSpacingDemonstration } from '@/components/ui/ContrastDemonstration';
import { InteractiveStatesDemonstration } from '@/components/ui/InteractiveStatesDemonstration';
import { ContrastChecker } from '@/components/ui/ContrastChecker';
import { ColorContrastGrid } from '@/components/ui/ColorContrastGrid';
import { AccessibilityHooksDemo } from '@/components/ui/AccessibilityHooksDemo';
import { SkipToContent, MainContentArea } from '@/components/accessibility/SkipToContent';
import { AccessibleDialog } from '@/components/ui/AccessibleDialog';
import { AccessibleImage, DecorativeImage } from '@/components/ui/AccessibleImage';
import { FormInput } from '@/components/ui/FormInput';
import { ErrorMessage, FormErrorSummary } from '@/components/ui/ErrorMessage';
import { Button } from '@/components/ui/Button';
import { AccessibleTooltip } from '@/components/ui/Tooltip';

export default function AccessibilityShowcase() {
  // Sample color combinations for demonstration
  const colorCombinations = [
    { foreground: '#000000', background: '#ffffff', name: 'Black on White' },
    { foreground: '#ffffff', background: '#000000', name: 'White on Black' },
    { foreground: '#ffffff', background: '#0f766e', name: 'White on Teal' },
    { foreground: '#1e293b', background: '#f8fafc', name: 'Slate on Light' },
    { foreground: '#f8fafc', background: '#1e293b', name: 'Light on Slate' },
    { foreground: '#fef3c7', background: '#78350f', name: 'Amber on Brown' },
  ];
  
  // Sample colors for the color grid
  const colors = [
    { name: 'Primary 50', value: '#f0f9ff' },
    { name: 'Primary 100', value: '#e0f2fe' },
    { name: 'Primary 200', value: '#bae6fd' },
    { name: 'Primary 300', value: '#7dd3fc' },
    { name: 'Primary 400', value: '#38bdf8' },
    { name: 'Primary 500', value: '#0ea5e9' },
    { name: 'Primary 600', value: '#0284c7' },
    { name: 'Primary 700', value: '#0369a1' },
    { name: 'Primary 800', value: '#075985' },
    { name: 'Primary 900', value: '#0c4a6e' },
    { name: 'Primary 950', value: '#082f49' },
  ];
  
  // Sample contrast demonstration combinations
  const contrastDemoCombinations = [
    { foreground: '#000000', background: '#ffffff', label: 'High Contrast (21:1)' },
    { foreground: '#6b7280', background: '#ffffff', label: 'Medium Contrast (4.5:1)' },
    { foreground: '#9ca3af', background: '#ffffff', label: 'Low Contrast (3:1)' },
    { foreground: '#d1d5db', background: '#ffffff', label: 'Poor Contrast (1.5:1)' },
  ];
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SkipToContent />
      
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Accessibility Showcase
          </h1>
        </div>
      </header>
      
      <MainContentArea>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-12">
            {/* Introduction */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Introduction
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <p>
                  This page showcases various accessibility features and components implemented in the Color-Tech project.
                  These components are designed to ensure that the application is usable by everyone, including people with disabilities.
                </p>
              </div>
            </section>
            
            {/* Color Contrast */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Color Contrast
              </h2>
              <div className="space-y-6">
                <div className="prose dark:prose-invert max-w-none">
                  <p>
                    Color contrast is essential for readability. The WCAG recommends a minimum contrast ratio of 4.5:1 for normal text
                    and 3:1 for large text (18pt or 14pt bold and larger).
                  </p>
                </div>
                
                <ContrastDemonstration 
                  combinations={contrastDemoCombinations} 
                  className="mt-6"
                />
              </div>
            </section>
            
            {/* Accessible Color Palette */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Accessible Color Combinations
              </h2>
              <AccessibleColorPalette 
                combinations={colorCombinations} 
                className="mt-6"
              />
            </section>
            
            {/* Color Grid */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Color Palette
              </h2>
              <AccessibleColorGrid 
                colors={colors} 
                className="mt-6"
              />
            </section>
            
            {/* Color Contrast Grid */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Color Contrast Grid
              </h2>
              <div className="prose dark:prose-invert max-w-none mb-4">
                <p>
                  This grid shows the contrast ratios between different color combinations.
                  Click on any cell to see a preview of that color combination.
                </p>
              </div>
              <ColorContrastGrid 
                colors={colors} 
                className="mt-6"
              />
            </section>
            
            {/* Text Readability */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Text Readability
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <TextReadabilityDemonstration />
                <TextSpacingDemonstration />
              </div>
            </section>
            
            {/* Interactive States */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Interactive States
              </h2>
              <InteractiveStatesDemonstration className="mt-6" />
            </section>
            
            {/* Contrast Checker Tool */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Contrast Checker Tool
              </h2>
              <ContrastChecker className="mt-6" />
            </section>
            
            {/* Accessible Components */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Accessible Components
              </h2>
              
              <div className="space-y-8 mt-6">
                {/* Accessible Images */}
                <div>
                  <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-gray-100">
                    Accessible Images
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border p-4 rounded-lg">
                      <h4 className="text-sm font-medium mb-2">Informative Image (with alt text)</h4>
                      <AccessibleImage 
                        src="/placeholder-image.jpg" 
                        alt="A sample image showing accessibility features" 
                        width={300}
                        height={200}
                        className="w-full h-auto"
                      />
                    </div>
                    
                    <div className="border p-4 rounded-lg">
                      <h4 className="text-sm font-medium mb-2">Decorative Image (hidden from screen readers)</h4>
                      <DecorativeImage 
                        src="/placeholder-decorative.jpg" 
                        width={300}
                        height={200}
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Form Inputs */}
                <div>
                  <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-gray-100">
                    Accessible Form Inputs
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                      id="demo-input"
                      label="Example Input"
                      placeholder="Enter some text"
                      hint="This is a hint message for the input"
                    />
                    
                    <FormInput
                      id="demo-input-error"
                      label="Input with Error"
                      placeholder="Enter some text"
                      error="This field has an error message"
                    />
                  </div>
                </div>
                
                {/* Error Messages */}
                <div>
                  <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-gray-100">
                    Error Messages
                  </h3>
                  <div className="space-y-4">
                    <ErrorMessage id="error-example" message="This is an example error message" />
                    
                    <FormErrorSummary 
                      errors={[
                        { id: 'field1', message: 'Name is required' },
                        { id: 'field2', message: 'Email must be valid' },
                        { id: 'field3', message: 'Password must be at least 8 characters' },
                      ]}
                      title="Form has 3 errors"
                    />
                  </div>
                </div>
                
                {/* Tooltips */}
                <div>
                  <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-gray-100">
                    Accessible Tooltips
                  </h3>
                  <div className="flex space-x-4">
                    <AccessibleTooltip content="This is a helpful tooltip with information">
                      <Button>Hover Me</Button>
                    </AccessibleTooltip>
                    
                    <AccessibleTooltip content="This tooltip has a longer delay" delayDuration={700}>
                      <Button variant="outline">Delayed Tooltip</Button>
                    </AccessibleTooltip>
                  </div>
                </div>
                
                {/* Accessibility Hooks Demo */}
                <div>
                  <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-gray-100">
                    Accessibility Hooks
                  </h3>
                  <div className="border p-4 rounded-lg">
                    <AccessibilityHooksDemo />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </MainContentArea>
    </div>
  );
}