import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

function robots(): MetadataRoute.Robots {
  const base = SITE.url.replace(/\/$/, "");
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/settings/", "/billing/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}

export default robots;
