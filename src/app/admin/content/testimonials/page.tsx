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
  MessageSquare,
  Plus,
  Star,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Search,
  User,
  Save,
  X,
} from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

interface Testimonial {
  id: number;
  name: string;
  role: string | null;
  image: string | null;
  quote: string;
  rating: number;
  status: "pending" | "approved" | "rejected";
  source: string;
  createdAt: string;
  updatedAt: string;
}

interface TestimonialFormData {
  name: string;
  role: string;
  image: string;
  quote: string;
  rating: number;
  status: "pending" | "approved" | "rejected";
  source: string;
}

export default function TestimonialsManagement() {
  const { toast } = useToast();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState<TestimonialFormData>({
    name: "",
    role: "",
    image: "",
    quote: "",
    rating: 5,
    status: "pending",
    source: "website",
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/content/testimonials");
      if (response.ok) {
        const data = await response.json();
        setTestimonials(data);
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      toast({
        title: "Error",
        description: "Failed to load testimonials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsUploading(true);
    let finalImageUrl = formData.image;

    try {
      if (imageFile) {
        const response = await fetch(`/api/upload?filename=${imageFile.name}`, {
          method: 'POST',
          body: imageFile,
        });

        if (!response.ok) {
          throw new Error('Image upload failed');
        }

        const newBlob = await response.json();
        finalImageUrl = newBlob.url;
      }

      const dataToSave = { ...formData, image: finalImageUrl };

      const url = selectedTestimonial
        ? `/api/content/testimonials/${selectedTestimonial.id}`
        : "/api/content/testimonials";
      const method = selectedTestimonial ? "PUT" : "POST";

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
          description: `Testimonial ${selectedTestimonial ? "updated" : "created"} successfully`,
        });
        setIsModalOpen(false);
        resetForm();
        fetchTestimonials();
      } else {
        throw new Error("Failed to save testimonial");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;

    try {
      const response = await fetch(`/api/content/testimonials/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Testimonial deleted successfully",
        });
        fetchTestimonials();
      } else {
        throw new Error("Failed to delete testimonial");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete testimonial",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (id: number, status: "approved" | "rejected") => {
    try {
      const response = await fetch(`/api/content/testimonials/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Testimonial ${status} successfully`,
        });
        fetchTestimonials();
      } else {
        throw new Error(`Failed to ${status} testimonial`);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${status} testimonial`,
        variant: "destructive",
      });
    }
  };

  const openModal = (testimonial?: Testimonial) => {
    if (testimonial) {
      setSelectedTestimonial(testimonial);
      setFormData({
        name: testimonial.name,
        role: testimonial.role || "",
        image: testimonial.image || "",
        quote: testimonial.quote,
        rating: testimonial.rating,
        status: testimonial.status,
        source: testimonial.source,
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setSelectedTestimonial(null);
    setImageFile(null);
    setFormData({
      name: "",
      role: "",
      image: "",
      quote: "",
      rating: 5,
      status: "pending",
      source: "website",
    });
  };

  const filteredTestimonials = testimonials.filter((testimonial) => {
    const matchesSearch =
      testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.quote.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || testimonial.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: testimonials.length,
    approved: testimonials.filter(t => t.status === "approved").length,
    pending: testimonials.filter(t => t.status === "pending").length,
    rejected: testimonials.filter(t => t.status === "rejected").length,
    averageRating: testimonials.length > 0
      ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
      : "0",
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-current" : "text-slate-600"
          }`}
      />
    ));
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
          Testimonials Management
        </h1>
        <Button
          onClick={() => openModal()}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Testimonial
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Total Testimonials</p>
              <h3 className="text-2xl font-bold text-white">{stats.total}</h3>
            </div>
            <MessageSquare className="h-8 w-8 text-indigo-400" />
          </div>
        </Card>
        <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Average Rating</p>
              <h3 className="text-2xl font-bold text-white">{stats.averageRating}</h3>
            </div>
            <Star className="h-8 w-8 text-yellow-400 fill-current" />
          </div>
        </Card>
        <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Approved</p>
              <h3 className="text-2xl font-bold text-white">{stats.approved}</h3>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </Card>
        <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Pending</p>
              <h3 className="text-2xl font-bold text-white">{stats.pending}</h3>
            </div>
            <XCircle className="h-8 w-8 text-orange-400" />
          </div>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-300 h-4 w-4" />
            <Input
              placeholder="Search testimonials..."
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
              All Testimonials
            </SelectItem>
            <SelectItem value="approved" className="text-white hover:bg-slate-700">
              Approved
            </SelectItem>
            <SelectItem value="pending" className="text-white hover:bg-slate-700">
              Pending
            </SelectItem>
            <SelectItem value="rejected" className="text-white hover:bg-slate-700">
              Rejected
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Testimonials List */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400"></div>
        </div>
      ) : filteredTestimonials.length === 0 ? (
        <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 p-12 text-center">
          <MessageSquare className="h-16 w-16 mx-auto mb-4 text-slate-600" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No testimonials found
          </h3>
          <p className="text-slate-300 mb-6">
            Create your first testimonial to get started
          </p>
          <Button
            onClick={() => openModal()}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create First Testimonial
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredTestimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 hover:bg-slate-800/70 transition-all duration-200"
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-slate-400" />
                        <h3 className="text-lg font-semibold text-white">
                          {testimonial.name}
                        </h3>
                      </div>
                      {testimonial.role && (
                        <span className="text-slate-400 text-sm">
                          • {testimonial.role}
                        </span>
                      )}
                      <Badge
                        className={
                          testimonial.status === "approved"
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : testimonial.status === "pending"
                              ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                              : "bg-red-500/20 text-red-400 border-red-500/30"
                        }
                      >
                        {testimonial.status}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      {renderStars(testimonial.rating)}
                      <span className="text-slate-300 text-sm ml-2">
                        {testimonial.rating}/5
                      </span>
                    </div>

                    <blockquote className="text-slate-200 mb-4 italic">
                      "{testimonial.quote}"
                    </blockquote>

                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span>Source: {testimonial.source}</span>
                      <span>{formatDate(testimonial.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    {testimonial.status === "pending" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(testimonial.id, "approved")}
                          className="border-green-600 text-green-400 hover:bg-green-700 hover:text-white"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(testimonial.id, "rejected")}
                          className="border-red-600 text-red-400 hover:bg-red-700 hover:text-white"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openModal(testimonial)}
                      className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(testimonial.id)}
                      className="bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Testimonial Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              {selectedTestimonial ? "Edit Testimonial" : "Create New Testimonial"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-slate-200">
                  Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="bg-slate-800 border-slate-600 text-white"
                  placeholder="Customer name..."
                />
              </div>
              <div>
                <Label htmlFor="role" className="text-slate-200">
                  Role/Title
                </Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="bg-slate-800 border-slate-600 text-white"
                  placeholder="Job title or role..."
                />
              </div>
            </div>

            <div>
              <Label htmlFor="image" className="text-slate-200">
                Author Image
              </Label>
              <div className="mt-2 flex items-center gap-4">
                {(formData.image || imageFile) && (
                  <Image
                    src={imageFile ? URL.createObjectURL(imageFile) : formData.image}
                    alt="Preview"
                    width={80}
                    height={80}
                    className="rounded-full object-cover"
                  />
                )}
                <div className="flex-1">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files) {
                        setImageFile(e.target.files[0]);
                      }
                    }}
                    className="bg-slate-800 border-slate-600 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Upload a new image to replace the existing one.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="quote" className="text-slate-200">
                Testimonial Quote
              </Label>
              <Textarea
                id="quote"
                value={formData.quote}
                onChange={(e) =>
                  setFormData({ ...formData, quote: e.target.value })
                }
                className="bg-slate-800 border-slate-600 text-white h-32"
                placeholder="Enter the testimonial quote..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rating" className="text-slate-200">
                  Rating
                </Label>
                <Select
                  value={formData.rating.toString()}
                  onValueChange={(value) =>
                    setFormData({ ...formData, rating: parseInt(value) })
                  }
                >
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <SelectItem
                        key={rating}
                        value={rating.toString()}
                        className="text-white hover:bg-slate-700"
                      >
                        {rating} Star{rating !== 1 ? "s" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status" className="text-slate-200">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="pending" className="text-white hover:bg-slate-700">
                      Pending
                    </SelectItem>
                    <SelectItem value="approved" className="text-white hover:bg-slate-700">
                      Approved
                    </SelectItem>
                    <SelectItem value="rejected" className="text-white hover:bg-slate-700">
                      Rejected
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="source" className="text-slate-200">
                Source
              </Label>
              <Select
                value={formData.source}
                onValueChange={(value) =>
                  setFormData({ ...formData, source: value })
                }
              >
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="website" className="text-white hover:bg-slate-700">
                    Website
                  </SelectItem>
                  <SelectItem value="google" className="text-white hover:bg-slate-700">
                    Google Reviews
                  </SelectItem>
                  <SelectItem value="facebook" className="text-white hover:bg-slate-700">
                    Facebook
                  </SelectItem>
                  <SelectItem value="email" className="text-white hover:bg-slate-700">
                    Email
                  </SelectItem>
                </SelectContent>
              </Select>
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
                  {selectedTestimonial ? "Update Testimonial" : "Create Testimonial"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
