import { Routes, Route } from "react-router-dom";
import ClientLayout from "@/components/ClientLayout";
import ClientDashboard from "@/pages/client/Dashboard";
import Bookings from "@/pages/client/Bookings";
import ServiceHistory from "@/pages/client/History";
import Reviews from "@/pages/client/Reviews";
import Profile from "@/pages/client/Profile";

export default function ClientRoutes() {
  return (
    <ClientLayout>
      <Routes>
        <Route path="dashboard" element={<ClientDashboard />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="history" element={<ServiceHistory />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="profile" element={<Profile />} />
      </Routes>
    </ClientLayout>
  );
} 