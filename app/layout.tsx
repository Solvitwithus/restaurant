import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Digi-Sales",
  description: "Digi-Sales – Your modern sales management solution",
  manifest: "/manifest.json", // ← This tells Next.js to serve the manifest
  icons: {
    icon: ["/icons/appicon-128x128.png", "/icons/appicon-256x256.png"],
    apple: "/icons/appicon-128x128.png",
  },
  themeColor: "#000000",
  appleWebApp: {
    title: "Digi-Sales",
    statusBarStyle: "black-translucent",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Essential PWA tags */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* iOS Support */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Digi-Sales" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />

        {/* Theme Color (for browser UI) */}
        <meta name="theme-color" content="#000000" />

        {/* Optional: Force standalone mode */}
        <meta name="mobile-web-app-capable" content="yes" />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased 
        bg-[#F6EFE7] min-h-screen overflow-x-hidden`}
      >
        <Toaster />
        {children}
      </body>
    </html>
  );
}