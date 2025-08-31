"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Image,
  MessageSquare,
  HelpCircle,
  Settings,
  RefreshCw,
  Home,
} from "lucide-react";
import Link from "next/link";
import { contentService } from "@/services/contentService";
import { useToast } from "@/hooks/use-toast";

export default function ContentManagement() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contentCounts, setContentCounts] = useState({
    blogPosts: 0,
    gallery: 0,
    testimonials: 0,
    faqs: 0,
  });

  const { toast } = useToast();

  const fetchContentCounts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch all content counts in parallel using direct API calls
      const [blogResponse, galleryResponse, testimonialsResponse, faqsResponse] = await Promise.all([
        fetch("/api/content/blog"),
        fetch("/api/content/gallery"),
        fetch("/api/content/testimonials"),
        fetch("/api/content/faqs"),
      ]);

      const [blogPosts, gallery, testimonials, faqs] = await Promise.all([
        blogResponse.ok ? blogResponse.json() : [],
        galleryResponse.ok ? galleryResponse.json() : [],
        testimonialsResponse.ok ? testimonialsResponse.json() : [],
        faqsResponse.ok ? faqsResponse.json() : [],
      ]);

      setContentCounts({
        blogPosts: blogPosts.length,
        gallery: gallery.length,
        testimonials: testimonials.length,
        faqs: faqs.length,
      });
    } catch (err) {
      console.error("Error fetching content counts:", err);
      setError("Failed to load content counts");
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
      title: "Homepage Sections",
      icon: <Home className="h-6 w-6" />,
      description: "Manage homepage section content",
      path: "/admin/content/homepage",
      count: "Dynamic",
    },
    {
      title: "Blog Posts",
      icon: <FileText className="h-6 w-6" />,
      description: "Manage blog articles and content",
      path: "/admin/content/blog",
      count: contentCounts.blogPosts,
    },
    {
      title: "Gallery",
      icon: <Image className="h-6 w-6" />,
      description: "Manage project photos and videos",
      path: "/admin/content/gallery",
      count: contentCounts.gallery,
    },
    {
      title: "Testimonials",
      icon: <MessageSquare className="h-6 w-6" />,
      description: "Manage customer testimonials",
      path: "/admin/content/testimonials",
      count: contentCounts.testimonials,
    },
    {
      title: "FAQs",
      icon: <HelpCircle className="h-6 w-6" />,
      description: "Manage frequently asked questions",
      path: "/admin/content/faqs",
      count: contentCounts.faqs,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
          Content Management
        </h1>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={fetchContentCounts}
            disabled={isLoading}
            className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Link href="/admin/content/settings">
            <Button
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              <Settings className="h-4 w-4 mr-2" />
              Content Settings
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {contentSections.map((section) => (
          <Link key={section.title} href={section.path} className="block group">
            <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 p-6 hover:bg-slate-800/70 transition-all duration-200 h-full">
              <div className="flex flex-col items-center text-center">
                <div className="p-4 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-200">
                  <div className="text-indigo-400">{section.icon}</div>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-indigo-300 transition-colors">
                  {section.title}
                </h3>
                <p className="text-slate-300 text-sm mb-4 flex-grow">
                  {section.description}
                </p>
                <div className="text-sm">
                  {isLoading && typeof section.count === 'number' ? (
                    <span className="flex items-center justify-center text-slate-400">
                      <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                      Loading...
                    </span>
                  ) : (
                    <span className="bg-slate-700/50 px-3 py-1 rounded-full text-slate-300">
                      {typeof section.count === 'number' ? `${section.count} Items` : section.count}
                    </span>
                  )}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
