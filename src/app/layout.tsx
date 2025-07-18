import { Inter } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Color Tech - Professional Auto Detailing",
  description:
    "Professional auto detailing services with premium care for your vehicle",
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

        {/* Chat Bot Script */}
        <script
          src="https://cdn.jotfor.ms/agent/embedjs/019547dae6607a93955d06388991a907fb97/embed.js?skipWelcome=1&maximizable=1"
          async
        />
      </body>
    </html>
  );
}
