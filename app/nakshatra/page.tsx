import type { Metadata } from "next";
import NakshatraClient from "./NakshatraClient";

export const metadata: Metadata = {
  title:       "Find Hindu baby names by Nakshatra — Birth star name finder | Namaah",
  description: "Enter your baby's date and time of birth to find their Nakshatra (birth star) and discover auspicious Hindu baby names based on Vedic astrology.",
  keywords:    "nakshatra baby names, birth star names, Hindu baby names by nakshatra, vedic astrology names, naamkaran",
  openGraph: {
    title:       "Find baby names by Nakshatra | Namaah",
    description: "Discover auspicious Hindu baby names based on your baby's birth star (Nakshatra).",
    type:        "website",
  },
};

export default function NakshatraPage() {
  return <NakshatraClient />;
}
