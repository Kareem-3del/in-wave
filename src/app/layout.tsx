import type { Metadata } from "next";
import "./globals.css";
import { TrackingPixelsHead, TrackingPixelsBody } from "@/components/TrackingPixels";

export const metadata: Metadata = {
  title: "Architecture Studio & Design Architect Services | IN-WAVE ARCHITECTS",
  description: "Order first-class architectural design, interior solutions, and renovation services from architecture studio IN-WAVE ARCHITECTS. Experience precise equipment",
  keywords: ["architecture", "interior design", "architectural design", "renovation", "IN-WAVE Architects"],
  authors: [{ name: "IN-WAVE Architects" }],
  openGraph: {
    title: "Architecture Studio & Design Architect Services | IN-WAVE ARCHITECTS",
    description: "Order first-class architectural design, interior solutions, and renovation services from architecture studio IN-WAVE ARCHITECTS",
    url: "https://in-wave.com/",
    siteName: "IN-WAVE Architects",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Architecture Studio & Design Architect Services | IN-WAVE ARCHITECTS",
    description: "Order first-class architectural design, interior solutions, and renovation services from architecture studio IN-WAVE ARCHITECTS",
  },
  icons: {
    icon: "/images/cropped-apple-icon-76x76-1-32x32.png",
    apple: "/images/cropped-apple-icon-76x76-1-180x180.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        {/* Third-party vendor styles */}
        <link rel="stylesheet" href="/css/swiper.css" />
        <link rel="stylesheet" href="/css/intlTelInput.css" />
        {/* RTL support */}
        <link rel="stylesheet" href="/css/rtl.css" />
        <TrackingPixelsHead />
      </head>
      <body>
        <TrackingPixelsBody />
        {children}
      </body>
    </html>
  );
}
