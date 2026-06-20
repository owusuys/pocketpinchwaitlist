import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const title = "PocketPinch — Know before you buy.";
const description =
  "PocketPinch checks your real bank balance and upcoming bills, then gives you a 0–100 score on whether you can actually afford that purchase — right now, in the moment. Join the iOS waitlist.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  applicationName: "PocketPinch",
  keywords: [
    "PocketPinch",
    "affordability",
    "can I afford this",
    "purchase score",
    "personal finance",
    "iOS app",
    "budgeting alternative",
  ],
  authors: [{ name: "Entafo Studios" }],
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "PocketPinch",
    title,
    description,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "PocketPinch — Know before you buy." }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/opengraph-image"],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#0E0F12",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
