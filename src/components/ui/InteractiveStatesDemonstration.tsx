import React, { useState } from 'react';
import { Button } from './Button';
import { buttonVariants } from '@/lib/variants';
import { cn } from '@/lib/utils';

type InteractiveStatesDemonstrationProps = {
  /**
   * Additional class name for the container
   */
  className?: string;
};

/**
 * Component that demonstrates different interactive states for UI elements
 * with proper accessibility considerations
 */
export function InteractiveStatesDemonstration({ className = '' }: InteractiveStatesDemonstrationProps) {
  return (
    <div className={`space-y-8 ${className}`}>
      <section>
        <h2 className="text-lg font-semibold mb-4">Button States</h2>
        <ButtonStatesDemonstration />
      </section>
      
      <section>
        <h2 className="text-lg font-semibold mb-4">Link States</h2>
        <LinkStatesDemonstration />
      </section>
      
      <section>
        <h2 className="text-lg font-semibold mb-4">Form Input States</h2>
        <FormInputStatesDemonstration />
      </section>
    </div>
  );
}

/**
 * Demonstrates different button states with proper accessibility
 */
function ButtonStatesDemonstration() {
  const buttonVariantTypes = [
    { name: 'Default', variant: 'default' },
    { name: 'Destructive', variant: 'destructive' },
    { name: 'Outline', variant: 'outline' },
    { name: 'Secondary', variant: 'secondary' },
    { name: 'Ghost', variant: 'ghost' },
    { name: 'Link', variant: 'link' },
  ] as const;
  
  return (
    <div className="space-y-6">
      {buttonVariantTypes.map((variantType) => (
        <div key={variantType.variant} className="space-y-2">
          <h3 className="text-sm font-medium">{variantType.name} Button</h3>
          <div className="flex flex-wrap gap-4">
            <div className="space-y-1">
              <Button variant={variantType.variant}>Default</Button>
              <p className="text-xs text-gray-500 dark:text-gray-400">Default</p>
            </div>
            
            <div className="space-y-1">
              <Button variant={variantType.variant} className="hover">
                Hover
              </Button>
              <p className="text-xs text-gray-500 dark:text-gray-400">Hover</p>
            </div>
            
            <div className="space-y-1">
              <Button variant={variantType.variant} className="focus">
                Focus
              </Button>
              <p className="text-xs text-gray-500 dark:text-gray-400">Focus</p>
            </div>
            
            <div className="space-y-1">
              <Button variant={variantType.variant} className="active">
                Active
              </Button>
              <p className="text-xs text-gray-500 dark:text-gray-400">Active</p>
            </div>
            
            <div className="space-y-1">
              <Button variant={variantType.variant} disabled>
                Disabled
              </Button>
              <p className="text-xs text-gray-500 dark:text-gray-400">Disabled</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Demonstrates different link states with proper accessibility
 */
function LinkStatesDemonstration() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Text Links</h3>
        <div className="flex flex-wrap gap-8">
          <div className="space-y-1">
            <a href="#" className="text-primary-600 dark:text-primary-400 underline">
              Default Link
            </a>
            <p className="text-xs text-gray-500 dark:text-gray-400">Default</p>
          </div>
          
          <div className="space-y-1">
            <a href="#" className="text-primary-700 dark:text-primary-300 underline">
              Hover Link
            </a>
            <p className="text-xs text-gray-500 dark:text-gray-400">Hover</p>
          </div>
          
          <div className="space-y-1">
            <a 
              href="#" 
              className="text-primary-600 dark:text-primary-400 underline outline outline-2 outline-primary-600 dark:outline-primary-400 rounded"
            >
              Focus Link
            </a>
            <p className="text-xs text-gray-500 dark:text-gray-400">Focus</p>
          </div>
          
          <div className="space-y-1">
            <a href="#" className="text-primary-800 dark:text-primary-200 underline">
              Active Link
            </a>
            <p className="text-xs text-gray-500 dark:text-gray-400">Active</p>
          </div>
          
          <div className="space-y-1">
            <a href="#" className="text-gray-400 dark:text-gray-500 underline pointer-events-none">
              Disabled Link
            </a>
            <p className="text-xs text-gray-500 dark:text-gray-400">Disabled</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Button Links</h3>
        <div className="flex flex-wrap gap-4">
          <div className="space-y-1">
            <a 
              href="#" 
              className={cn(buttonVariants({ variant: 'default' }))}
            >
              Default
            </a>
            <p className="text-xs text-gray-500 dark:text-gray-400">Default</p>
          </div>
          
          <div className="space-y-1">
            <a 
              href="#" 
              className={cn(buttonVariants({ variant: 'default' }), 'hover')}
            >
              Hover
            </a>
            <p className="text-xs text-gray-500 dark:text-gray-400">Hover</p>
          </div>
          
          <div className="space-y-1">
            <a 
              href="#" 
              className={cn(buttonVariants({ variant: 'default' }), 'focus')}
            >
              Focus
            </a>
            <p className="text-xs text-gray-500 dark:text-gray-400">Focus</p>
          </div>
          
          <div className="space-y-1">
            <a 
              href="#" 
              className={cn(buttonVariants({ variant: 'default' }), 'active')}
            >
              Active
            </a>
            <p className="text-xs text-gray-500 dark:text-gray-400">Active</p>
          </div>
          
          <div className="space-y-1">
            <a 
              href="#" 
              className={cn(buttonVariants({ variant: 'default' }), 'opacity-50 pointer-events-none')}
              aria-disabled="true"
            >
              Disabled
            </a>
            <p className="text-xs text-gray-500 dark:text-gray-400">Disabled</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Demonstrates different form input states with proper accessibility
 */
function FormInputStatesDemonstration() {
  const [value, setValue] = useState('');
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="default-input" className="text-sm font-medium block">
            Default Input
          </label>
          <input
            id="default-input"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md"
            placeholder="Default input"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">Default state</p>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="focus-input" className="text-sm font-medium block">
            Focus Input
          </label>
          <input
            id="focus-input"
            type="text"
            className="w-full px-3 py-2 border-2 border-primary-600 dark:border-primary-400 rounded-md focus"
            placeholder="Focus input"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">Focus state</p>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="filled-input" className="text-sm font-medium block">
            Filled Input
          </label>
          <input
            id="filled-input"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800"
            value="This input has a value"
            onChange={(e) => setValue(e.target.value)}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">Filled state</p>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="error-input" className="text-sm font-medium block text-red-600 dark:text-red-400">
            Error Input
          </label>
          <input
            id="error-input"
            type="text"
            className="w-full px-3 py-2 border-2 border-red-600 dark:border-red-400 rounded-md"
            placeholder="Error input"
            aria-invalid="true"
            aria-describedby="error-message"
          />
          <p id="error-message" className="text-xs text-red-600 dark:text-red-400">
            This field has an error
          </p>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="disabled-input" className="text-sm font-medium block text-gray-500 dark:text-gray-400">
            Disabled Input
          </label>
          <input
            id="disabled-input"
            type="text"
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
            placeholder="Disabled input"
            disabled
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">Disabled state</p>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="readonly-input" className="text-sm font-medium block">
            Read-only Input
          </label>
          <input
            id="readonly-input"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800"
            value="This input is read-only"
            readOnly
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">Read-only state</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Checkbox and Radio States</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                id="default-checkbox"
                type="checkbox"
                className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="default-checkbox" className="ml-2 text-sm">
                Default Checkbox
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="checked-checkbox"
                type="checkbox"
                className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                checked
                readOnly
              />
              <label htmlFor="checked-checkbox" className="ml-2 text-sm">
                Checked Checkbox
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="disabled-checkbox"
                type="checkbox"
                className="h-4 w-4 text-gray-400 border-gray-300 rounded focus:ring-gray-500"
                disabled
              />
              <label htmlFor="disabled-checkbox" className="ml-2 text-sm text-gray-500">
                Disabled Checkbox
              </label>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                id="default-radio"
                type="radio"
                name="radio-group"
                className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
              />
              <label htmlFor="default-radio" className="ml-2 text-sm">
                Default Radio
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="checked-radio"
                type="radio"
                name="radio-group"
                className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                checked
                readOnly
              />
              <label htmlFor="checked-radio" className="ml-2 text-sm">
                Checked Radio
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="disabled-radio"
                type="radio"
                name="radio-group-disabled"
                className="h-4 w-4 text-gray-400 border-gray-300 focus:ring-gray-500"
                disabled
              />
              <label htmlFor="disabled-radio" className="ml-2 text-sm text-gray-500">
                Disabled Radio
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}