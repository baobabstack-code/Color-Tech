import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Image, Plus, Filter, ArrowUpDown,
  Edit, Trash2, Eye, Calendar, Upload,
  MoreVertical
} from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'before-after' | 'showcase';
  beforeImage?: string;
  afterImage?: string;
  image?: string;
  uploadDate: string;
  views: number;
}

export default function GalleryManagement() {
  const [searchTerm, setSearchTerm] = useState("");

  const galleryItems: GalleryItem[] = [
    {
      id: "GA001",
      title: "Complete Body Restoration",
      description: "Full restoration of a vintage car including panel beating and respraying",
      category: "Restoration",
      type: 'before-after',
      beforeImage: "https://images.unsplash.com/photo-1589739900266-43b2843f4c12",
      afterImage: "https://images.unsplash.com/photo-1596883040737-6d38c9e905b0",
      uploadDate: "2024-03-01",
      views: 1250
    },
    {
      id: "GA002",
      title: "Custom Paint Job",
      description: "Premium metallic paint finish with custom design",
      category: "Paint Work",
      type: 'showcase',
      image: "https://images.unsplash.com/photo-1611566026373-c6c8da0ea861",
      uploadDate: "2024-03-15",
      views: 890
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gallery Management</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Images
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Images</p>
              <h3 className="text-2xl font-bold">156</h3>
            </div>
            <Image className="h-8 w-8 text-primary" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Before/After Sets</p>
              <h3 className="text-2xl font-bold">48</h3>
            </div>
            <Upload className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Views</p>
              <h3 className="text-2xl font-bold">25.6K</h3>
            </div>
            <Eye className="h-8 w-8 text-orange-500" />
          </div>
        </Card>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search gallery..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
        <Button variant="outline">
          <ArrowUpDown className="h-4 w-4 mr-2" />
          Sort
        </Button>
      </div>

      {/* Gallery Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {galleryItems.map((item) => (
          <Card key={item.id} className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
                <Badge>{item.category}</Badge>
              </div>

              {item.type === 'before-after' ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative aspect-video">
                    <img
                      src={item.beforeImage}
                      alt="Before"
                      className="rounded-lg object-cover w-full h-full"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary">Before</Badge>
                    </div>
                  </div>
                  <div className="relative aspect-video">
                    <img
                      src={item.afterImage}
                      alt="After"
                      className="rounded-lg object-cover w-full h-full"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary">After</Badge>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative aspect-video">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="rounded-lg object-cover w-full h-full"
                  />
                </div>
              )}

              <div className="flex justify-between items-center text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(item.uploadDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {item.views.toLocaleString()} views
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                  <Button variant="outline" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 