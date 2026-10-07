import type { Metadata } from "next";
import { Noto_Sans_Devanagari, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari", "latin"],
  variable: "--font-noto-sans-devanagari",
});

export const runtime = "nodejs";

export const metadata: Metadata = {
  metadataBase: new URL("https://merojyotish.vercel.app"),
  title: {
    default: "MeroJyotish | Birth Chart & Astrology",
    template: "%s | MeroJyotish",
  },
  description:
    "Generate a birth chart, view planetary positions, and explore astrology insights in Nepali and English.",
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      ne: "/",
    },
  },
  openGraph: {
    title: "MeroJyotish | Birth Chart & Astrology",
    description:
      "A Kundali and astrology insight app for Nepali and English users.",
    url: "https://merojyotish.vercel.app",
    siteName: "MeroJyotish",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MeroJyotish",
    description: "Birth chart and astrology insights.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        notoSansDevanagari.variable,
        jetbrainsMono.variable,
      )}
    >
      <body className="min-h-full flex flex-col font-mono">{children}</body>
    </html>
  );
}
