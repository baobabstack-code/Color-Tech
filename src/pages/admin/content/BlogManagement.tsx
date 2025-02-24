import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  FileText, Plus, Filter, ArrowUpDown,
  Edit, Trash2, Eye, Calendar, User
} from "lucide-react";
import { useData } from '@/hooks/useData';
import { contentService } from '@/services/contentService';
import type { BlogPost } from '@/services/contentService';

export default function BlogManagement() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: posts, loading, error, refetch } = useData<BlogPost[]>(
    () => contentService.getBlogPosts(),
    []
  );

  const handleDelete = async (id: string) => {
    try {
      await contentService.deleteBlogPost(id);
      refetch();
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'published':
        return 'default';
      case 'draft':
        return 'secondary';
      case 'archived':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Blog Management</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Posts</p>
              <h3 className="text-2xl font-bold">24</h3>
            </div>
            <FileText className="h-8 w-8 text-primary" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Published</p>
              <h3 className="text-2xl font-bold">18</h3>
            </div>
            <Eye className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Drafts</p>
              <h3 className="text-2xl font-bold">6</h3>
            </div>
            <Edit className="h-8 w-8 text-orange-500" />
          </div>
        </Card>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search blog posts..."
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

      {/* Blog Posts Grid */}
      <div className="grid gap-6">
        {posts?.map((post) => (
          <Card key={post.id} className="p-6">
            <div className="flex gap-6">
              <div className="w-48 h-32 rounded-lg overflow-hidden">
                <img 
                  src={post.imageUrl} 
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-xl font-semibold">{post.title}</h3>
                      <Badge variant={getStatusBadgeVariant(post.status)}>
                        {post.status}
                      </Badge>
                    </div>
                    <p className="text-gray-600">{post.excerpt}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {post.author}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(post.publishDate).toLocaleDateString()}
                  </div>
                  <div>{post.readTime} read</div>
                  <div>Category: {post.category}</div>
                </div>

                <div className="mt-4 flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(post.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
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