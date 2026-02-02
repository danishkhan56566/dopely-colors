import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter, Outfit, JetBrains_Mono } from "next/font/google";
import { Toaster } from 'sonner';
import { Analytics } from "@vercel/analytics/react";

import { CommandPalette } from "@/components/CommandPalette";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { ErrorSuppressorScript } from '@/components/ErrorSuppressorScript';
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://dopelycolors.com'),
  alternates: {
    canonical: './',
  },
  title: "Dopely Colors – AI Color Palette Generator for Designers & Developers",
  description: "Dopely Colors is an AI-powered color and design toolkit for designers and developers. Generate color palettes, gradients, Tailwind colors, and complete design systems instantly.",
  keywords: ["Dopely Colors", "dopely", "dopely.top", "colors.dopely.top", "AI color palette generator", "color palettes", "gradient generator", "Tailwind colors", "design system builder", "WCAG contrast checker", "color picker for designers"],
  openGraph: {
    title: "Dopely Colors – AI Color Tools for Designers & Developers",
    description: "Create beautiful color palettes, gradients, Tailwind color systems, and accessible design tokens using AI. Built for modern designers and developers.",
    siteName: "Dopely Colors",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dopely Colors – AI Color Tools for Designers & Developers",
    description: "Create beautiful color palettes, gradients, Tailwind color systems, and accessible design tokens using AI. Built for modern designers and developers.",
  },
  applicationName: "Dopely Colors",
  appleWebApp: {
    title: "Dopely Colors App Icon",
    statusBarStyle: "default",
  },
  verification: {
    google: "YraEoUZQurKF6RDK8P0qEqhcRl6JfVfSVUebXJDdeck",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3047757369024091"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      </head>
      <body
        className={`${inter.variable} ${outfit.variable} ${jetbrainsMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ErrorSuppressorScript />
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "name": "Dopely Colors",
                  "url": "https://dopelycolors.com",
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": {
                      "@type": "EntryPoint",
                      "urlTemplate": "https://dopelycolors.com/explore?q={search_term_string}"
                    },
                    "query-input": "required name=search_term_string"
                  }
                },
                {
                  "@type": "SoftwareApplication",
                  "name": "Dopely Colors",
                  "applicationCategory": "DesignApplication",
                  "operatingSystem": "Web",
                  "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD"
                  },
                  "description": "The world's most intelligent AI color palette generator and design system builder.",
                  "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": "4.8",
                    "ratingCount": "1250"
                  }
                },
                {
                  "@type": "Organization",
                  "name": "Dopely Colors",
                  "url": "https://dopelycolors.com",
                  "logo": "https://dopelycolors.com/icon.png",
                  "sameAs": [
                    "https://twitter.com/dopelycolors",
                    "https://instagram.com/dopelycolors"
                  ]
                }
              ]
            })
          }}
        />
        {children}
        <CommandPalette />
        <Toaster position="top-center" richColors />
        <Toaster position="top-center" richColors />
        <Analytics />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
