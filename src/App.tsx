import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/AuthContext';
import Layout from "@/components/Layout";
import Navigation from "@/components/Navigation";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminLogin from "./pages/admin/Login";
import AdminRoutes from "./routes/AdminRoutes";
import ClientRoutes from "./routes/ClientRoutes";
import Services from "./pages/Services";
import Gallery from "./pages/Gallery";
import Blog from "./pages/Blog";
import About from "./pages/About";
import Contact from "./pages/Contact";
import { ProtectedRoute } from '@/components/ProtectedRoute';

const queryClient = new QueryClient();

// Create a wrapper component to handle conditional layout
function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isClientRoute = location.pathname.startsWith('/client');

  // Only use admin layout for admin routes
  if (isAdminRoute) {
    return (
      <>
        <Navigation />
        {children}
      </>
    );
  }

  // Use full layout (with footer) for public and client routes
  return <Layout>{children}</Layout>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router basename="/Color-Tech/">
          <LayoutWrapper>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/services" element={<Services />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Protected Admin Routes */}
              <Route 
                path="/admin/*" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminRoutes />
                  </ProtectedRoute>
                } 
              />
              
              {/* Protected Client Routes */}
              <Route 
                path="/client/*" 
                element={
                  <ProtectedRoute allowedRoles={['client']}>
                    <ClientRoutes />
                  </ProtectedRoute>
                } 
              />
            </Routes>
            <Toaster />
          </LayoutWrapper>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
