import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Signed-in areas and endpoints have nothing for search results
      disallow: ["/dashboard/", "/api/", "/auth/", "/profile", "/onboarding"],
    },
    sitemap: "https://www.testado.in/sitemap.xml",
  };
}
