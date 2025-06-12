"use client";

import React, { useState } from 'react';
import { Image as ImageIcon, ZoomIn } from 'lucide-react';
import BeforeAfterSlider from '@/components/BeforeAfterSlider'; // Adjusted import path
import Link from "next/link"; // Import Link from next/link

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const galleryImages = [
    {
      src: "https://images.unsplash.com/photo-1578844251758-2f71da64c96f",
      alt: "Car Spray Painting Process",
      category: "Spray Painting",
      fallback: "https://images.unsplash.com/photo-1589758438368-0ad531db3366"
    },
    {
      src: "https://images.unsplash.com/photo-1625047509168-a7026f36de04",
      alt: "Panel Beating Work",
      category: "Panel Beating",
      fallback: "https://images.unsplash.com/photo-1589758443949-f377a77072f5"
    },
    {
      src: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e",
      alt: "Car Paint Finishing",
      category: "Paint Finishing",
      fallback: "https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9"
    },
    {
      src: "https://images.unsplash.com/photo-1599256872237-5dcc0fbe9668",
      alt: "Auto Body Repair",
      category: "Body Repair",
      fallback: "https://images.unsplash.com/photo-1562141961-b5d30fcb1f85"
    },
    {
      src: "https://images.unsplash.com/photo-1635764751197-c8c6b3e81c0a",
      alt: "Paint Color Matching",
      category: "Color Matching",
      fallback: "https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9"
    },
    {
      src: "https://images.unsplash.com/photo-1507136566006-cfc505b114fc",
      alt: "Professional Auto Workshop",
      category: "Workshop",
      fallback: "https://images.unsplash.com/photo-1613214149922-f1809c99b69c"
    },
    {
      src: "https://images.unsplash.com/photo-1600661653561-629509216228",
      alt: "Luxury Car Detailing",
      category: "Detailing",
      fallback: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785"
    },
    {
      src: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068",
      alt: "Paint Booth Process",
      category: "Paint Booth",
      fallback: "https://images.unsplash.com/photo-1589758438368-0ad531db3366"
    },
    {
      src: "https://images.unsplash.com/photo-1562141961-b5d30fcb1f85",
      alt: "Quality Inspection",
      category: "Quality Control",
      fallback: "https://images.unsplash.com/photo-1613214149922-f1809c99b69c"
    },
    {
      src: "https://images.unsplash.com/photo-1589758443949-f377a77072f5",
      alt: "Before and After Restoration",
      category: "Before & After",
      fallback: "https://images.unsplash.com/photo-1562141961-b5d30fcb1f85"
    },
    {
      src: "https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9",
      alt: "Collision Repair",
      category: "Collision Repair",
      fallback: "https://images.unsplash.com/photo-1589758443949-f377a77072f5"
    },
    {
      src: "https://images.unsplash.com/photo-1613214149922-f1809c99b69c",
      alt: "Custom Paint Job",
      category: "Custom Paint",
      fallback: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e"
    }
  ];

  // Filter categories for the filter buttons
  const categories = Array.from(new Set(galleryImages.map(img => img.category)));

  // Update BeforeAfterSlider images
  const transformations = [
    {
      beforeImage: "https://images.unsplash.com/photo-1578844251758-2f71da64c96f",
      afterImage: "https://images.unsplash.com/photo-1562141961-b5d30fcb1f85",
      title: "Complete Body Restoration",
      description: "Major collision damage repair and full body restoration",
      duration: "2 weeks"
    },
    {
      beforeImage: "https://images.unsplash.com/photo-1589758438368-0ad531db3366",
      afterImage: "https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9",
      title: "Paint Correction",
      description: "Professional paint correction and ceramic coating",
      duration: "3 days"
    }
  ];

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      {/* Hero Section */}
      <div className="container mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-primary text-center mb-6">
          Our Work Gallery
        </h1>
        <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-8">
          Browse through our portfolio of completed projects showcasing our expertise 
          in panel beating, spray painting, and vehicle restoration.
        </p>
      </div>

      {/* Before & After Section */}
      <div className="container mx-auto mb-16">
        <h2 className="text-3xl font-bold text-primary text-center mb-6">
          Before & After Transformations
        </h2>
        <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-8">
          See the dramatic transformations we achieve through our expert repair and restoration work.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {transformations.map((transform, index) => (
            <BeforeAfterSlider
              key={index}
              beforeImage={transform.beforeImage}
              afterImage={transform.afterImage}
              title={transform.title}
              description={transform.description}
              duration={transform.duration}
            />
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <div 
              key={index}
              className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg bg-white"
              onClick={() => setSelectedImage(image.src)}
            >
              <div className="aspect-w-4 aspect-h-3">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="object-cover w-full h-full transform transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = image.fallback;
                  }}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="text-white text-center p-4">
                  <ZoomIn className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm font-semibold">{image.category}</p>
                  <p className="text-xs mt-1 opacity-80">{image.alt}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl w-full">
            <img
              src={selectedImage}
              alt="Selected work"
              className="w-full h-auto rounded-lg"
            />
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors duration-200"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              <span className="sr-only">Close</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="container mx-auto mt-16 text-center">
        <div className="bg-primary text-white rounded-lg p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-4">
            Want Similar Results for Your Vehicle?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Let us help you transform your vehicle. Contact us today for a consultation 
            and see how we can bring your vision to life.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-secondary hover:bg-secondary/90 text-white px-8 py-3 rounded-md transition-colors duration-200"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Gallery;