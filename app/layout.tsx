import "./globals.css";
import { ReactNode } from "react";
import { cookies } from "next/headers";
import { Metadata, Viewport } from "next";
import Providers from "./providers";
import Header from "@/components/Header";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://elise-reads.netlify.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Elise Reads | Book Tracking & Reading Adventures",
    template: "%s | Elise Reads",
  },
  description:
    "Track your reading journey, discover new books, share reviews, and showcase your art. A cozy space for book lovers to collect and celebrate their reading adventures.",
  keywords: [
    "book tracking",
    "reading tracker",
    "book reviews",
    "reading journal",
    "book collection",
    "reading list",
    "bookshelf",
    "reading goals",
    "book art",
    "reading community",
  ],
  authors: [{ name: "Elise Reads" }],
  creator: "Elise Reads",
  publisher: "Elise Reads",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Elise Reads",
    title: "Elise Reads | Book Tracking & Reading Adventures",
    description:
      "Track your reading journey, discover new books, share reviews, and showcase your art. A cozy space for book lovers.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Elise Reads - Your Reading Adventure Awaits",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Elise Reads | Book Tracking & Reading Adventures",
    description:
      "Track your reading journey, discover new books, share reviews, and showcase your art.",
    images: ["/og-image.png"],
    creator: "@elisereads",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: siteUrl,
  },
  category: "books",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("elise_session")?.value ?? null;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen bg-white text-gray-900 dark:bg-black dark:text-white">
        <Providers initialToken={token}>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
