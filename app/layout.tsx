import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE = "https://markmeston.com";

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Mark Meston",
    template: "%s · Mark Meston",
  },
  description:
    "Personal front gate—a minimal monochrome grid traced in real time—with Orbit carrying the heavier experiments.",
  applicationName: "Mark Meston",
  keywords: ["Mark Meston", "software", "engineering", "portfolio"],
  authors: [{ name: "Mark Meston", url: SITE }],
  robots: {
    index: true,
    follow: true,
  },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE,
    siteName: "Mark Meston",
    title: "Mark Meston",
    description:
      "Personal front gate—a minimal monochrome grid traced in real time—with Orbit carrying the heavier experiments.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mark Meston",
    description:
      "Personal front gate—a minimal monochrome grid traced in real time—with Orbit carrying the heavier experiments.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
