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
  title: "Merojhotish",
  description: "Astrology and Kundali Application",
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
