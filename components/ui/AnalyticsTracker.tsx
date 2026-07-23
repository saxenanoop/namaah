"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";

interface AnalyticsTrackerProps {
  gaId?: string;
}

export default function AnalyticsTracker({ gaId = "G-NAMAAH-DEMO" }: AnalyticsTrackerProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    // Log pageview locally
    try {
      const views = JSON.parse(localStorage.getItem("namaah-page-views") || "[]");
      views.push({ url, timestamp: new Date().toISOString() });
      // Keep last 50 entries
      localStorage.setItem("namaah-page-views", JSON.stringify(views.slice(-50)));
    } catch {
      // Storage unavailable
    }

    // Google Analytics event dispatch if window.gtag exists
    const win = window as typeof window & { gtag?: (command: string, targetId: string, config?: Record<string, unknown>) => void };
    if (typeof window !== "undefined" && win.gtag) {
      win.gtag("config", gaId, {
        page_path: url,
      });
    }
  }, [pathname, searchParams, gaId]);

  return (
    <>
      {/* Google Analytics Script Placeholder */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}
