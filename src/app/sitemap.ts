import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = [
    { url: "/", priority: 1 },
    { url: "/methode", priority: 0.9 },
    { url: "/resultats", priority: 0.8 },
    { url: "/contact", priority: 0.9 },
    { url: "/mentions-legales", priority: 0.3 },
    { url: "/confidentialite", priority: 0.3 },
  ];
  return routes.map((r) => ({
    url: `${siteConfig.url}${r.url}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: r.priority,
  }));
}
