import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, "");
  const now = new Date();
  const routes = [
    "",
    "/pricing",
    "/dashboard",
    "/review",
    "/github",
    "/analytics",
    "/team",
    "/billing",
    "/settings",
    "/sign-in",
    "/sign-up",
  ];
  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}

export default sitemap;
