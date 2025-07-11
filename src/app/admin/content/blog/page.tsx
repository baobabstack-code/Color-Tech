"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  FileText, Plus, Filter, ArrowUpDown,
  Edit, Trash2, Eye, Calendar, User,
  RefreshCw, AlertCircle
} from "lucide-react";
import { contentService } from '@/services/contentService';
import type { BlogPost } from '@/services/contentService';
import { useToast } from "@/hooks/use-toast"; // Ensure useToast is imported

export default function BlogManagement() {
  const { toast } = useToast(); // Initialize toast
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState<BlogPost[]>([]); // Use posts state directly
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true); // Manage loading state
  const [error, setError] = useState<string | null>(null); // Manage error state
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    drafts: 0
  });

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await contentService.getBlogPosts();
      setPosts(data);
    } catch (err: any) {
      console.error('Failed to fetch posts:', err);
      setError('Failed to load blog posts. Please try again.');
      toast({
        title: "Error",
        description: "Failed to load blog posts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []); // Fetch posts on component mount

  const refetch = () => { // Define refetch function
    fetchPosts();
  };

  const handleDelete = async (id: number) => {
    try {
      await contentService.deleteBlogPost(id.toString());
      toast({
        title: "Success",
        description: "Blog post deleted successfully.",
      });
      refetch(); // Refetch posts after deletion
    } catch (err: any) {
      console.error('Failed to delete post:', err);
      toast({
        title: "Error",
        description: "Failed to delete blog post. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  useEffect(() => {
    if (posts) {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = posts.filter(post =>
        post.title.toLowerCase().includes(lowercasedSearch) ||
        (post.body && post.body.toLowerCase().includes(lowercasedSearch)) ||
        (post.author && post.author.toLowerCase().includes(lowercasedSearch))
      );
      setFilteredPosts(filtered);
      
      const published = posts.filter(post => post.is_published).length;
      const drafts = posts.filter(post => !post.is_published).length;
      
      setStats({
        total: posts.length,
        published,
        drafts
      });
    } else {
      setFilteredPosts([]);
    }
  }, [posts, searchTerm]);

  const getStatusBadgeVariant = (isPublished: boolean) => { // Change status to isPublished
    return isPublished ? 'default' : 'secondary'; // Map boolean to badge variant
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Blog Management</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={refetch} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Posts</p>
              <h3 className="text-2xl font-bold">
                {loading ? <RefreshCw className="h-5 w-5 animate-spin" /> : stats.total}
              </h3>
            </div>
            <FileText className="h-8 w-8 text-primary" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Published</p>
              <h3 className="text-2xl font-bold">
                {loading ? <RefreshCw className="h-5 w-5 animate-spin" /> : stats.published}
              </h3>
            </div>
            <Eye className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Drafts</p>
              <h3 className="text-2xl font-bold">
                {loading ? <RefreshCw className="h-5 w-5 animate-spin" /> : stats.drafts}
              </h3>
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
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-primary mr-2" />
          <p>Loading blog posts...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center py-12 text-red-500">
          <AlertCircle className="h-8 w-8 mr-2" />
          <p>Failed to load blog posts. Please try again.</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="flex justify-center items-center py-12 text-gray-500">
          <p>No blog posts found. {searchTerm ? 'Try a different search term.' : 'Create your first blog post.'}</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredPosts.map((post) => (
          <Card key={post.id} className="p-6">
            <div className="flex gap-6">
              <div className="w-48 h-32 rounded-lg overflow-hidden">
                <img 
                  src={post.image_url || '/placeholder.png'} // Use image_url, provide fallback
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-xl font-semibold">{post.title}</h3>
                      <Badge variant={getStatusBadgeVariant(post.is_published)}>
                        {post.is_published ? 'Published' : 'Draft'}
                      </Badge>
                    </div>
                    <p className="text-gray-600">{post.body ? post.body.substring(0, 150) + '...' : 'No content'}</p> {/* Use body, truncate */}
                  </div>
                </div>

                <div className="mt-4 flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {post.author || 'Unknown Author'}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(post.created_at).toLocaleDateString()} {/* Use created_at */}
                  </div>
                  {/* Removed readTime and category as they don't exist in BlogPost */}
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
                  <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(post.id)}> {/* id is now number, handleDelete expects number */}
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