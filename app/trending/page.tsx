import type { Metadata } from "next";
import TrendingClient from "./TrendingClient";

export const metadata: Metadata = {
  title:       "Trending Hindu baby names 2026 — Most popular names in India | Namaah",
  description: "Discover the most popular and trending Hindu baby names in India for 2026. See what's hot, what's classic, and what's a rare gem this year.",
  keywords:    "trending Hindu baby names 2026, popular baby names India, Sanskrit baby names 2026, top baby names India",
  openGraph: {
    title:       "Trending Hindu Baby Names 2026 | Namaah",
    description: "See what's trending, classic, and rare in Indian baby names for 2026.",
    type:        "website",
  },
};

export default function TrendingPage() {
  return <TrendingClient />;
}
