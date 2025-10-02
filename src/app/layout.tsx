import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
  fallback: ['system-ui', 'arial'],
});

export const metadata = {
  title: "Auto Body Repair & Spray Painting Harare | Color Tech Zimbabwe",
  description:
    "Color Tech offers expert auto body repair, spray painting, rust protection, and dent removal services in Harare, Zimbabwe. 100% quality guaranteed.",
  keywords:
    "auto body repair Harare, spray painting Harare, panel beating Harare, dent removal Harare, car paint Harare, rust protection Harare",
  authors: [{ name: "Color Tech" }],
  creator: "Color Tech",
  publisher: "Color Tech",
  robots: "index, follow",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Auto Body Repair, Panel Beating & Spray Painting Harare | Color Tech Zimbabwe",
    description:
      "Color Tech offers expert auto body repair, panel beating, spray painting, rust protection, and dent removal services in Harare, Zimbabwe. 100% quality guaranteed.",
    url: "https://color-tech.vercel.app",
    siteName: "Color Tech",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Auto Body Repair & Spray Painting Harare | Color Tech Zimbabwe",
    description:
      "Color Tech offers expert auto body repair, panel beating, wheel alignment, spray painting, rust protection, and dent removal services in Harare, Zimbabwe. 100% quality guaranteed.",
  },
  verification: {
    google: "your-google-verification-code", // Replace with actual verification code
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-gradient-to-br from-slate-100 via-white to-slate-200 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900`}
      >
        <Script id="app-image-config" strategy="beforeInteractive">
          {`
            (function(){
              try {
                // These can be set server-side later; for now, pull from localStorage if present
                window.__APP_LOGO_URL__ = localStorage.getItem('appearance.logoUrl') || '';
                window.__APP_HERO_URL__ = localStorage.getItem('appearance.heroImageUrl') || '';
                window.__APP_FALLBACK_URL__ = localStorage.getItem('appearance.fallbackImageUrl') || '';
                var list = (localStorage.getItem('appearance.carouselImageUrls') || '').split(',').map(function(s){return s.trim();}).filter(Boolean);
                window.__APP_CAROUSEL_URLS__ = list;
              } catch (e) {}
            })();
          `}
        </Script>

        <LayoutWrapper>{children}</LayoutWrapper>
        <Analytics />

        {/* Chat Bot Script */}
        <Script
          src="https://cdn.jotfor.ms/agent/embedjs/019875f8b9967eac80c030506c583afa433a/embed.js?skipWelcome=1&maximizable=1"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
