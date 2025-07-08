import React from 'react';
import { cn } from '@/lib/utils';

interface ErrorMessageProps {
  /**
   * The error message to display
   */
  message: string;
  
  /**
   * ID of the form element this error is associated with
   */
  id?: string;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Whether to visually hide the error but keep it accessible to screen readers
   */
  visuallyHidden?: boolean;
}

/**
 * ErrorMessage component for displaying form validation errors
 * 
 * This component is designed to be accessible, ensuring that error messages
 * are properly associated with form controls and announced to screen readers.
 * 
 * @example
 * <ErrorMessage 
 *   id="email-error"
 *   message="Please enter a valid email address"
 * />
 */
export function ErrorMessage({
  message,
  id,
  className,
  visuallyHidden = false,
}: ErrorMessageProps) {
  if (!message) return null;
  
  return (
    <p
      id={id}
      className={cn(
        "text-sm font-medium text-destructive mt-1",
        visuallyHidden && "sr-only",
        className
      )}
      aria-live="assertive"
    >
      {/* Add an icon for visual users */}
      {!visuallyHidden && (
        <span className="mr-1" aria-hidden="true">
          ⚠️
        </span>
      )}
      {message}
    </p>
  );
}

/**
 * FormErrorSummary component for displaying a summary of form errors
 * 
 * This component should be placed at the top of forms to provide users
 * with a summary of all validation errors. It's especially helpful for
 * screen reader users to understand what needs to be fixed.
 * 
 * @example
 * <FormErrorSummary 
 *   errors={[
 *     { id: 'email', message: 'Please enter a valid email' },
 *     { id: 'password', message: 'Password must be at least 8 characters' }
 *   ]}
 * />
 */
interface FormError {
  id: string;
  message: string;
}

interface FormErrorSummaryProps {
  /**
   * Array of form errors
   */
  errors: FormError[];
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Title for the error summary
   */
  title?: string;
}

export function FormErrorSummary({
  errors,
  className,
  title = "There are errors in the form",
}: FormErrorSummaryProps) {
  if (!errors || errors.length === 0) return null;
  
  return (
    <div
      className={cn(
        "border-2 border-destructive bg-destructive/10 p-4 rounded-md mb-6",
        className
      )}
      aria-live="assertive"
      role="alert"
      tabIndex={-1} // Makes it focusable programmatically but not in tab order
    >
      <h2 className="text-lg font-semibold text-destructive mb-2">{title}</h2>
      <ul className="list-disc pl-5 space-y-1">
        {errors.map((error) => (
          <li key={error.id}>
            <a 
              href={`#${error.id}`} 
              className="text-destructive hover:underline focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2 rounded"
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById(error.id);
                if (element) {
                  element.focus();
                  // Scroll into view with some padding at the top
                  window.scrollTo({
                    top: element.getBoundingClientRect().top + window.pageYOffset - 100,
                    behavior: 'smooth'
                  });
                }
              }}
            >
              {error.message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ErrorMessage is a utility component. No changes needed for spacing/alignment here.