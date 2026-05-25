import { supabaseServer } from "@/common/libs/supabase-server";

export interface ArticleItem {
  id: number;
  title: string;
  slug: string;
  content: string;
  imageUrl: string;
  tags: string;
  published: boolean;
  showOnHome: boolean;
  createdAt: string;
  updatedAt: string;
  excerpt: string;
  category: string;
}

const fetchRows = async (table: string, orderColumn: string) => {
  const { data, error } = await supabaseServer
    .from(table)
    .select("*")
    .order(orderColumn, { ascending: false });

  if (error || !data) return [];
  return data;
};

const mapArticleRow = (item: any): ArticleItem => {
  const isPublished =
    item.published !== undefined
      ? Boolean(item.published)
      : item.showOnHome !== undefined
        ? Boolean(item.showOnHome)
        : true;

  return {
    id: item.id,
    title: item.title || "",
    slug: item.slug || "",
    content: item.content || "",
    imageUrl: item.imageUrl || item.cover_image || item.coverImage || "",
    tags: item.tags || "",
    published: isPublished,
    showOnHome:
      item.showOnHome !== undefined ? Boolean(item.showOnHome) : isPublished,
    createdAt:
      item.createdAt || item.created_at || item.created_at || new Date().toISOString(),
    updatedAt:
      item.updatedAt || item.updated_at || item.updated_at || new Date().toISOString(),
    excerpt: item.excerpt || "",
    category: item.category || "General",
  };
};

export const getArticlesData = async (): Promise<ArticleItem[]> => {
  try {
    const blogRows = await fetchRows("blogs", "created_at");
    const legacyRows = await fetchRows("Article", "createdAt");
    const lowercaseLegacyRows = await fetchRows("article", "created_at");

    const merged = [...blogRows, ...legacyRows, ...lowercaseLegacyRows];
    const articles = merged.map(mapArticleRow);

    const bySlug = new Map<string, ArticleItem>();
    for (const article of articles) {
      const key = article.slug || `article-${article.id}`;
      if (!bySlug.has(key)) {
        bySlug.set(key, article);
      }
    }

    return Array.from(bySlug.values()).sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  } catch (error) {
    console.error("Error in getArticlesData:", error);
    return [];
  }
};

export const getArticleBySlug = async (slug: string): Promise<ArticleItem | null> => {
  try {
    const tables = [
      { name: "blogs", orderColumn: "created_at" },
      { name: "Article", orderColumn: "createdAt" },
      { name: "article", orderColumn: "created_at" },
    ];

    for (const table of tables) {
      const { data, error } = await supabaseServer
        .from(table.name)
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (!error && data) {
        return mapArticleRow(data);
      }
    }

    return null;
  } catch (error) {
    console.error("Error in getArticleBySlug:", error);
    return null;
  }
};
