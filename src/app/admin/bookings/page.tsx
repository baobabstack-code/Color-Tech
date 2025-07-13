"use client";

import { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Plus, Edit, Trash2, AlertCircle, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getAllBookings, createBooking, updateBooking, deleteBooking, Booking, CreateBookingData, UpdateBookingData } from '@/services/bookingService';
import { getAllUsers } from '@/services/userService';
import { getAllServices } from '@/services/serviceService';
import type { User } from '@/services/userService';
import type { Service } from '@/services/serviceService';

export default function BookingManagement() {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  const fetchInitialData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [bookingsData, usersData, servicesData] = await Promise.all([
        getAllBookings(),
        getAllUsers(),
        getAllServices(),
      ]);
      setBookings(bookingsData);
      setUsers(usersData);
      setServices(servicesData);
    } catch (err) {
      setError('Failed to load data. Please try again.');
      toast({ title: 'Error', description: 'Failed to load data.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleAddClick = () => {
    setEditingBooking(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (booking: Booking) => {
    setEditingBooking(booking);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;
    try {
      await deleteBooking(id);
      toast({ title: 'Success', description: 'Booking deleted successfully.' });
      fetchInitialData(); // Refresh data
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete booking.', variant: 'destructive' });
    }
  };

  const handleSave = async (formData: CreateBookingData | UpdateBookingData) => {
    try {
      if (editingBooking) {
        await updateBooking(editingBooking.id, formData as UpdateBookingData);
        toast({ title: 'Success', description: 'Booking updated successfully.' });
      } else {
        await createBooking(formData as CreateBookingData);
        toast({ title: 'Success', description: 'Booking created successfully.' });
      }
      setIsModalOpen(false);
      fetchInitialData(); // Refresh data
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save booking.', variant: 'destructive' });
    }
  };

  const filteredBookings = useMemo(() =>
    bookings.filter(b =>
      b.customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.service?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.status.toLowerCase().includes(searchTerm.toLowerCase())
    ), [bookings, searchTerm]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'confirmed': return 'default';
      case 'pending': return 'secondary';
      case 'completed': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'default';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Booking Management</h1>
        <Button onClick={handleAddClick}><Plus className="h-4 w-4 mr-2" />New Booking</Button>
      </div>
      <div className="mb-6">
        <Input
          placeholder="Search by customer, service, or status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-64"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">
          <AlertCircle className="h-12 w-12 mx-auto mb-4" />
          <p>{error}</p>
          <Button variant="outline" onClick={fetchInitialData} className="mt-4">Try Again</Button>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No bookings found.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredBookings.map((booking) => (
            <Card key={booking.id} className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-xl font-semibold">{booking.customer?.name || 'Unknown Customer'}</h3>
                    <Badge variant={getStatusBadgeVariant(booking.status)}>{booking.status}</Badge>
                  </div>
                  <p className="text-sm text-gray-500">{booking.service?.name || 'Unknown Service'}</p>
                  <p className="text-sm font-medium mt-1">{new Date(booking.scheduledAt).toLocaleString()}</p>
                  {booking.notes && <p className="text-sm text-gray-600 mt-2">Notes: {booking.notes}</p>}
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditClick(booking)}><Edit className="h-4 w-4" /></Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(booking.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      <BookingForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        booking={editingBooking}
        users={users}
        services={services}
      />
    </div>
  );
}

interface BookingFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateBookingData | UpdateBookingData) => void;
  booking: Booking | null;
  users: User[];
  services: Service[];
}

function BookingForm({ isOpen, onClose, onSave, booking, users, services }: BookingFormProps) {
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (booking) {
      setFormData({
        customerId: booking.customerId,
        serviceId: booking.serviceId,
        scheduledAt: new Date(booking.scheduledAt).toISOString().substring(0, 16),
        status: booking.status,
        notes: booking.notes || '',
      });
    } else {
      setFormData({
        customerId: '',
        serviceId: '',
        scheduledAt: new Date().toISOString().substring(0, 16),
        status: 'pending',
        notes: '',
      });
    }
  }, [booking, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{booking ? 'Edit Booking' : 'Create Booking'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="customerId">Customer</Label>
            <Select name="customerId" value={formData.customerId} onValueChange={(value) => handleSelectChange('customerId', value)} required>
              <SelectTrigger><SelectValue placeholder="Select a customer" /></SelectTrigger>
              <SelectContent>
                {users.map(user => <SelectItem key={user.id} value={user.id}>{user.fullName}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="serviceId">Service</Label>
            <Select name="serviceId" value={formData.serviceId} onValueChange={(value) => handleSelectChange('serviceId', value)} required>
              <SelectTrigger><SelectValue placeholder="Select a service" /></SelectTrigger>
              <SelectContent>
                {services.map(service => <SelectItem key={service.id} value={service.id}>{service.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="scheduledAt">Scheduled At</Label>
            <Input id="scheduledAt" name="scheduledAt" type="datetime-local" value={formData.scheduledAt} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select name="status" value={formData.status} onValueChange={(value) => handleSelectChange('status', value)} required>
              <SelectTrigger><SelectValue placeholder="Select a status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
