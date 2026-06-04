import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ZimDesigns",
    short_name: "ZimDesigns",
    description: "Discover and share redesigns of apps used in Zimbabwe.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFDF7",
    theme_color: "#E8A900",
    orientation: "portrait",
    categories: ["design", "social"],
    icons: [
      { src: "/web-app-manifest-192x192.png", sizes: "192x192", type: "image/png", purpose: "maskable any" },
      { src: "/web-app-manifest-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable any" },
    ],
  };
}
