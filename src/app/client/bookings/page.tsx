"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Car, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  getMyBookings,
  cancelBooking,
  Booking,
} from "@/services/bookingService";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const ClientBookings = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual customer ID from auth context
      const customerId = "1"; // Temporary default customer ID
      const data = await getMyBookings(customerId);
      // Sort bookings by date, with upcoming bookings first
      const sortedBookings = data.sort((a, b) => {
        return (
          new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
        );
      });
      setBookings(sortedBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast({
        title: "Error",
        description: "Failed to load your bookings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;

    setIsCancelling(true);
    try {
      await cancelBooking(selectedBooking.id);
      setBookings(
        bookings.map((booking) =>
          booking.id === selectedBooking.id
            ? { ...booking, status: "cancelled" }
            : booking
        )
      );
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Your booking has been cancelled",
      });
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast({
        title: "Error",
        description: "Failed to cancel your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  const openCancelDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    // Handle different time formats
    if (timeString.includes(":")) {
      const [hours, minutes] = timeString.split(":");
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? "PM" : "AM";
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    }
    return timeString;
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "confirmed":
        return "text-green-600";
      case "pending":
        return "text-amber-600";
      case "in_progress":
        return "text-blue-600";
      case "completed":
        return "text-green-600";
      case "cancelled":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">
          My Bookings
        </h1>
        <Button
          onClick={() => router.push("/booking")}
          className="w-full sm:w-auto"
        >
          Book New Service
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <Card key={booking.id} className="p-4 sm:p-6 flex flex-col">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between flex-grow">
                  <div className="flex items-start space-x-3 sm:space-x-4 mb-4 sm:mb-0">
                    <Car className="w-6 h-6 sm:w-8 sm:h-8 text-secondary shrink-0" />
                    <div className="flex-grow">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 mb-1">
                        <h3 className="font-semibold text-lg sm:text-xl">
                          {booking.service?.name || "Service"}
                        </h3>
                        <span
                          className={`text-xs sm:text-sm font-medium px-2 py-0.5 rounded-full ${getStatusBadgeClass(booking.status)}`}
                        >
                          {booking.status.charAt(0).toUpperCase() +
                            booking.status.slice(1).replace("_", " ")}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 shrink-0" />
                          <span>{formatDate(booking.scheduledAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 shrink-0" />
                          <span>
                            {new Date(booking.scheduledAt).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              }
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                    <Button
                      variant="outline"
                      onClick={() => router.push(`/booking/${booking.id}`)}
                      className="w-full"
                    >
                      View Details
                    </Button>
                    {(booking.status === "pending" ||
                      booking.status === "confirmed") && (
                      <Button
                        variant="outline"
                        className="w-full text-red-500 border-red-200 hover:bg-red-50"
                        onClick={() => openCancelDialog(booking)}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 col-span-full">
              <p className="text-gray-500 text-lg mb-4">
                You don't have any bookings yet.
              </p>
              <Button className="mt-4" onClick={() => router.push("/booking")}>
                Book Your First Service
              </Button>
            </div>
          )}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl">
              Cancel Booking
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Are you sure you want to cancel this booking? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isCancelling}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelBooking}
              disabled={isCancelling}
              className="w-full sm:w-auto"
            >
              {isCancelling && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Confirm Cancellation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientBookings;
