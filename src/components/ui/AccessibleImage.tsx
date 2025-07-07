import React from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

interface AccessibleImageProps extends Omit<ImageProps, 'alt'> {
  /**
   * Alternative text for the image. Required for accessibility.
   * Should describe the content and function of the image.
   */
  alt: string;
  
  /**
   * Optional longer description for complex images
   */
  longDescription?: string;
  
  /**
   * ID for the long description (if provided)
   */
  longDescriptionId?: string;
  
  /**
   * Whether the image is decorative only and should be hidden from screen readers
   */
  decorative?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Optional caption to display below the image
   */
  caption?: React.ReactNode;
}

/**
 * AccessibleImage component for displaying images with proper accessibility attributes
 * 
 * This component ensures that all images have appropriate alt text and
 * optionally supports longer descriptions for complex images.
 * 
 * @example
 * <AccessibleImage
 *   src="/path/to/image.jpg"
 *   alt="A person using a computer"
 *   width={800}
 *   height={600}
 * />
 */
export function AccessibleImage({
  alt,
  longDescription,
  longDescriptionId,
  decorative = false,
  className,
  caption,
  ...props
}: AccessibleImageProps) {
  // Generate an ID for the long description if one is provided but no ID is specified
  const generatedDescriptionId = React.useId();
  const descriptionId = longDescription ? (longDescriptionId || generatedDescriptionId) : undefined;
  
  return (
    <figure className={cn("relative", className)}>
      <Image
        {...props}
        alt={decorative ? '' : alt}
        aria-hidden={decorative}
        aria-describedby={descriptionId}
        className={cn(
          "max-w-full h-auto",
          props.className
        )}
      />
      
      {/* Visually hidden long description for screen readers */}
      {longDescription && (
        <div 
          id={descriptionId}
          className="sr-only"
        >
          {longDescription}
        </div>
      )}
      
      {/* Optional visible caption */}
      {caption && (
        <figcaption className="text-sm text-muted-foreground mt-2">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/**
 * DecorativeImage component for purely decorative images
 * 
 * This component is specifically for images that are purely decorative and
 * should be hidden from screen readers. It automatically sets alt="" and
 * aria-hidden="true".
 * 
 * @example
 * <DecorativeImage
 *   src="/path/to/background.jpg"
 *   width={1200}
 *   height={400}
 * />
 */
export function DecorativeImage(props: Omit<ImageProps, 'alt'>) {
  return (
    <Image
      {...props}
      alt=""
      aria-hidden="true"
      role="presentation"
      className={cn(
        "max-w-full h-auto",
        props.className
      )}
    />
  );
}