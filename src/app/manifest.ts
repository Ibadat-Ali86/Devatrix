import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Devatrix Technologies",
    short_name: "Devatrix",
    description:
      "AI-native software house building custom SaaS platforms, autonomous AI agents, full-stack web & mobile apps, cloud infrastructure, and 6-week engineering internships.",
    start_url: "/",
    display: "standalone",
    background_color: "#061833",
    theme_color: "#061833",
    icons: [
      {
        src: "/devatrix-favicon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
