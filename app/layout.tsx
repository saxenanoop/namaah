import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default:  "Namaah — Hindu Baby Names",
    template: "%s | Namaah",
  },
  description:
    "Discover 20,000+ Hindu baby names by meaning, Nakshatra, Rashi, and origin. Find the perfect sacred name for your child.",
  keywords:
    "Hindu baby names, Sanskrit names, nakshatra names, rashi names, Indian baby names, baby name meanings",
  metadataBase: new URL("https://www.namaah.in"),
  openGraph: {
    title:       "Namaah — Hindu Baby Names",
    description: "Discover 20,000+ Hindu baby names by meaning, Nakshatra, Rashi, and origin.",
    type:        "website",
    url:         "https://www.namaah.in",
    siteName:    "Namaah",
    locale:      "en_IN",
    images: [
      {
        url:    "/og-image.png",
        width:  1200,
        height: 630,
        alt:    "Namaah — Sacred Hindu baby names",
      },
    ],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Namaah — Hindu Baby Names",
    description: "Discover 20,000+ Hindu baby names by meaning, Nakshatra, Rashi, and origin.",
    images:      ["/og-image.png"],
  },
  verification: {
    google: "REPLACE_WITH_GOOGLE_SEARCH_CONSOLE_TOKEN",
  },
  robots: {
    index:               true,
    follow:              true,
    googleBot: {
      index:             true,
      follow:            true,
      "max-image-preview": "large",
      "max-snippet":       -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} ${cormorantGaramond.variable} font-body antialiased bg-ivory text-text-dark`}
      >
        {/* Google AdSense — loads after page is interactive to avoid blocking render */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR-ADSENSE-ID"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
