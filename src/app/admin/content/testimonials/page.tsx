"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  MessageSquare, Plus, Filter, ArrowUpDown,
  Edit, Trash2, Star, Calendar, User,
  CheckCircle, XCircle, RefreshCw, AlertCircle
} from "lucide-react";
import { contentService, Testimonial } from "@/services/contentService";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// Interface is now imported from contentService.ts

export default function TestimonialManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [filteredTestimonials, setFilteredTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    averageRating: 0
  });
  
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState<Testimonial | null>(null);
  const [newTestimonial, setNewTestimonial] = useState({
    name: "",
    role: "",
    image: "https://images.unsplash.com/photo-1511367461989-f85a21fda167", // Default placeholder image
    quote: "",
    rating: 5,
    status: "pending" as 'approved' | 'pending' | 'rejected',
    date: new Date().toISOString().split('T')[0],
    source: "website" as 'website' | 'google' | 'facebook'
  });
  
  const { toast } = useToast();

  const fetchTestimonials = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await contentService.getTestimonials();
      setTestimonials(data);
      setFilteredTestimonials(data);
      
      // Calculate stats
      const approved = data.filter(t => t.status === 'approved').length;
      const pending = data.filter(t => t.status === 'pending').length;
      const totalRating = data.reduce((sum, t) => sum + t.rating, 0);
      const averageRating = data.length > 0 ? +(totalRating / data.length).toFixed(1) : 0;
      
      setStats({
        total: data.length,
        approved,
        pending,
        averageRating
      });
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      setError('Failed to load testimonials. Please try again.');
      toast({
        title: "Error",
        description: "Failed to load testimonials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredTestimonials(testimonials);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = testimonials.filter(testimonial => 
        testimonial.name.toLowerCase().includes(lowercasedSearch) || 
        testimonial.quote.toLowerCase().includes(lowercasedSearch) ||
        testimonial.role.toLowerCase().includes(lowercasedSearch) ||
        testimonial.source.toLowerCase().includes(lowercasedSearch)
      );
      setFilteredTestimonials(filtered);
    }
  }, [searchTerm, testimonials]);
  
  const handleAddTestimonial = async () => {
    try {
      await contentService.createTestimonial(newTestimonial);
      setIsAddDialogOpen(false);
      setNewTestimonial({
        name: "",
        role: "",
        image: "https://images.unsplash.com/photo-1511367461989-f85a21fda167",
        quote: "",
        rating: 5,
        status: "pending" as 'approved' | 'pending' | 'rejected',
        date: new Date().toISOString().split('T')[0],
        source: "website" as 'website' | 'google' | 'facebook'
      });
      toast({
        title: "Success",
        description: "Testimonial added successfully",
      });
      fetchTestimonials();
    } catch (err) {
      console.error('Error adding testimonial:', err);
      toast({
        title: "Error",
        description: "Failed to add testimonial. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleEditTestimonial = async () => {
    if (!currentTestimonial) return;
    
    try {
      await contentService.updateTestimonial(currentTestimonial.id, currentTestimonial);
      setIsEditDialogOpen(false);
      setCurrentTestimonial(null);
      toast({
        title: "Success",
        description: "Testimonial updated successfully",
      });
      fetchTestimonials();
    } catch (err) {
      console.error('Error updating testimonial:', err);
      toast({
        title: "Error",
        description: "Failed to update testimonial. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteTestimonial = async () => {
    if (!currentTestimonial) return;
    
    try {
      await contentService.deleteTestimonial(currentTestimonial.id);
      setIsDeleteDialogOpen(false);
      setCurrentTestimonial(null);
      toast({
        title: "Success",
        description: "Testimonial deleted successfully",
      });
      fetchTestimonials();
    } catch (err) {
      console.error('Error deleting testimonial:', err);
      toast({
        title: "Error",
        description: "Failed to delete testimonial. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleApproveTestimonial = async (id: string) => {
    try {
      await contentService.approveTestimonial(id);
      toast({
        title: "Success",
        description: "Testimonial approved successfully",
      });
      fetchTestimonials();
    } catch (err) {
      console.error('Error approving testimonial:', err);
      toast({
        title: "Error",
        description: "Failed to approve testimonial. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleRejectTestimonial = async (id: string) => {
    try {
      await contentService.rejectTestimonial(id);
      toast({
        title: "Success",
        description: "Testimonial rejected successfully",
      });
      fetchTestimonials();
    } catch (err) {
      console.error('Error rejecting testimonial:', err);
      toast({
        title: "Error",
        description: "Failed to reject testimonial. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'rejected':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Testimonial Management</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={fetchTestimonials} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Testimonial
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Testimonial</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={newTestimonial.name}
                      onChange={(e) => setNewTestimonial({...newTestimonial, name: e.target.value})}
                      placeholder="Customer name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      value={newTestimonial.role}
                      onChange={(e) => setNewTestimonial({...newTestimonial, role: e.target.value})}
                      placeholder="Customer role"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="quote">Testimonial</Label>
                  <Textarea
                    id="quote"
                    value={newTestimonial.quote}
                    onChange={(e) => setNewTestimonial({...newTestimonial, quote: e.target.value})}
                    placeholder="Customer testimonial"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="rating">Rating</Label>
                    <Select 
                      value={newTestimonial.rating.toString()} 
                      onValueChange={(value) => setNewTestimonial({...newTestimonial, rating: parseInt(value)})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Star</SelectItem>
                        <SelectItem value="2">2 Stars</SelectItem>
                        <SelectItem value="3">3 Stars</SelectItem>
                        <SelectItem value="4">4 Stars</SelectItem>
                        <SelectItem value="5">5 Stars</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="source">Source</Label>
                    <Select 
                      value={newTestimonial.source} 
                      onValueChange={(value) => setNewTestimonial({...newTestimonial, source: value as 'website' | 'google' | 'facebook'})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="website">Website</SelectItem>
                        <SelectItem value="google">Google</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    value={newTestimonial.image}
                    onChange={(e) => setNewTestimonial({...newTestimonial, image: e.target.value})}
                    placeholder="Image URL"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddTestimonial}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Reviews</p>
              <h3 className="text-2xl font-bold">{stats.total}</h3>
            </div>
            <MessageSquare className="h-8 w-8 text-primary" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Approved</p>
              <h3 className="text-2xl font-bold">{stats.approved}</h3>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <h3 className="text-2xl font-bold">{stats.pending}</h3>
            </div>
            <MessageSquare className="h-8 w-8 text-orange-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Average Rating</p>
              <h3 className="text-2xl font-bold">{stats.averageRating}</h3>
            </div>
            <Star className="h-8 w-8 text-yellow-400 fill-current" />
          </div>
        </Card>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search testimonials..."
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

      {/* Testimonials Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-primary mr-2" />
          <p>Loading testimonials...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center py-12 text-red-500">
          <AlertCircle className="h-8 w-8 mr-2" />
          <p>{error}</p>
        </div>
      ) : filteredTestimonials.length === 0 ? (
        <div className="flex justify-center items-center py-12 text-gray-500">
          <p>No testimonials found. {searchTerm ? 'Try a different search term.' : 'Add your first testimonial.'}</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredTestimonials.map((testimonial) => (
            <Card key={testimonial.id} className="p-6">
              <div className="flex gap-6">
                <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.unsplash.com/photo-1511367461989-f85a21fda167";
                    }}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-xl font-semibold">{testimonial.name}</h3>
                        <Badge variant={getStatusBadgeVariant(testimonial.status)}>
                          {testimonial.status}
                        </Badge>
                        <Badge variant="outline">{testimonial.source}</Badge>
                      </div>
                      <p className="text-gray-600 italic">"{testimonial.quote}"</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {testimonial.role}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(testimonial.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    {testimonial.status === 'pending' && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-green-500"
                          onClick={() => handleApproveTestimonial(testimonial.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-500"
                          onClick={() => handleRejectTestimonial(testimonial.id)}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </>
                    )}
                    
                    <Dialog open={isEditDialogOpen && currentTestimonial?.id === testimonial.id} onOpenChange={(open) => {
                      setIsEditDialogOpen(open);
                      if (!open) setCurrentTestimonial(null);
                    }}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setCurrentTestimonial(testimonial)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Edit Testimonial</DialogTitle>
                        </DialogHeader>
                        {currentTestimonial && (
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <Label htmlFor="edit-name">Name</Label>
                                <Input
                                  id="edit-name"
                                  value={currentTestimonial.name}
                                  onChange={(e) => setCurrentTestimonial({...currentTestimonial, name: e.target.value})}
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="edit-role">Role</Label>
                                <Input
                                  id="edit-role"
                                  value={currentTestimonial.role}
                                  onChange={(e) => setCurrentTestimonial({...currentTestimonial, role: e.target.value})}
                                />
                              </div>
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="edit-quote">Testimonial</Label>
                              <Textarea
                                id="edit-quote"
                                value={currentTestimonial.quote}
                                onChange={(e) => setCurrentTestimonial({...currentTestimonial, quote: e.target.value})}
                                rows={3}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <Label htmlFor="edit-rating">Rating</Label>
                                <Select 
                                  value={currentTestimonial.rating.toString()} 
                                  onValueChange={(value) => setCurrentTestimonial({...currentTestimonial, rating: parseInt(value)})}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select rating" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="1">1 Star</SelectItem>
                                    <SelectItem value="2">2 Stars</SelectItem>
                                    <SelectItem value="3">3 Stars</SelectItem>
                                    <SelectItem value="4">4 Stars</SelectItem>
                                    <SelectItem value="5">5 Stars</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="edit-source">Source</Label>
                                <Select 
                                  value={currentTestimonial.source} 
                                  onValueChange={(value) => setCurrentTestimonial({...currentTestimonial, source: value as 'website' | 'google' | 'facebook'})}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select source" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="website">Website</SelectItem>
                                    <SelectItem value="google">Google</SelectItem>
                                    <SelectItem value="facebook">Facebook</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="edit-image">Image URL</Label>
                              <Input
                                id="edit-image"
                                value={currentTestimonial.image}
                                onChange={(e) => setCurrentTestimonial({...currentTestimonial, image: e.target.value})}
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="edit-status">Status</Label>
                              <Select 
                                value={currentTestimonial.status} 
                                onValueChange={(value) => setCurrentTestimonial({...currentTestimonial, status: value as 'approved' | 'pending' | 'rejected'})}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="approved">Approved</SelectItem>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        )}
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                          <Button onClick={handleEditTestimonial}>Save Changes</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    
                    <Dialog open={isDeleteDialogOpen && currentTestimonial?.id === testimonial.id} onOpenChange={(open) => {
                      setIsDeleteDialogOpen(open);
                      if (!open) setCurrentTestimonial(null);
                    }}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-500 hover:text-red-600"
                          onClick={() => setCurrentTestimonial(testimonial)}
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
                          <p>Are you sure you want to delete this testimonial?</p>
                          <p className="font-semibold mt-2">From: "{currentTestimonial?.name}"</p>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                          <Button variant="destructive" onClick={handleDeleteTestimonial}>Delete</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
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