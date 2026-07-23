import type { Metadata } from "next";
import { Playfair_Display, Inter, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const devanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-devanagari",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Namaah — Sacred Hindu Baby Names Finder",
    template: "%s | Namaah",
  },
  description:
    "Discover 500+ meaningful Hindu baby names rooted in Sanskrit, mythology, nature, and tradition with meanings, Rashi, Nakshatra, and numerology.",
  keywords:
    "Hindu baby names, Sanskrit names, nakshatra names, rashi names, Indian baby names, baby name meanings, boy names, girl names",
  metadataBase: new URL("https://www.namaah.in"),
  openGraph: {
    title: "Namaah — Sacred Hindu Baby Names Finder",
    description: "Discover 500+ meaningful Hindu baby names rooted in Sanskrit, mythology, nature, and tradition.",
    type: "website",
    url: "https://www.namaah.in",
    siteName: "Namaah",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Namaah — Sacred Hindu Baby Names Finder",
    description: "Discover 500+ meaningful Hindu baby names rooted in Sanskrit, mythology, nature, and tradition.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${playfair.variable} ${inter.variable} ${devanagari.variable} font-body antialiased bg-cream text-charcoal min-h-screen flex flex-col selection:bg-saffron-light selection:text-saffron-deep`}
      >
        {children}
      </body>
    </html>
  );
}

