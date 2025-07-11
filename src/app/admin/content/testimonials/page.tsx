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
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// Extend Testimonial to include display-specific properties
interface EnrichedTestimonial extends Testimonial {
  name: string; // user_first_name + user_last_name
  image: string; // Placeholder for now, as not in Testimonial interface
  role: string; // Placeholder for now
  quote: string; // Maps to comment
  date: string; // Maps to created_at
  source: 'website' | 'google' | 'facebook' | 'unknown'; // Placeholder for now
}

export default function TestimonialManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [testimonials, setTestimonials] = useState<EnrichedTestimonial[]>([]);
  const [filteredTestimonials, setFilteredTestimonials] = useState<EnrichedTestimonial[]>([]);
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
  const [currentTestimonial, setCurrentTestimonial] = useState<EnrichedTestimonial | null>(null);
  const [newTestimonial, setNewTestimonial] = useState<Omit<Testimonial, 'id' | 'created_at' | 'updated_at' | 'user_first_name' | 'user_last_name' | 'service_name'>>({
    user_id: 0, // Change to number
    service_id: 0, // Assuming service_id is number, adjust if string
    booking_id: 0, // Assuming booking_id is number, adjust if string
    rating: 5,
    comment: "",
    status: "pending",
    user_email: "", // Add missing required property
  });
  
  const { toast } = useToast();

  const parseTestimonialData = (testimonial: Testimonial): EnrichedTestimonial => {
    return {
      ...testimonial,
      name: `${testimonial.user_first_name || ''} ${testimonial.user_last_name || ''}`.trim() || 'Anonymous',
      image: "https://images.unsplash.com/photo-1511367461989-f85a21fda167", // Placeholder
      role: "Customer", // Placeholder
      quote: testimonial.comment,
      date: new Date(testimonial.created_at).toISOString().split('T')[0],
      source: "website", // Placeholder
    };
  };

  const fetchTestimonials = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await contentService.getTestimonials();
      const enrichedData = data.map(parseTestimonialData);
      setTestimonials(enrichedData);
      setFilteredTestimonials(enrichedData);
      
      // Calculate stats
      const approved = enrichedData.filter(t => t.status === 'approved').length;
      const pending = enrichedData.filter(t => t.status === 'pending').length;
      const totalRating = enrichedData.reduce((sum, t) => sum + t.rating, 0);
      const averageRating = enrichedData.length > 0 ? +(totalRating / enrichedData.length).toFixed(1) : 0;
      
      setStats({
        total: enrichedData.length,
        approved,
        pending,
        averageRating
      });
    } catch (err: any) {
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
      // Map newTestimonial to Testimonial interface for creation
      const testimonialToCreate = {
        user_id: newTestimonial.user_id,
        service_id: newTestimonial.service_id,
        booking_id: newTestimonial.booking_id,
        rating: newTestimonial.rating,
        comment: newTestimonial.comment, // Map quote to comment
        status: newTestimonial.status,
        // created_at and updated_at will be set by backend
        // user_first_name, user_last_name, service_name are joined fields, not for creation
      };
      await contentService.createTestimonial(testimonialToCreate as Omit<Testimonial, 'id'>); // Cast to Omit<Testimonial, 'id'>
      setIsAddDialogOpen(false);
      setNewTestimonial({
        user_id: 0,
        service_id: 0,
        booking_id: 0,
        rating: 5,
        comment: "",
        status: "pending",
        user_email: "", // Add missing required property
      });
      toast({
        title: "Success",
        description: "Testimonial added successfully",
      });
      fetchTestimonials();
    } catch (err: any) {
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
      // Map currentTestimonial (Enriched) to Partial<Testimonial> for update
      const testimonialToUpdate: Partial<Testimonial> = {
        rating: currentTestimonial.rating,
        comment: currentTestimonial.quote, // Map quote back to comment
        status: currentTestimonial.status,
        // Other fields like user_id, service_id, booking_id are typically not updated via this form
      };
      await contentService.updateTestimonial(currentTestimonial.id.toString(), testimonialToUpdate); // Convert id to string
      setIsEditDialogOpen(false);
      setCurrentTestimonial(null);
      toast({
        title: "Success",
        description: "Testimonial updated successfully",
      });
      fetchTestimonials();
    } catch (err: any) {
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
      await contentService.deleteTestimonial(currentTestimonial.id.toString()); // Convert id to string
      setIsDeleteDialogOpen(false);
      setCurrentTestimonial(null);
      toast({
        title: "Success",
        description: "Testimonial deleted successfully",
      });
      fetchTestimonials();
    } catch (err: any) {
      console.error('Error deleting testimonial:', err);
      toast({
        title: "Error",
        description: "Failed to delete testimonial. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleApproveTestimonial = async (id: number) => { // Change id type to number
    try {
      await contentService.approveTestimonial(id.toString()); // Convert id to string
      toast({
        title: "Success",
        description: "Testimonial approved successfully",
      });
      fetchTestimonials();
    } catch (err: any) {
      console.error('Error approving testimonial:', err);
      toast({
        title: "Error",
        description: "Failed to approve testimonial. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleRejectTestimonial = async (id: number) => { // Change id type to number
    try {
      await contentService.rejectTestimonial(id.toString()); // Convert id to string
      toast({
        title: "Success",
        description: "Testimonial rejected successfully",
      });
      fetchTestimonials();
    } catch (err: any) {
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
                    <Label htmlFor="user_id">User ID</Label>
                    <Input
                      id="user_id"
                      value={newTestimonial.user_id.toString()}
                      onChange={(e) => setNewTestimonial({...newTestimonial, user_id: parseInt(e.target.value) || 0})}
                      placeholder="User ID"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="service_id">Service ID</Label>
                    <Input
                      id="service_id"
                      type="number"
                      value={newTestimonial.service_id}
                      onChange={(e) => setNewTestimonial({...newTestimonial, service_id: parseInt(e.target.value)})}
                      placeholder="Service ID"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="booking_id">Booking ID</Label>
                  <Input
                    id="booking_id"
                    type="number"
                    value={newTestimonial.booking_id}
                    onChange={(e) => setNewTestimonial({...newTestimonial, booking_id: parseInt(e.target.value)})}
                    placeholder="Booking ID"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="comment">Comment</Label>
                  <Textarea
                    id="comment"
                    value={newTestimonial.comment}
                    onChange={(e) => setNewTestimonial({...newTestimonial, comment: e.target.value})}
                    placeholder="Testimonial comment"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="rating">Rating</Label>
                    <Select
                      value={newTestimonial.rating.toString()}
                      onValueChange={(value: string) => setNewTestimonial({...newTestimonial, rating: parseInt(value)})}
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
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={newTestimonial.status}
                      onValueChange={(value: 'approved' | 'pending' | 'rejected') => setNewTestimonial({...newTestimonial, status: value})}
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
                    
                    <Dialog open={isEditDialogOpen && currentTestimonial?.id === testimonial.id} onOpenChange={(open: boolean) => {
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
                                <Label htmlFor="edit-user_id">User ID</Label>
                                <Input
                                  id="edit-user_id"
                                  value={currentTestimonial.user_id.toString()}
                                  onChange={(e) => setCurrentTestimonial({...currentTestimonial, user_id: parseInt(e.target.value) || 0})}
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="edit-service_id">Service ID</Label>
                                <Input
                                  id="edit-service_id"
                                  type="number"
                                  value={currentTestimonial.service_id}
                                  onChange={(e) => setCurrentTestimonial({...currentTestimonial, service_id: parseInt(e.target.value)})}
                                />
                              </div>
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="edit-booking_id">Booking ID</Label>
                              <Input
                                id="edit-booking_id"
                                type="number"
                                value={currentTestimonial.booking_id}
                                onChange={(e) => setCurrentTestimonial({...currentTestimonial, booking_id: parseInt(e.target.value)})}
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="edit-comment">Comment</Label>
                              <Textarea
                                id="edit-comment"
                                value={currentTestimonial.quote} // Map quote to comment
                                onChange={(e) => setCurrentTestimonial({...currentTestimonial, quote: e.target.value})}
                                rows={3}
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="edit-rating">Rating</Label>
                              <Select
                                value={currentTestimonial.rating.toString()}
                                onValueChange={(value: string) => setCurrentTestimonial({...currentTestimonial, rating: parseInt(value)})}
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
                              <Label htmlFor="edit-status">Status</Label>
                              <Select
                                value={currentTestimonial.status}
                                onValueChange={(value: 'approved' | 'pending' | 'rejected') => setCurrentTestimonial({...currentTestimonial, status: value})}
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
                    
                    <Dialog open={isDeleteDialogOpen && currentTestimonial?.id === testimonial.id} onOpenChange={(open: boolean) => {
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