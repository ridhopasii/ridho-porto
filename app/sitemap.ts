import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const domain = process.env.DOMAIN || "https://ridhorobbipasi.my.id";
  const locales = ["en", "id"];
  const routes = [
    "",
    "/about",
    "/projects",
    "/creations",
    "/dashboard",
    "/achievements",
    "/guestbook",
    "/chat",
    "/contact",
    "/uses",
    "/changelog"
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of routes) {
      sitemapEntries.push({
        url: `${domain}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: route === "" ? 1.0 : 0.8,
      });
    }
  }

  return sitemapEntries;
}
