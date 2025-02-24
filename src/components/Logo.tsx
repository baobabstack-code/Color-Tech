import { FC } from 'react';

interface LogoProps {
  className?: string;
}

const Logo: FC<LogoProps> = ({ className = "h-8 w-auto" }) => {
  return (
    <img
      src="/images/logo/color-tech-logo.png"
      alt="Color-tech Panel Beaters"
      className={className}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = 'https://placehold.co/64x64/F97316/ffffff?text=CT';
      }}
    />
  );
};

export default Logo; 