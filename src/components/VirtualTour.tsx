"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Info, Camera, Navigation } from 'lucide-react';

interface Hotspot {
  id: number;
  x: number;
  y: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const VirtualTour = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const hotspots: Hotspot[] = [
    {
      id: 1,
      x: 25,
      y: 45,
      title: 'Paint Booth',
      description: 'State-of-the-art paint booth with advanced color matching technology',
      icon: <Camera className="w-6 h-6" />
    },
    {
      id: 2,
      x: 55,
      y: 35,
      title: 'Workshop Area',
      description: 'Main repair and restoration workspace with professional equipment',
      icon: <Info className="w-6 h-6" />
    },
    {
      id: 3,
      x: 75,
      y: 65,
      title: 'Quality Control',
      description: 'Dedicated area for final inspection and quality assurance',
      icon: <Navigation className="w-6 h-6" />
    }
  ];

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (containerRef.current?.offsetLeft || 0));
    setScrollLeft(containerRef.current?.scrollLeft || 0);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (containerRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (containerRef.current) {
      containerRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  useEffect(() => {
    const handleMouseLeave = () => setIsDragging(false);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-primary mb-4">Virtual Workshop Tour</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore our state-of-the-art facility with this interactive 360° tour. 
          Click and drag to look around, and discover key areas by clicking on the hotspots.
        </p>
      </div>

      <div className="relative">
        {/* 360 View Container */}
        <div
          ref={containerRef}
          className="relative w-full h-[600px] overflow-hidden rounded-xl shadow-lg cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          {/* Panoramic Image */}
          <img
            src="https://source.unsplash.com/1920x1080/?auto-workshop"
            alt="Workshop panorama"
            className="absolute top-0 left-0 h-full object-cover min-w-[200%]"
            style={{ userSelect: 'none' }}
          />

          {/* Hotspots */}
          {hotspots.map((hotspot) => (
            <div
              key={hotspot.id}
              className="absolute"
              style={{
                left: `${hotspot.x}%`,
                top: `${hotspot.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <button
                className={`
                  relative group p-3 rounded-full 
                  bg-white/90 shadow-lg hover:bg-primary 
                  transition-colors duration-200
                  ${activeHotspot === hotspot.id ? 'bg-primary' : ''}
                `}
                onClick={() => setActiveHotspot(activeHotspot === hotspot.id ? null : hotspot.id)}
                aria-expanded="false"
                data-state={activeHotspot === hotspot.id ? 'expanded' : 'collapsed'}
                aria-label={`View information about ${hotspot.title}`}
                aria-describedby={activeHotspot === hotspot.id ? `tooltip-${hotspot.id}` : undefined}
              >
                <span className={`
                  text-primary group-hover:text-white
                  ${activeHotspot === hotspot.id ? 'text-white' : ''}
                `}>
                  {hotspot.icon}
                </span>

                {/* Tooltip */}
                <div 
                  className={`
                    absolute left-1/2 bottom-full mb-2 -translate-x-1/2
                    bg-white rounded-lg shadow-lg p-4 w-64
                    transition-opacity duration-200
                    ${activeHotspot === hotspot.id ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                  `}
                  role="tooltip"
                  id={`tooltip-${hotspot.id}`}
                  data-state={activeHotspot === hotspot.id ? 'visible' : 'hidden'}
                >
                  <h3 className="font-semibold text-primary mb-2">{hotspot.title}</h3>
                  <p className="text-sm text-gray-600">{hotspot.description}</p>
                  <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 
                    w-4 h-4 bg-white transform rotate-45"></div>
                </div>
              </button>
            </div>
          ))}
        </div>

        {/* Navigation Instructions */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 
          bg-black/50 text-white px-4 py-2 rounded-full text-sm">
          Click and drag to explore • Click hotspots for more information
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="grid md:grid-cols-3 gap-8 mt-12">
        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Camera className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-primary mb-2">360° View</h3>
          <p className="text-gray-600">
            Immerse yourself in our workshop with a complete 360-degree panoramic view
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Info className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-primary mb-2">Interactive Hotspots</h3>
          <p className="text-gray-600">
            Click on highlighted areas to learn more about our equipment and services
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Navigation className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-primary mb-2">Guided Tour</h3>
          <p className="text-gray-600">
            Follow the hotspots for a guided tour of our key service areas
          </p>
        </div>
      </div>
    </div>
  );
};

export default VirtualTour;