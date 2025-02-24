import { Routes, Route } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import AdminDashboard from "@/pages/admin/Dashboard";
import ServiceManagement from "@/pages/admin/ServiceManagement";
import CustomerManagement from "@/pages/admin/CustomerManagement";
import ContentManagement from "@/pages/admin/content/ContentManagement";
import BlogManagement from "@/pages/admin/content/BlogManagement";
import GalleryManagement from "@/pages/admin/content/GalleryManagement";
import TestimonialManagement from "@/pages/admin/content/TestimonialManagement";
import FaqManagement from "@/pages/admin/content/FaqManagement";
import BookingManagement from "@/pages/admin/BookingManagement";
import InventoryManagement from "@/pages/admin/InventoryManagement";
import ReviewManagement from "@/pages/admin/ReviewManagement";

export default function AdminRoutes() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="services" element={<ServiceManagement />} />
        <Route path="customers" element={<CustomerManagement />} />
        
        {/* Content Management Routes */}
        <Route path="content" element={<ContentManagement />} />
        <Route path="content/blog" element={<BlogManagement />} />
        <Route path="content/gallery" element={<GalleryManagement />} />
        <Route path="content/testimonials" element={<TestimonialManagement />} />
        <Route path="content/faqs" element={<FaqManagement />} />
        
        {/* Other Management Routes */}
        <Route path="bookings" element={<BookingManagement />} />
        <Route path="inventory" element={<InventoryManagement />} />
        <Route path="reviews" element={<ReviewManagement />} />
      </Routes>
    </AdminLayout>
  );
} 