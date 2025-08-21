"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Image as ImageIcon,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Grid,
  List,
  Upload,
  Save,
  X,
  Camera,
  Tag,
} from "lucide-react";
import Image from "next/image";
import GalleryPicker from "@/components/media/GalleryPicker";
import { useToast } from "@/hooks/use-toast";

interface GalleryItem {
  id: number;
  title: string;
  body: string | null;
  imageUrl: string; // Main image for single, can be used as fallback
  beforeImageUrl: string | null;
  afterImageUrl: string | null;
  type: string;
  isPublished: boolean;
  tags: string | null;
  author: string;
  createdBy: number;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
}

interface GalleryFormData {
  title: string;
  body: string;
  imageUrl: string;
  beforeImageUrl: string;
  afterImageUrl: string;
  type: "single_image" | "before_after";
  isPublished: boolean;
  tags: string;
  author: string;
}

export default function GalleryManagement() {
  const { toast } = useToast();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null); // For single image
  const [beforeImageFile, setBeforeImageFile] = useState<File | null>(null);
  const [afterImageFile, setAfterImageFile] = useState<File | null>(null);
  const [showMediaPicker, setShowMediaPicker] = useState<null | 'single' | 'before' | 'after'>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState<GalleryFormData>({
    title: "",
    body: "",
    imageUrl: "",
    beforeImageUrl: "",
    afterImageUrl: "",
    type: "single_image",
    isPublished: false,
    tags: "",
    author: "ColorTech Team",
  });

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/content/gallery");
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error("Error fetching gallery items:", error);
      toast({
        title: "Error",
        description: "Failed to load gallery items",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsUploading(true);

    try {
      let newImageUrl: string = formData.imageUrl;
      let newBeforeImageUrl: string | null = formData.beforeImageUrl;
      let newAfterImageUrl: string | null = formData.afterImageUrl;

      const uploadFile = async (file: File) => {
        try {
          const response = await fetch(`/api/upload?filename=${file.name}`, {
            method: 'POST',
            body: file,
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Upload error response:', errorData);
            throw new Error(
              `Failed to upload ${file.name}: ${errorData.message || 'Unknown error'}`
            );
          }

          const newBlob = await response.json();
          return newBlob.url;
        } catch (error) {
          console.error('Upload failed:', error);
          throw error;
        }
      };

      if (formData.type === 'single_image') {
        if (imageFile) {
          newImageUrl = await uploadFile(imageFile);
        } else if (selectedItem) {
          newImageUrl = selectedItem.imageUrl; // Retain existing URL if no new file
        }
      } else { // type === 'before_after'
        if (beforeImageFile) {
          newBeforeImageUrl = await uploadFile(beforeImageFile);
        } else if (selectedItem) {
          newBeforeImageUrl = selectedItem.beforeImageUrl; // Retain existing URL
        }

        if (afterImageFile) {
          newAfterImageUrl = await uploadFile(afterImageFile);
        } else if (selectedItem) {
          newAfterImageUrl = selectedItem.afterImageUrl; // Retain existing URL
        }
        // For before_after type, imageUrl can be a fallback or primary display.
        // If no single image file is provided, retain the existing imageUrl from selectedItem.
        // If it's a new item, or no existing imageUrl, it might be empty or a placeholder.
        if (!imageFile && selectedItem) {
          newImageUrl = selectedItem.imageUrl;
        }
      }

      const dataToSave = {
        ...formData,
        imageUrl: newImageUrl,
        beforeImageUrl: newBeforeImageUrl,
        afterImageUrl: newAfterImageUrl,
      };

      const url = selectedItem
        ? `/api/content/gallery/${selectedItem.id}`
        : "/api/content/gallery";
      const method = selectedItem ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSave),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Gallery item ${selectedItem ? "updated" : "created"} successfully`,
        });
        setIsModalOpen(false);
        resetForm();
        fetchGalleryItems();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save gallery item");
      }
    } catch (error: any) {
      toast({
        title: "Error saving item",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this gallery item?")) return;

    try {
      const response = await fetch(`/api/content/gallery/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Gallery item deleted successfully",
        });
        fetchGalleryItems();
      } else {
        throw new Error("Failed to delete gallery item");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete gallery item",
        variant: "destructive",
      });
    }
  };

  const openModal = (item?: GalleryItem) => {
    if (item) {
      setSelectedItem(item);
      setFormData({
        title: item.title,
        body: item.body || "",
        imageUrl: item.imageUrl,
        beforeImageUrl: item.beforeImageUrl || "",
        afterImageUrl: item.afterImageUrl || "",
        type: item.type === "before_after" ? "before_after" : "single_image",
        isPublished: item.isPublished,
        tags: item.tags || "",
        author: item.author,
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setSelectedItem(null);
    setImageFile(null);
    setBeforeImageFile(null);
    setAfterImageFile(null);
    setFormData({
      title: "",
      body: "",
      imageUrl: "",
      beforeImageUrl: "",
      afterImageUrl: "",
      type: "single_image",
      isPublished: false,
      tags: "",
      author: "ColorTech Team",
    });
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.body && item.body.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "published" && item.isPublished) ||
      (filterStatus === "draft" && !item.isPublished);
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
          Gallery Management
        </h1>
        <Button onClick={() => openModal()} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg">
          <Plus className="h-4 w-4 mr-2" />
          Add Image
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Images</p>
              <h3 className="text-2xl font-bold text-white">{items.length}</h3>
            </div>
            <ImageIcon className="h-8 w-8 text-indigo-400" />
          </div>
        </Card>
        <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Published</p>
              <h3 className="text-2xl font-bold text-white">
                {items.filter((i) => i.isPublished).length}
              </h3>
            </div>
            <Eye className="h-8 w-8 text-green-400" />
          </div>
        </Card>
        <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Before/After</p>
              <h3 className="text-2xl font-bold text-white">
                {items.filter((i) => i.type === "before_after").length}
              </h3>
            </div>
            <Camera className="h-8 w-8 text-purple-400" />
          </div>
        </Card>
        <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Tags</p>
              <h3 className="text-2xl font-bold text-white">
                {new Set(items.flatMap(i => i.tags ? i.tags.split(',').map(t => t.trim()) : [])).size}
              </h3>
            </div>
            <Tag className="h-8 w-8 text-yellow-400" />
          </div>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search gallery items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800/50 border-slate-600 text-white placeholder-slate-400"
          />
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-300 h-4 w-4" />
            <Input
              placeholder="Search gallery items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder-slate-300"
            />
          </div>
        </div>
        <Select
          value={filterStatus}
          onValueChange={(value: any) => setFilterStatus(value)}
        >
          <SelectTrigger className="w-48 bg-slate-800/50 border-slate-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-600">
            <SelectItem value="all" className="text-white hover:bg-slate-700">
              All Items
            </SelectItem>
            <SelectItem value="published" className="text-white hover:bg-slate-700">
              Published
            </SelectItem>
            <SelectItem value="draft" className="text-white hover:bg-slate-700">
              Drafts
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Gallery Items */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400"></div>
        </div>
      ) : filteredItems.length === 0 ? (
        <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 p-12 text-center">
          <ImageIcon className="h-16 w-16 mx-auto mb-4 text-slate-600" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No gallery items found
          </h3>
          <p className="text-slate-300 mb-6">
            Create your first gallery item to get started
          </p>
          <Button
            onClick={() => openModal()}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create First Item
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 hover:bg-slate-800/70 transition-all duration-200 overflow-hidden"
            >
              <div className="relative h-48 w-full">
                {item.type === 'before_after' && item.beforeImageUrl && item.afterImageUrl ? (
                  <div className="flex h-full">
                    <div className="relative w-1/2 h-full">
                      <Image src={item.beforeImageUrl} alt={`Before - ${item.title}`} fill className="object-cover" />
                      <div className="absolute top-1 left-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">BEFORE</div>
                    </div>
                    <div className="relative w-1/2 h-full">
                      <Image src={item.afterImageUrl} alt={`After - ${item.title}`} fill className="object-cover" />
                      <div className="absolute top-1 left-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">AFTER</div>
                    </div>
                  </div>
                ) : (
                  <Image
                    src={item.imageUrl || '/placeholder.png'} // Fallback image
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                )}
                <div className="absolute top-2 right-2">
                  <Badge
                    className={
                      item.isPublished
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                    }
                  >
                    {item.isPublished ? "Published" : "Draft"}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">
                  {item.title}
                </h3>
                {item.body && (
                  <p className="text-slate-300 text-sm mb-3 line-clamp-2">
                    {item.body}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                  <span>{item.author}</span>
                  <span>{formatDate(item.createdAt)}</span>
                </div>
                {item.tags && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.tags.split(",").slice(0, 2).map((tag, index) => (
                      <span
                        key={index}
                        className="bg-slate-700/50 text-slate-300 px-2 py-1 rounded text-xs"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openModal(item)}
                    className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Gallery Item Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedItem ? "Edit Gallery Item" : "Create New Gallery Item"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="col-span-3 bg-slate-800 border-slate-600"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value: "single_image" | "before_after") =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger className="col-span-3 bg-slate-800 border-slate-600">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 text-white">
                  <SelectItem value="single_image">Single Image</SelectItem>
                  <SelectItem value="before_after">Before/After</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.type === "single_image" ? (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="imageUrl" className="text-right">
                  Image
                </Label>
                <div className="col-span-3">
                  <div className="flex gap-2">
                    <Input
                      id="imageUrl"
                      type="file"
                      onChange={(e) =>
                        setImageFile(e.target.files ? e.target.files[0] : null)
                      }
                      className="col-span-3 bg-slate-800 border-slate-600 file:text-white"
                    />
                    <Button type="button" variant="outline" onClick={() => setShowMediaPicker('single')}>Choose from Library</Button>
                  </div>
                  {imageFile && (
                    <div className="mt-2">
                      <Image
                        src={URL.createObjectURL(imageFile)}
                        alt="Image Preview"
                        width={100}
                        height={100}
                        className="rounded-md object-cover"
                      />
                    </div>
                  )}
                  {!imageFile && formData.imageUrl && (
                    <div className="mt-2">
                      <Image
                        src={formData.imageUrl}
                        alt="Current Image"
                        width={100}
                        height={100}
                        className="rounded-md object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="beforeImageUrl" className="text-right">
                    Before Image
                  </Label>
                  <div className="col-span-3">
                    <div className="flex gap-2">
                      <Input
                        id="beforeImageUrl"
                        type="file"
                        onChange={(e) =>
                          setBeforeImageFile(
                            e.target.files ? e.target.files[0] : null
                          )
                        }
                        className="col-span-3 bg-slate-800 border-slate-600 file:text-white"
                      />
                      <Button type="button" variant="outline" onClick={() => setShowMediaPicker('before')}>Choose from Library</Button>
                    </div>
                    {beforeImageFile && (
                      <div className="mt-2">
                        <Image
                          src={URL.createObjectURL(beforeImageFile)}
                          alt="Before Image Preview"
                          width={100}
                          height={100}
                          className="rounded-md object-cover"
                        />
                      </div>
                    )}
                    {!beforeImageFile && formData.beforeImageUrl && (
                      <div className="mt-2">
                        <Image
                          src={formData.beforeImageUrl}
                          alt="Current Before Image"
                          width={100}
                          height={100}
                          className="rounded-md object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="afterImageUrl" className="text-right">
                    After Image
                  </Label>
                  <div className="col-span-3">
                    <div className="flex gap-2">
                      <Input
                        id="afterImageUrl"
                        type="file"
                        onChange={(e) =>
                          setAfterImageFile(
                            e.target.files ? e.target.files[0] : null
                          )
                        }
                        className="col-span-3 bg-slate-800 border-slate-600 file:text-white"
                      />
                      <Button type="button" variant="outline" onClick={() => setShowMediaPicker('after')}>Choose from Library</Button>
                    </div>
                    {afterImageFile && (
                      <div className="mt-2">
                        <Image
                          src={URL.createObjectURL(afterImageFile)}
                          alt="After Image Preview"
                          width={100}
                          height={100}
                          className="rounded-md object-cover"
                        />
                      </div>
                    )}
                    {!afterImageFile && formData.afterImageUrl && (
                      <div className="mt-2">
                        <Image
                          src={formData.afterImageUrl}
                          alt="Current After Image"
                          width={100}
                          height={100}
                          className="rounded-md object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="body" className="text-right">
                Description
              </Label>
              <Textarea
                id="body"
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                className="col-span-3 bg-slate-800 border-slate-600 h-24"
                placeholder="Enter a description..."
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tags" className="text-right">
                Tags
              </Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="col-span-3 bg-slate-800 border-slate-600"
                placeholder="e.g., residential, commercial, interior"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isPublished" className="text-right">
                Status
              </Label>
              <div className="col-span-3 flex items-center">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={formData.isPublished}
                  onChange={(e) =>
                    setFormData({ ...formData, isPublished: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="isPublished" className="ml-2 text-sm text-slate-300">
                  Publish this item
                </label>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isUploading}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {selectedItem ? "Update Item" : "Create Item"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showMediaPicker && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Select Image</h2>
              <Button variant="ghost" onClick={() => setShowMediaPicker(null)}>
                Close
              </Button>
            </div>
            <GalleryPicker onSelect={(url) => {
              if (showMediaPicker === 'single') setFormData((p) => ({ ...p, imageUrl: url }));
              if (showMediaPicker === 'before') setFormData((p) => ({ ...p, beforeImageUrl: url } as any));
              if (showMediaPicker === 'after') setFormData((p) => ({ ...p, afterImageUrl: url } as any));
              setShowMediaPicker(null);
            }} />
          </div>
        </div>
      )}
    </div>
  );
}
