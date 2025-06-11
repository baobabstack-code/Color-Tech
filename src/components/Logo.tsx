"use client"

import { FC } from 'react';
import { useState } from 'react';

interface LogoProps {
  className?: string;
}

const Logo: FC<LogoProps> = ({ className = "h-8 w-auto" }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <img
      src={imageError ? 'https://placehold.co/64x64/F97316/ffffff?text=CT' : '/images/logo/color-tech-logo.png'}
      alt="Color Tech Panel Beaters"
      className={className}
      onError={() => {
        setImageError(true);
        console.error('Failed to load logo image');
      }}
    />
  );
};

export default Logo; 