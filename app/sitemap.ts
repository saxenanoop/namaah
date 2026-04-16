import type { MetadataRoute } from "next";
import { names } from "@/data/names";
import { RASHI_LIST } from "@/data/nakshatra";

const BASE_URL = "https://www.namaah.in";

export default function sitemap(): MetadataRoute.Sitemap {
  // ── Static routes ────────────────────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url:             `${BASE_URL}/`,
      lastModified:    new Date(),
      changeFrequency: "weekly",
      priority:        1.0,
    },
    {
      url:             `${BASE_URL}/search`,
      lastModified:    new Date(),
      changeFrequency: "weekly",
      priority:        0.9,
    },
    {
      url:             `${BASE_URL}/nakshatra`,
      lastModified:    new Date(),
      changeFrequency: "monthly",
      priority:        0.9,
    },
    {
      url:             `${BASE_URL}/trending`,
      lastModified:    new Date(),
      changeFrequency: "weekly",
      priority:        0.8,
    },
    {
      url:             `${BASE_URL}/hindi`,
      lastModified:    new Date(),
      changeFrequency: "monthly",
      priority:        0.8,
    },
    {
      url:             `${BASE_URL}/rashi`,
      lastModified:    new Date(),
      changeFrequency: "monthly",
      priority:        0.7,
    },
    {
      url:             `${BASE_URL}/shortlist`,
      lastModified:    new Date(),
      changeFrequency: "never",
      priority:        0.3,
    },
  ];

  // ── Rashi detail pages (12) ──────────────────────────────────────────────
  const rashiRoutes: MetadataRoute.Sitemap = RASHI_LIST.map((rashi) => ({
    url:             `${BASE_URL}/rashi/${rashi.id}`,
    lastModified:    new Date(),
    changeFrequency: "monthly" as const,
    priority:        0.7,
  }));

  // ── Name detail pages (one per name slug) ────────────────────────────────
  const nameRoutes: MetadataRoute.Sitemap = names.map((name) => ({
    url:             `${BASE_URL}/name/${name.slug}`,
    lastModified:    new Date(),
    changeFrequency: "monthly" as const,
    priority:        0.8,
  }));

  return [...staticRoutes, ...rashiRoutes, ...nameRoutes];
}
