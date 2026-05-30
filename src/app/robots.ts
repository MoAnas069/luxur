import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://luxurafurniture.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/private-access", "/private-catalogue"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
