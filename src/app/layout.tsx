import { Inter } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

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

        <LayoutWrapper>{children}</LayoutWrapper>
        <Analytics />

        {/* Chat Bot Script */}
        <script
          src="https://cdn.jotfor.ms/agent/embedjs/019547dae6607a93955d06388991a907fb97/embed.js?skipWelcome=1&maximizable=1"
          async
        />
      </body>
    </html>
  );
}
