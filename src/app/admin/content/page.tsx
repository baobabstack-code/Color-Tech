"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, Image, MessageSquare, 
  HelpCircle, Settings 
} from "lucide-react";
import Link from "next/link"; // Import Link from next/link

export default function ContentManagement() {
  const contentSections = [
    {
      title: "Blog Posts",
      icon: <FileText className="h-6 w-6" />,
      description: "Manage blog articles and content",
      path: "/admin/content/blog",
      count: 24
    },
    {
      title: "Gallery",
      icon: <Image className="h-6 w-6" />,
      description: "Manage project photos and videos",
      path: "/admin/content/gallery",
      count: 156
    },
    {
      title: "Testimonials",
      icon: <MessageSquare className="h-6 w-6" />,
      description: "Manage customer testimonials",
      path: "/admin/content/testimonials",
      count: 48
    },
    {
      title: "FAQs",
      icon: <HelpCircle className="h-6 w-6" />,
      description: "Manage frequently asked questions",
      path: "/admin/content/faqs",
      count: 32
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Content Management</h1>
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Content Settings
        </Button>
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
                  {section.count} Items
                </div>
              </div>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}