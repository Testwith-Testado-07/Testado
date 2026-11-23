import type { MetadataRoute } from "next";

// testado.in redirects to www, so the www address is the one search engines should index
const SITE = "https://www.testado.in";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/businesses`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE}/testers`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE}/why-testado`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE}/contact`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE}/auth`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE}/privacy`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
