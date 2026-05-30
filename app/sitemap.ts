import { MetadataRoute } from "next";
import { getArticlesData } from "@/services/blog";
import { getProjectsData } from "@/services/projects";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const domain = process.env.DOMAIN || "https://www.ridhorobbipasi.my.id";
  const locales = ["en", "id"];
  
  // Base static routes
  const routes = [
    "",
    "/karir",
    "/pendidikan",
    "/organisasi",
    "/pencapaian",

    "/projects",
    "/social-media",
    "/dashboard",
    "/achievements",
    "/guestbook",
    "/changelog",
    "/blog",
    "/links",
    "/smart-talk",
    "/legal/privacy-policy",
    "/legal/terms-of-service"
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Generate static routes across locales
  for (const locale of locales) {
    for (const route of routes) {
      sitemapEntries.push({
        url: `${domain}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "weekly" : "monthly",
        priority: route === "" ? 1.0 : 0.8,
      });
    }
  }

  try {
    // Dynamic routes: Blog Articles
    const articles = await getArticlesData();
    if (articles && articles.length > 0) {
      for (const article of articles) {
        for (const locale of locales) {
          sitemapEntries.push({
            url: `${domain}/${locale}/blog/${article.slug}`,
            lastModified: article.updatedAt ? new Date(article.updatedAt) : new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
          });
        }
      }
    }

    // Dynamic routes: Projects
    const projects = await getProjectsData();
    if (projects && projects.length > 0) {
      for (const project of projects) {
        for (const locale of locales) {
          sitemapEntries.push({
            url: `${domain}/${locale}/projects/${project.slug}`,
            // In case there is no updated_at, fallback to current time
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
          });
        }
      }
    }
  } catch (error) {
    console.error("Error generating dynamic routes for sitemap:", error);
  }

  return sitemapEntries;
}
