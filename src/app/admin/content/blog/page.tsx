"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Plus, Trash2, Eye, Calendar, User,
  RefreshCw, AlertCircle, Edit, Image as ImageIcon
} from "lucide-react";
import { contentService } from '@/services/contentService';
import BlogEditor from '@/components/blog/Editor';
import GalleryPicker from '@/components/media/GalleryPicker';

export default function BlogManagement() {
  const [posts, setPosts] = useState<any[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showGallery, setShowGallery] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await contentService.getBlogPosts();
      setPosts(data);
      setFilteredPosts(data);
    } catch (err) {
      setError("Failed to load blog posts");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = posts.filter((post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.body && post.body.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (post.author && post.author.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(posts);
    }
  }, [searchTerm, posts]);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        await contentService.deleteBlogPost(id.toString());
        fetchPosts();
      } catch (err) {
        console.error("Failed to delete post:", err);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h1 className="text-2xl font-bold">Blog Posts</h1>
        <div className="flex gap-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Input 
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-primary mr-2" />
            <p>Loading blog posts...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-12 text-danger">
            <AlertCircle className="h-8 w-8 mr-2" />
            <p>{error}</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="flex justify-center items-center py-12 text-muted">
            <p>No blog posts found. {searchTerm ? 'Try a different search term.' : 'Create your first blog post.'}</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  {post.image_url && (
                    <div className="w-full sm:w-48 h-40 sm:h-32 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 flex flex-col">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-2 sm:mb-0">
                        <h3 className="text-lg sm:text-xl font-semibold">{post.title}</h3>
                        <Badge variant={post.is_published ? 'default' : 'secondary'}>
                          {post.is_published ? 'Published' : 'Draft'}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-danger hover:text-danger/90"
                          onClick={() => handleDelete(post.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                    <p className="text-muted text-sm sm:text-base mb-3 flex-grow">
                      {post.body ? post.body.substring(0, 150) + '...' : 'No content'}
                    </p>
                    <div className="mt-auto flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted">
                      <div className="flex items-center">
                        <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        {post.author || 'Unknown Author'}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        {new Date(post.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {showGallery && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Select Image</h2>
              <Button variant="ghost" onClick={() => setShowGallery(false)}>
                Close
              </Button>
            </div>
            <GalleryPicker onSelect={(url) => {
              setSelectedImage(url)
              setShowGallery(false)
            }} />
          </div>
        </div>
      )}
    </div>
  );
}