"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, Image, MessageSquare, 
  HelpCircle, Settings, RefreshCw
} from "lucide-react";
import Link from "next/link";
import { contentService } from "@/services/contentService";
import { useToast } from "@/components/ui/use-toast";

export default function ContentManagement() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contentCounts, setContentCounts] = useState({
    blogPosts: 0,
    gallery: 0,
    testimonials: 0,
    faqs: 0
  });
  
  const { toast } = useToast();
  
  const fetchContentCounts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch all content counts in parallel
      const [blogPosts, gallery, testimonials, faqs] = await Promise.all([
        contentService.getBlogPosts(),
        contentService.getGalleryItems(),
        contentService.getTestimonials(),
        contentService.getFAQs()
      ]);
      
      setContentCounts({
        blogPosts: blogPosts.length,
        gallery: gallery.length,
        testimonials: testimonials.length,
        faqs: faqs.length
      });
    } catch (err) {
      console.error('Error fetching content counts:', err);
      setError('Failed to load content counts');
      toast({
        title: "Error",
        description: "Failed to load content counts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchContentCounts();
  }, []);
  
  const contentSections = [
    {
      title: "Blog Posts",
      icon: <FileText className="h-6 w-6" />,
      description: "Manage blog articles and content",
      path: "/admin/content/blog",
      count: contentCounts.blogPosts
    },
    {
      title: "Gallery",
      icon: <Image className="h-6 w-6" />,
      description: "Manage project photos and videos",
      path: "/admin/content/gallery",
      count: contentCounts.gallery
    },
    {
      title: "Testimonials",
      icon: <MessageSquare className="h-6 w-6" />,
      description: "Manage customer testimonials",
      path: "/admin/content/testimonials",
      count: contentCounts.testimonials
    },
    {
      title: "FAQs",
      icon: <HelpCircle className="h-6 w-6" />,
      description: "Manage frequently asked questions",
      path: "/admin/content/faqs",
      count: contentCounts.faqs
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Content Management</h1>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={fetchContentCounts} 
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Content Settings
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {contentSections.map((section) => (
          <Card key={section.title} className="p-6">
            <Link href={section.path} className="block">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-primary/10 rounded-full mb-4">
                  {section.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{section.title}</h3>
                <p className="text-gray-600 mb-4">{section.description}</p>
                <div className="text-sm text-gray-500">
                  {isLoading ? (
                    <span className="flex items-center">
                      <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                      Loading...
                    </span>
                  ) : (
                    <span>{section.count} Items</span>
                  )}
                </div>
              </div>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}