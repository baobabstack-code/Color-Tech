"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

export default function JotformAgent() {
  const pathname = usePathname();
  
  // Don't render Jotform agent on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }
  
  return (
    <Script
      src="https://cdn.jotfor.ms/agent/embedjs/019875f8b9967eac80c030506c583afa433a/embed.js?skipWelcome=1&maximizable=1"
      strategy="afterInteractive"
    />
  );
}