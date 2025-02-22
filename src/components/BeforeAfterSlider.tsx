import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeftRight } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  title: string;
  description: string;
  duration: string;
}

const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  title,
  description,
  duration
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    let clientX: number;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }

    const position = ((clientX - rect.left) / rect.width) * 100;
    setSliderPosition(Math.min(Math.max(position, 0), 100));
  };

  const handleMouseDown = () => {
    if (!containerRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      handleMove(e as unknown as React.MouseEvent);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', handleMouseMove);
    }, { once: true });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div 
        ref={containerRef}
        className="relative h-[400px] cursor-ew-resize"
        onMouseDown={handleMouseDown}
        onTouchMove={handleMove}
        onTouchStart={handleMove}
      >
        {/* After Image (Full) */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${afterImage})` }}
        />

        {/* Before Image (Partial) */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${beforeImage})`,
            width: `${sliderPosition}%`,
            borderRight: '3px solid white'
          }}
        />

        {/* Slider Handle */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
          style={{ left: `${sliderPosition}%`, marginLeft: '-1.5px' }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white rounded-full p-2 shadow-lg">
            <ArrowLeftRight className="w-6 h-6 text-secondary" />
          </div>
        </div>

        {/* Labels */}
        <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          Before
        </div>
        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          After
        </div>
      </div>

      {/* Project Details */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-primary mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex items-center text-sm text-gray-500">
          <span className="font-medium">Duration:</span>
          <span className="ml-2">{duration}</span>
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterSlider; 