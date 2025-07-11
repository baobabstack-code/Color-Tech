"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation"; // Import usePathname
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin') || false;

  return (
    <html lang="en">
      <body className={`${inter.className} ${isAdminRoute ? '' : 'pt-26'} bg-gradient-to-br from-slate-100 via-white to-slate-200 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900`}>
        <SessionProvider>
          <AuthProvider>
            {!isAdminRoute && <Navigation />}
            {children}
            {!isAdminRoute && <Footer />}
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
