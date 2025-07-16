"use client";

import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  getAllBookings,
  createBooking,
  updateBooking,
  deleteBooking,
  Booking,
  CreateBookingData,
  UpdateBookingData,
} from "@/services/bookingService";
import { getAllUsers } from "@/services/userService";
import { getAllServices } from "@/services/serviceService";
import type { User } from "@/services/userService";
import type { Service } from "@/services/serviceService";

export default function BookingManagement() {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
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
      setError("Failed to load data. Please try again.");
      toast({
        title: "Error",
        description: "Failed to load data.",
        variant: "destructive",
      });
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
    if (!confirm("Are you sure you want to delete this booking?")) return;
    try {
      await deleteBooking(id);
      toast({ title: "Success", description: "Booking deleted successfully." });
      fetchInitialData(); // Refresh data
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete booking.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async (
    formData: CreateBookingData | UpdateBookingData
  ) => {
    try {
      if (editingBooking) {
        await updateBooking(editingBooking.id, formData as UpdateBookingData);
        toast({
          title: "Success",
          description: "Booking updated successfully.",
        });
      } else {
        await createBooking(formData as CreateBookingData);
        toast({
          title: "Success",
          description: "Booking created successfully.",
        });
      }
      setIsModalOpen(false);
      fetchInitialData(); // Refresh data
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save booking.",
        variant: "destructive",
      });
    }
  };

  const filteredBookings = useMemo(
    () =>
      bookings.filter(
        (b) =>
          b.customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.service?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.status.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [bookings, searchTerm]
  );

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "confirmed":
        return "default";
      case "pending":
        return "secondary";
      case "completed":
        return "outline";
      case "cancelled":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
          Booking Management
        </h1>
        <Button
          onClick={handleAddClick}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Booking
        </Button>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-xl p-4 rounded-2xl border border-slate-700/50">
        <Input
          placeholder="Search by customer, service, or status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-slate-900/50 border-slate-600 text-white placeholder-slate-400 focus:border-indigo-500"
        />
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">
          <AlertCircle className="h-12 w-12 mx-auto mb-4" />
          <p>{error}</p>
          <Button variant="outline" onClick={fetchInitialData} className="mt-4">
            Try Again
          </Button>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <Calendar className="h-16 w-16 mx-auto mb-4 text-slate-600" />
          <p className="text-lg">No bookings found.</p>
          <p className="text-sm text-slate-500 mt-2">
            Try adjusting your search or create a new booking.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredBookings.map((booking) => (
            <Card
              key={booking.id}
              className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 p-6 hover:bg-slate-800/70 transition-all duration-200"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-white">
                      {booking.customer?.name || "Unknown Customer"}
                    </h3>
                    <Badge
                      variant={getStatusBadgeVariant(booking.status)}
                      className={`${
                        booking.status === "completed"
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : booking.status === "confirmed"
                            ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                            : booking.status === "pending"
                              ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                              : "bg-red-500/20 text-red-400 border-red-500/30"
                      }`}
                    >
                      {booking.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-300 mb-1">
                    {booking.service?.name || "Unknown Service"}
                  </p>
                  <p className="text-sm font-medium text-slate-200 mb-2">
                    {new Date(booking.scheduledAt).toLocaleString()}
                  </p>
                  {booking.notes && (
                    <p className="text-sm text-slate-400 bg-slate-900/30 p-2 rounded-lg">
                      <span className="font-medium text-slate-300">Notes:</span>{" "}
                      {booking.notes}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditClick(booking)}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(booking.id)}
                    className="bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
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

function BookingForm({
  isOpen,
  onClose,
  onSave,
  booking,
  users,
  services,
}: BookingFormProps) {
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (booking) {
      setFormData({
        customerId: booking.customerId,
        serviceId: booking.serviceId,
        scheduledAt: new Date(booking.scheduledAt)
          .toISOString()
          .substring(0, 16),
        status: booking.status,
        notes: booking.notes || "",
      });
    } else {
      setFormData({
        customerId: "",
        serviceId: "",
        scheduledAt: new Date().toISOString().substring(0, 16),
        status: "pending",
        notes: "",
      });
    }
  }, [booking, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
      <DialogContent className="bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            {booking ? "Edit Booking" : "Create Booking"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="customerId" className="text-slate-200">
              Customer
            </Label>
            <Select
              name="customerId"
              value={formData.customerId}
              onValueChange={(value) => handleSelectChange("customerId", value)}
              required
            >
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                <SelectValue placeholder="Select a customer" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                {users.map((user) => (
                  <SelectItem
                    key={user.id}
                    value={user.id}
                    className="text-white hover:bg-slate-700"
                  >
                    {user.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="serviceId" className="text-slate-200">
              Service
            </Label>
            <Select
              name="serviceId"
              value={formData.serviceId}
              onValueChange={(value) => handleSelectChange("serviceId", value)}
              required
            >
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                {services.map((service) => (
                  <SelectItem
                    key={service.id}
                    value={service.id}
                    className="text-white hover:bg-slate-700"
                  >
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="scheduledAt" className="text-slate-200">
              Scheduled At
            </Label>
            <Input
              id="scheduledAt"
              name="scheduledAt"
              type="datetime-local"
              value={formData.scheduledAt}
              onChange={handleChange}
              required
              className="bg-slate-800 border-slate-600 text-white"
            />
          </div>
          <div>
            <Label htmlFor="status" className="text-slate-200">
              Status
            </Label>
            <Select
              name="status"
              value={formData.status}
              onValueChange={(value) => handleSelectChange("status", value)}
              required
            >
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem
                  value="pending"
                  className="text-white hover:bg-slate-700"
                >
                  Pending
                </SelectItem>
                <SelectItem
                  value="confirmed"
                  className="text-white hover:bg-slate-700"
                >
                  Confirmed
                </SelectItem>
                <SelectItem
                  value="completed"
                  className="text-white hover:bg-slate-700"
                >
                  Completed
                </SelectItem>
                <SelectItem
                  value="cancelled"
                  className="text-white hover:bg-slate-700"
                >
                  Cancelled
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="notes" className="text-slate-200">
              Notes
            </Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="bg-slate-800 border-slate-600 text-white placeholder-slate-400"
              placeholder="Add any special notes or instructions..."
            />
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
            >
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
