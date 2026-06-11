import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: "https://hosts.christusveritas.tech/sitemap.xml",
    host: "https://hosts.christusveritas.tech",
  };
}
