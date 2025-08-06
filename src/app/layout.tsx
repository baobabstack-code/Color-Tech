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

        {/* Chat Bot Button */}
        <div style={{ position: "fixed", bottom: 32, right: 32, zIndex: 9999 }}>
          <a
            style={{
              textTransform: "uppercase",
              fontSize: 14,
              cursor: "pointer",
              padding: "12px 18px",
              fontFamily: "inherit",
              backgroundColor: "#0075E3",
              border: "1px solid #0075E3",
              color: "#FFFFFF",
              borderRadius: 4,
              textDecoration: "none",
              display: "inline-block",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
            href={"javascript:void(\n              window.open(\n                'https://agent.jotform.com/019875f8b9967eac80c030506c583afa433a?embedMode=popup&parentURL='+encodeURIComponent(window.top.location.href),\n                'blank',\n                'scrollbars=yes,toolbar=no,width=700,height=500,top='+(window.outerHeight / 2 - 250)+',left='+(window.outerWidth / 2 - 350)+'',\n              ))"}
          >
            Color Tech: Customer Support Agent
          </a>
        </div>
      </body>
    </html>
  );
}
