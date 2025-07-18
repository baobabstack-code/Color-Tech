import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "@/lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      // Enhanced contrast for better accessibility
      "border-2 border-primary-600 font-medium",
      className
    )}
    // Ensure tooltip remains visible when user navigates to it with keyboard
    aria-live="polite"
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

/**
 * Accessible Tooltip component
 *
 * This component provides an accessible tooltip that appears when hovering or focusing on an element.
 * It follows accessibility best practices by being keyboard accessible and providing appropriate ARIA attributes.
 *
 * @example
 * <AccessibleTooltip content="This is a helpful tooltip">
 *   <Button>Hover me</Button>
 * </AccessibleTooltip>
 */
interface AccessibleTooltipProps {
  /**
   * The content to display in the tooltip
   */
  content: React.ReactNode;

  /**
   * The element that triggers the tooltip
   */
  children: React.ReactNode;

  /**
   * The delay before showing the tooltip (in ms)
   * @default 700
   */
  delayDuration?: number;

  /**
   * Additional classes to apply to the tooltip content
   */
  contentClassName?: string;

  /**
   * Whether the tooltip should skip the delay when showing
   * @default false
   */
  skipDelayDuration?: boolean;
}

function AccessibleTooltip({
  content,
  children,
  delayDuration = 700,
  contentClassName,
  skipDelayDuration = false,
}: AccessibleTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={delayDuration}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className={contentClassName}>{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  AccessibleTooltip,
};
