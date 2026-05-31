import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://luxurafurniture.com";

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date("2026-05-30"),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/collections`,
      lastModified: new Date("2026-05-30"),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/magazines`,
      lastModified: new Date("2026-05-30"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/private-catalogue`,
      lastModified: new Date("2026-05-30"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date("2026-05-30"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date("2026-05-30"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date("2026-05-30"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}