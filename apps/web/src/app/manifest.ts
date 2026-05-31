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
      { src: "/icon.png", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
      { src: "/apple-icon.png", sizes: "192x192", type: "image/png" },
      { src: "/apple-icon.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
