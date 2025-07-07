import { cva } from "class-variance-authority";

export const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800", // Darker shades for better contrast
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive",
        outline:
          "border-2 border-primary-600 bg-transparent text-primary-800 hover:bg-primary-50 hover:text-primary-900 active:bg-primary-100", // Thicker border, better contrast text
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary",
        ghost: "text-primary-800 hover:bg-primary-50 hover:text-primary-900 active:bg-primary-100", // Better contrast
        link: "text-primary-700 underline underline-offset-4 hover:text-primary-900 hover:underline active:text-primary-800", // Always underlined for clarity
      },
      size: {
        default: "h-10 min-h-10 px-4 py-2", // Ensure minimum height for touch targets
        sm: "h-9 min-h-9 rounded-md px-3 py-1.5",
        lg: "h-12 min-h-12 rounded-md px-8 py-3 text-base", // Larger text for large buttons
        icon: "h-10 w-10 min-h-10 min-w-10", // Ensure minimum size for touch targets
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export const navigationMenuTriggerStyle = cva(
  "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
);

//
// Standard Button Usage:
// <Button className="w-full h-10 px-6 py-2 rounded-md bg-primary text-white hover:bg-primary/90 focus:ring-2 focus:ring-primary/50 transition-colors duration-200">
//
// Use this className for all primary actions. Adjust variant/size as needed for secondary, ghost, or icon buttons.
