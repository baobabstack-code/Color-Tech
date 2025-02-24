import { Routes, Route } from "react-router-dom";
import ClientDashboard from "@/pages/client/Dashboard";
import Bookings from "@/pages/client/Bookings";
import ServiceHistory from "@/pages/client/History";
import Reviews from "@/pages/client/Reviews";

export default function ClientRoutes() {
  return (
    <Routes>
      <Route path="dashboard" element={<ClientDashboard />} />
      <Route path="bookings" element={<Bookings />} />
      <Route path="history" element={<ServiceHistory />} />
      <Route path="reviews" element={<Reviews />} />
    </Routes>
  );
} 