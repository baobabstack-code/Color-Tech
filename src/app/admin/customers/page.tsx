"use client";

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, Search, Mail, Phone, 
  Calendar, Star, MessageSquare, 
  MoreHorizontal, Loader2, UserPlus,
  Trash2, Edit, Eye
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getAllUsers, deleteUser } from "@/services/userService";
import { getBookingsByUserId } from "@/services/bookingService";
import { getReviewsByUserId } from "@/services/reviewService";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
  status: 'active' | 'inactive';
}

interface Booking {
  id: string;
  serviceName: string;
  scheduledDate: string;
  scheduledTime: string;
  status: string;
}

interface Review {
  id: string;
  serviceName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function CustomerManagement() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await getAllUsers();
      // Filter to only show clients
      const clients = data.filter(user => user.role === 'client');
      setUsers(clients);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load customers. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewUserDetails = async (user: User) => {
    setSelectedUser(user);
    setIsLoadingDetails(true);
    
    try {
      // Fetch user's bookings and reviews in parallel
      const [bookings, reviews] = await Promise.all([
        getBookingsByUserId(user.id),
        getReviewsByUserId(user.id)
      ]);
      
      setUserBookings(bookings);
      setUserReviews(reviews);
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast({
        title: "Error",
        description: "Failed to load customer details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      await deleteUser(userToDelete);
      setUsers(users.filter(user => user.id !== userToDelete));
      if (selectedUser?.id === userToDelete) {
        setSelectedUser(null);
      }
      setShowDeleteConfirm(false);
      setUserToDelete(null);
      
      toast({
        title: "Success",
        description: "Customer deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete customer. Please try again.",
        variant: "destructive",
      });
    }
  };

  const confirmDelete = (userId: string) => {
    setUserToDelete(userId);
    setShowDeleteConfirm(true);
  };

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.firstName.toLowerCase().includes(searchLower) ||
      user.lastName.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.phone.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="p-8 bg-gray-50 max-h-screen overflow-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
          <Button className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Add Customer
          </Button>
        </div>
        
        <div className="flex mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search customers..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer List */}
          <Card className="col-span-1 p-4 overflow-hidden">
            <h2 className="text-xl font-semibold mb-4">Customers</h2>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredUsers.length > 0 ? (
              <div className="space-y-2 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
                {filteredUsers.map((user) => (
                  <div 
                    key={user.id} 
                    className={`p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors ${selectedUser?.id === user.id ? 'bg-gray-50 border-primary' : ''}`}
                    onClick={() => handleViewUserDetails(user)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{user.firstName} {user.lastName}</h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                        {user.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {user.phone || 'N/A'}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No customers found
              </div>
            )}
          </Card>

          {/* Customer Details */}
          <Card className="col-span-2 p-6">
            {selectedUser ? (
              isLoadingDetails ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-semibold">{selectedUser.firstName} {selectedUser.lastName}</h2>
                      <p className="text-gray-500">{selectedUser.email}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="flex items-center gap-1"
                        onClick={() => confirmDelete(selectedUser.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <Phone className="h-4 w-4" />
                        Phone
                      </div>
                      <p>{selectedUser.phone || 'Not provided'}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <Calendar className="h-4 w-4" />
                        Customer Since
                      </div>
                      <p>{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <Tabs defaultValue="bookings" className="w-full">
                    <TabsList className="mb-4">
                      <TabsTrigger value="bookings">Booking History</TabsTrigger>
                      <TabsTrigger value="reviews">Reviews</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="bookings">
                      {userBookings.length > 0 ? (
                        <div className="space-y-3">
                          {userBookings.map(booking => (
                            <div key={booking.id} className="p-3 border rounded-lg">
                              <div className="flex justify-between">
                                <h3 className="font-medium">{booking.serviceName}</h3>
                                <Badge variant={getStatusVariant(booking.status)}>
                                  {booking.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">
                                {new Date(booking.scheduledDate).toLocaleDateString()} at {booking.scheduledTime}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-4">No booking history found</p>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="reviews">
                      {userReviews.length > 0 ? (
                        <div className="space-y-3">
                          {userReviews.map(review => (
                            <div key={review.id} className="p-3 border rounded-lg">
                              <div className="flex justify-between">
                                <h3 className="font-medium">{review.serviceName}</h3>
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-sm mt-2">{review.comment}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-4">No reviews found</p>
                      )}
                    </TabsContent>
                  </Tabs>
                </>
              )
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <Users className="h-12 w-12 mb-4 text-gray-300" />
                <p>Select a customer to view details</p>
              </div>
            )}
          </Card>
        </div>

        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
              <p className="mb-6">Are you sure you want to delete this customer? This action cannot be undone.</p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
                <Button variant="destructive" onClick={handleDeleteUser}>Delete</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to determine badge variant based on status
const getStatusVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed': return 'outline';
    case 'confirmed': return 'default';
    case 'pending': return 'secondary';
    case 'cancelled': return 'destructive';
    default: return 'default';
  }
};