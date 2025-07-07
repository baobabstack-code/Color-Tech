import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/lib/variants"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // Ensure we have an accessible name in development
    React.useEffect(() => {
      if (process.env.NODE_ENV !== 'production') {
        if (!props.children && !props['aria-label'] && !props['aria-labelledby']) {
          console.warn(
            'Button is missing an accessible name. Either add text content, an aria-label, or aria-labelledby attribute.'
          );
        }
      }
    }, [props]);

    // Handle keyboard interaction for non-button elements that act as buttons
    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (props.onClick && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        event.currentTarget.click();
      }
      
      // Call the original onKeyDown if it exists
      props.onKeyDown?.(event);
    };
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onKeyDown={asChild ? handleKeyDown : undefined}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
export { buttonVariants } from "@/lib/variants"
