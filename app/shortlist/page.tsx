import type { Metadata } from "next";
import ShortlistClient from "./ShortlistClient";

export const metadata: Metadata = {
  title:       "My Shortlist — Saved baby names | Namaah",
  description: "View, compare, and share your saved Hindu baby names. Test each name with your surname.",
};

export default function ShortlistPage() {
  return <ShortlistClient />;
}
