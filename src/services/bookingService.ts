export interface Booking {
  id: string;
  customerId: string;
  serviceId: string;
  scheduledAt: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string;
  createdAt: string;
  updatedAt: string;
  customer?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  service?: {
    id: string;
    name: string;
    price: number;
  };
}

export interface CreateBookingData {
  customerId: string;
  serviceId: string;
  scheduledAt: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string;
}

export interface UpdateBookingData extends Partial<CreateBookingData> {}

export const getAllBookings = async (): Promise<Booking[]> => {
  const response = await fetch("/api/bookings");
  if (!response.ok) {
    throw new Error("Failed to fetch bookings");
  }
  return response.json();
};

export const getBookingById = async (id: string): Promise<Booking | null> => {
  const response = await fetch(`/api/bookings/${id}`);
  if (!response.ok) {
    return null;
  }
  return response.json();
};

export const createBooking = async (
  data: CreateBookingData
): Promise<Booking> => {
  const response = await fetch("/api/bookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create booking");
  }

  return response.json();
};

export const updateBooking = async (
  id: string,
  data: UpdateBookingData
): Promise<Booking | null> => {
  const response = await fetch(`/api/bookings/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update booking");
  }

  return response.json();
};

export const deleteBooking = async (id: string): Promise<boolean> => {
  const response = await fetch(`/api/bookings/${id}`, {
    method: "DELETE",
  });

  return response.ok;
};

export const getMyBookings = async (customerId: string): Promise<Booking[]> => {
  const response = await fetch(`/api/bookings?customerId=${customerId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch my bookings");
  }
  return response.json();
};

export const cancelBooking = async (id: string): Promise<Booking | null> => {
  return updateBooking(id, { status: "cancelled" });
};

export const getBookingHistory = async (
  customerId: string
): Promise<Booking[]> => {
  const response = await fetch(
    `/api/bookings?customerId=${customerId}&status=completed`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch booking history");
  }
  return response.json();
};
