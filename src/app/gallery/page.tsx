"use client";

import React, { useState, useEffect } from "react"; // useEffect for client-side data fetching
import { PhoneCall, ZoomIn } from "lucide-react";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image"; // Import Image for optimized images
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

// Define interface for fetched data
interface GalleryItem {
  id: number;
  title: string;
  body: string | null;
  imageUrl: string;
  beforeImageUrl?: string | null;
  afterImageUrl?: string | null;
  type?: string;
  isPublished: boolean;
  tags: string | null;
  author: string;
  createdBy: number;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
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
        const res = await fetch("/api/content/gallery?published=true", {
          signal: controller.signal,
        });
        if (!res.ok) {
          console.error(
            "Failed to fetch gallery items:",
            res.status,
            res.statusText
          );
          if (isMounted) setAllGalleryItems([]);
          return;
        }
        const data = await res.json();
        if (isMounted) setAllGalleryItems(data || []);
      } catch (e) {
        console.error("Error fetching gallery items:", e);
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

  // Transform gallery items for display
  const galleryImages = allGalleryItems.map((item) => ({
    src: item.imageUrl,
    alt: item.title,
    category: item.tags ? item.tags.split(",")[0].trim() : "Our Work",
    description: item.body || "",
    fallback: "https://via.placeholder.com/600x450?text=ColorTech",
  }));

  // Build Before/After transformations from published gallery items
  const transformations = allGalleryItems
    .filter((item) => (item.type === "before_after") && item.beforeImageUrl && item.afterImageUrl)
    .map((item) => ({
      beforeImage: item.beforeImageUrl as string,
      afterImage: item.afterImageUrl as string,
      title: item.title,
      description: item.body || "",
      duration: "", // Optional: extend schema to include duration if needed
    }));

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
    <div className="min-h-screen pt-32 md:pt-36 pb-12 px-4 bg-gradient-to-br from-slate-100 via-white to-slate-200 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      {/* Hero Section */}
      <div className="container mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-primary dark:text-white text-center mb-6">
          Our Work Gallery
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-200 text-center max-w-2xl mx-auto mb-8">
          Browse through our portfolio of completed projects showcasing our
          expertise in panel beating, spray painting, and vehicle restoration.
        </p>
      </div>

      {/* Before & After Section */}
      <div className="container mx-auto mb-16">
        <h2 className="text-3xl font-bold text-primary dark:text-white text-center mb-6">
          Before & After Transformations
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-200 text-center max-w-2xl mx-auto mb-8">
          See the dramatic transformations we achieve through our expert repair
          and restoration work.
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
              className="group cursor-pointer overflow-hidden rounded-2xl shadow-xl border-slate-200 dark:border-white/20 bg-white/90 dark:bg-slate-800/90 hover:scale-[1.02] transition-transform duration-300 flex flex-col min-h-[480px]"
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
                      <p className="text-sm font-semibold group-hover:text-sky-300">
                        {image.category}
                      </p>
                      <p className="text-xs mt-1 opacity-80 group-hover:text-gray-50">
                        Click to view larger
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 flex-grow">
                <CardTitle className="text-lg font-semibold leading-tight mb-2 text-slate-800 dark:text-white">
                  {image.alt}
                </CardTitle>
                <CardDescription className="text-sm text-slate-600 dark:text-gray-300 mb-2">
                  {image.category}
                </CardDescription>
                {(image as any).description && (
                  <p className="text-xs text-slate-500 dark:text-gray-400 line-clamp-2">
                    {(image as any).description}
                  </p>
                )}
              </CardContent>
              <CardFooter className="px-4 pb-4 pt-0 flex justify-end">
                <Button
                  size="sm"
                  className="mt-2 sm:mt-0 bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                >
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
              type="button"
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors duration-200"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              <span className="sr-only">Close</span>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
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
              Let us help you transform your vehicle. Contact us today for a
              consultation and see how we can bring your vision to life.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="w-full sm:w-auto shadow-xl"
              asChild
            >
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
