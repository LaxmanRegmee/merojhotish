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
    default: "MeroJyotish | Online Kundali, Birth Chart & Jyotish Astrology",
    template: "%s | MeroJyotish",
  },
  description:
    "Generate your kundali online, view birth chart details, explore jyotish astrology, and check Panchang insights in Nepali and English.",
  keywords: [
    "kundali",
    "birth chart",
    "jyotish",
    "astrology",
    "panchang",
    "horoscope",
    "kundali matching",
    "online kundali",
    "astrology in Nepal",
    "Nepali astrology",
  ],
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      ne: "/",
    },
  },
  openGraph: {
    title: "MeroJyotish | Online Kundali, Birth Chart & Jyotish Astrology",
    description:
      "Generate your kundali, view planetary positions, and explore jyotish astrology insights in Nepali and English.",
    url: "https://merojyotish.vercel.app",
    siteName: "MeroJyotish",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MeroJyotish | Online Kundali, Birth Chart & Jyotish Astrology",
    description:
      "Generate your kundali online, view birth chart details, and explore jyotish insights in Nepali and English.",
  },
  verification: {
    google: "3c8-AeBBX4hmdH4tndYUPKQGjdWXGZvwfyq1pV7j2UA",
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
