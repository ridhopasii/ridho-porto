import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const domain = process.env.DOMAIN || "https://www.ridhorobbipasi.my.id";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_next/", "/static/"],
    },
    sitemap: `${domain}/sitemap.xml`,
  };
}
