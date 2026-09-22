import type { Metadata } from "next";
import { Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";

export const runtime = "nodejs";

const notoSansDevanagari = Noto_Sans_Devanagari({
  variable: "--font-noto-sans-devanagari",
  subsets: ["devanagari", "latin"],
});

export const metadata: Metadata = {
  title: "Jyotish | नेपाली कुण्डली",
  description: "Generate a sidereal Nepali birth chart.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${notoSansDevanagari.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
