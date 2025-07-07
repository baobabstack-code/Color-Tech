"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Image, Plus, Filter, ArrowUpDown,
  Edit, Trash2, Eye, Calendar, Upload,
  MoreVertical, RefreshCw, AlertCircle
} from "lucide-react";
import { contentService, GalleryItem } from "@/services/contentService";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Interface is now imported from contentService.ts

export default function GalleryManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    beforeAfterSets: 0,
    totalViews: 0
  });
  
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<GalleryItem | null>(null);
  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    category: "Paint Work",
    type: "showcase" as 'before-after' | 'showcase',
    image: "",
    beforeImage: "",
    afterImage: "",
    uploadDate: new Date().toISOString().split('T')[0],
    views: 0
  });
  
  const { toast } = useToast();

  const fetchGalleryItems = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await contentService.getGalleryItems();
      setGalleryItems(data);
      setFilteredItems(data);
      
      // Calculate stats
      const beforeAfterSets = data.filter(item => item.type === 'before-after').length;
      const totalViews = data.reduce((sum, item) => sum + item.views, 0);
      
      setStats({
        total: data.length,
        beforeAfterSets,
        totalViews
      });
    } catch (err) {
      console.error('Error fetching gallery items:', err);
      setError('Failed to load gallery items. Please try again.');
      toast({
        title: "Error",
        description: "Failed to load gallery items. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredItems(galleryItems);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = galleryItems.filter(item => 
        item.title.toLowerCase().includes(lowercasedSearch) || 
        item.description.toLowerCase().includes(lowercasedSearch) ||
        item.category.toLowerCase().includes(lowercasedSearch)
      );
      setFilteredItems(filtered);
    }
  }, [searchTerm, galleryItems]);
  
  const handleAddItem = async () => {
    try {
      await contentService.uploadGalleryItem(newItem);
      setIsAddDialogOpen(false);
      setNewItem({
        title: "",
        description: "",
        category: "Paint Work",
        type: "showcase" as 'before-after' | 'showcase',
        image: "",
        beforeImage: "",
        afterImage: "",
        uploadDate: new Date().toISOString().split('T')[0],
        views: 0
      });
      toast({
        title: "Success",
        description: "Gallery item added successfully",
      });
      fetchGalleryItems();
    } catch (err) {
      console.error('Error adding gallery item:', err);
      toast({
        title: "Error",
        description: "Failed to add gallery item. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleEditItem = async () => {
    if (!currentItem) return;
    
    try {
      // Since there's no updateGalleryItem in the service, we'll delete and re-upload
      await contentService.deleteGalleryItem(currentItem.id);
      await contentService.uploadGalleryItem(currentItem);
      
      setIsEditDialogOpen(false);
      setCurrentItem(null);
      toast({
        title: "Success",
        description: "Gallery item updated successfully",
      });
      fetchGalleryItems();
    } catch (err) {
      console.error('Error updating gallery item:', err);
      toast({
        title: "Error",
        description: "Failed to update gallery item. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteItem = async () => {
    if (!currentItem) return;
    
    try {
      await contentService.deleteGalleryItem(currentItem.id);
      setIsDeleteDialogOpen(false);
      setCurrentItem(null);
      toast({
        title: "Success",
        description: "Gallery item deleted successfully",
      });
      fetchGalleryItems();
    } catch (err) {
      console.error('Error deleting gallery item:', err);
      toast({
        title: "Error",
        description: "Failed to delete gallery item. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gallery Management</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={fetchGalleryItems} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Images
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Gallery Item</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newItem.title}
                    onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                    placeholder="Image title"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newItem.description}
                    onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                    placeholder="Image description"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={newItem.category}
                      onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                      placeholder="Category"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="type">Type</Label>
                    <Select 
                      value={newItem.type} 
                      onValueChange={(value) => setNewItem({...newItem, type: value as 'before-after' | 'showcase'})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="showcase">Showcase</SelectItem>
                        <SelectItem value="before-after">Before/After</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {newItem.type === 'showcase' ? (
                  <div className="grid gap-2">
                    <Label htmlFor="image">Image URL</Label>
                    <Input
                      id="image"
                      value={newItem.image}
                      onChange={(e) => setNewItem({...newItem, image: e.target.value})}
                      placeholder="Image URL"
                    />
                  </div>
                ) : (
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="beforeImage">Before Image URL</Label>
                      <Input
                        id="beforeImage"
                        value={newItem.beforeImage}
                        onChange={(e) => setNewItem({...newItem, beforeImage: e.target.value})}
                        placeholder="Before Image URL"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="afterImage">After Image URL</Label>
                      <Input
                        id="afterImage"
                        value={newItem.afterImage}
                        onChange={(e) => setNewItem({...newItem, afterImage: e.target.value})}
                        placeholder="After Image URL"
                      />
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddItem}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Images</p>
              <h3 className="text-2xl font-bold">{stats.total}</h3>
            </div>
            <Image className="h-8 w-8 text-primary" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Before/After Sets</p>
              <h3 className="text-2xl font-bold">{stats.beforeAfterSets}</h3>
            </div>
            <Upload className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Views</p>
              <h3 className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</h3>
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
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-primary mr-2" />
          <p>Loading gallery items...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center py-12 text-red-500">
          <AlertCircle className="h-8 w-8 mr-2" />
          <p>{error}</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="flex justify-center items-center py-12 text-gray-500">
          <p>No gallery items found. {searchTerm ? 'Try a different search term.' : 'Add your first gallery item.'}</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredItems.map((item) => (
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
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://placehold.co/600x400?text=Image+Not+Found";
                        }}
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
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://placehold.co/600x400?text=Image+Not+Found";
                        }}
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
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://placehold.co/600x400?text=Image+Not+Found";
                      }}
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
                    <Dialog open={isEditDialogOpen && currentItem?.id === item.id} onOpenChange={(open) => {
                      setIsEditDialogOpen(open);
                      if (!open) setCurrentItem(null);
                    }}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setCurrentItem(item)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Edit Gallery Item</DialogTitle>
                        </DialogHeader>
                        {currentItem && (
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="edit-title">Title</Label>
                              <Input
                                id="edit-title"
                                value={currentItem.title}
                                onChange={(e) => setCurrentItem({...currentItem, title: e.target.value})}
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="edit-description">Description</Label>
                              <Textarea
                                id="edit-description"
                                value={currentItem.description}
                                onChange={(e) => setCurrentItem({...currentItem, description: e.target.value})}
                                rows={3}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <Label htmlFor="edit-category">Category</Label>
                                <Input
                                  id="edit-category"
                                  value={currentItem.category}
                                  onChange={(e) => setCurrentItem({...currentItem, category: e.target.value})}
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="edit-type">Type</Label>
                                <Select 
                                  value={currentItem.type} 
                                  onValueChange={(value) => setCurrentItem({...currentItem, type: value as 'before-after' | 'showcase'})}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="showcase">Showcase</SelectItem>
                                    <SelectItem value="before-after">Before/After</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            
                            {currentItem.type === 'showcase' ? (
                              <div className="grid gap-2">
                                <Label htmlFor="edit-image">Image URL</Label>
                                <Input
                                  id="edit-image"
                                  value={currentItem.image}
                                  onChange={(e) => setCurrentItem({...currentItem, image: e.target.value})}
                                />
                              </div>
                            ) : (
                              <div className="grid gap-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="edit-beforeImage">Before Image URL</Label>
                                  <Input
                                    id="edit-beforeImage"
                                    value={currentItem.beforeImage}
                                    onChange={(e) => setCurrentItem({...currentItem, beforeImage: e.target.value})}
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="edit-afterImage">After Image URL</Label>
                                  <Input
                                    id="edit-afterImage"
                                    value={currentItem.afterImage}
                                    onChange={(e) => setCurrentItem({...currentItem, afterImage: e.target.value})}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                          <Button onClick={handleEditItem}>Save Changes</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    
                    <Dialog open={isDeleteDialogOpen && currentItem?.id === item.id} onOpenChange={(open) => {
                      setIsDeleteDialogOpen(open);
                      if (!open) setCurrentItem(null);
                    }}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-500 hover:text-red-600"
                          onClick={() => setCurrentItem(item)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirm Deletion</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                          <p>Are you sure you want to delete this gallery item?</p>
                          <p className="font-semibold mt-2">"{currentItem?.title}"</p>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                          <Button variant="destructive" onClick={handleDeleteItem}>Delete</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    
                    <Button variant="outline" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}