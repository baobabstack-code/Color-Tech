"use client";

import { usePathname } from "next/navigation";
import { AuthProvider } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin") || false;

  return (
    <AuthProvider>
      {!isAdminRoute && <Navigation />}
      {children}
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <WhatsAppButton phoneNumber="+263781253902" />}
    </AuthProvider>
  );
}
