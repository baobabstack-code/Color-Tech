"use client";

import React, { useState, useEffect } from 'react'; // useEffect for client-side data fetching
import { PhoneCall } from 'lucide-react';
import { Image as ImageIcon, ZoomIn } from 'lucide-react';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image"; // Import Image for optimized images
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";

// Define interface for fetched data
interface GalleryItem {
  id: number;
  title: string;
  content_type: string;
  body: string; // JSON string
  image_url: string;
  is_published: boolean;
  tags: string | null;
  author: string | null;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
}

const GalleryPage = () => {
  const [allGalleryItems, setAllGalleryItems] = useState<GalleryItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    async function fetchGalleryItems() {
      try {
        const res = await fetch("/api/content?content_type=gallery&is_published=true", { signal: controller.signal });
        if (!res.ok) {
          console.error('Failed to fetch gallery items:', res.status, res.statusText);
          if (isMounted) setAllGalleryItems([]);
          return;
        }
        const data = await res.json();
        if (isMounted) setAllGalleryItems(data.content || []);
      } catch (e) {
        console.error('Error fetching gallery items:', e);
        if (isMounted) setAllGalleryItems([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchGalleryItems();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  // Add more demo images for a richer gallery
  const demoImages = [
    {
      src: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d",
      alt: "Classic Car Restoration",
      category: "Restoration",
    },
    {
      src: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca",
      alt: "Paint Detailing",
      category: "Paint Work",
    },
    {
      src: "https://images.unsplash.com/photo-1511918984145-48de785d4c4e",
      alt: "Interior Cleaning",
      category: "Detailing",
    },
    {
      src: "https://images.unsplash.com/photo-1517841905240-472988babdf9",
      alt: "Wheel Refurbishment",
      category: "Wheels",
    },
    {
      src: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023",
      alt: "Engine Bay Cleaning",
      category: "Engine",
    },
    {
      src: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
      alt: "Ceramic Coating",
      category: "Coating",
    },
  ];

  // Merge fetched images and demo images for display
  const galleryImages = [
    ...allGalleryItems.map(item => {
      let bodyContent = { original_name: item.title };
      try {
        bodyContent = JSON.parse(item.body);
      } catch (e) {}
      return {
        src: item.image_url || "https://via.placeholder.com/600x450?text=Image",
        alt: item.title,
        category: item.tags ? item.tags.split(',')[0].trim() : 'Uncategorized',
        fallback: "https://via.placeholder.com/600x450?text=Error"
      };
    }),
    ...demoImages.map(img => ({...img, fallback: "https://via.placeholder.com/600x450?text=Error"}))
  ];

  // Update BeforeAfterSlider images (these are still hardcoded for now, can be fetched from API if needed)
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

  // Render loading spinner or skeleton UI
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary border-solid"></div>
        <span className="sr-only">Loading gallery...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 bg-gradient-to-br from-slate-100 via-white to-slate-200 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      {/* Hero Section */}
      <div className="container mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-primary dark:text-white text-center mb-6">
          Our Work Gallery
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-200 text-center max-w-2xl mx-auto mb-8">
          Browse through our portfolio of completed projects showcasing our expertise
          in panel beating, spray painting, and vehicle restoration.
        </p>
      </div>

      {/* Before & After Section */}
      <div className="container mx-auto mb-16">
        <h2 className="text-3xl font-bold text-primary dark:text-white text-center mb-6">
          Before & After Transformations
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-200 text-center max-w-2xl mx-auto mb-8">
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
            <Card
              key={index}
              className="group cursor-pointer overflow-hidden rounded-2xl shadow-xl border border-white/20 bg-white/10 hover:scale-[1.02] transition-transform duration-300"
              onClick={() => setSelectedImage(image.src)}
            >
              <CardHeader className="p-0 relative">
                <div className="aspect-w-4 aspect-h-3">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={600}
                    height={450}
                    className="object-cover w-full h-full transform transition-transform duration-300 group-hover:scale-110 rounded-t-2xl"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = (image as any).fallback;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-t-2xl">
                    <div className="text-white text-center p-4">
                      <ZoomIn className="w-8 h-8 mx-auto mb-2 text-white" />
                      <p className="text-sm font-semibold group-hover:text-sky-300">{image.category}</p>
                      <p className="text-xs mt-1 opacity-80 group-hover:text-gray-50">{image.alt}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 pb-2 px-4">
                <CardTitle className="text-lg truncate">{image.alt}</CardTitle>
                <CardDescription className="truncate text-xs text-gray-500">{image.category}</CardDescription>
              </CardContent>
              <CardFooter className="px-4 pb-4 pt-0 flex justify-end">
                <Button size="sm" variant="outline" className="text-primary border-primary hover:bg-primary hover:text-white">
                  View
                </Button>
              </CardFooter>
            </Card>
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
        <div className="bg-gradient-to-r from-primary to-fuchsia-500 rounded-2xl p-8 md:p-12 text-white text-center relative overflow-hidden shadow-2xl border border-white/30">
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary opacity-40"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">
              Want Similar Results for Your Vehicle?
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Let us help you transform your vehicle. Contact us today for a consultation
              and see how we can bring your vision to life.
            </p>
            <Button size="lg" variant="secondary" className="w-full sm:w-auto shadow-xl" asChild>
              <Link href="/contact" className="flex items-center gap-2">
                <PhoneCall className="h-5 w-5 text-white" />
                Get Started
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;