import type { Metadata } from "next";
import "./globals.css";
import MainLayout from "@/components/MainLayout";
import { AuthProvider } from "@/contexts/AuthContext"; // Import AuthProvider
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Color-Tech Next App",
  description: "Migrated with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <MainLayout>{children}</MainLayout>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
