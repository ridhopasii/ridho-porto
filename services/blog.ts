import { createClient } from "@/common/utils/server";

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

export const getArticlesData = async (): Promise<ArticleItem[]> => {
  try {
    const supabase = createClient();
    
    // Attempt upper-casing first
    let { data, error } = await supabase
      .from("Article")
      .select("*")
      .order("createdAt", { ascending: false });

    // Fallback to lowercase article
    if (error || !data) {
      const { data: fallbackData, error: fallbackError } = await supabase
        .from("article")
        .select("*")
        .order("created_at", { ascending: false });

      if (fallbackError || !fallbackData) return [];
      data = fallbackData;
    }

    return (data || []).map((item: any) => {
      const isPublished = item.published !== undefined ? item.published : (item.showOnHome !== undefined ? item.showOnHome : true);
      return {
        id: item.id,
        title: item.title || "",
        slug: item.slug || "",
        content: item.content || "",
        imageUrl: item.imageUrl || item.image_url || "",
        tags: item.tags || "",
        published: isPublished,
        showOnHome: item.showOnHome !== undefined ? item.showOnHome : isPublished,
        createdAt: item.createdAt || item.created_at || new Date().toISOString(),
        updatedAt: item.updatedAt || item.updated_at || new Date().toISOString(),
        excerpt: item.excerpt || "",
        category: item.category || "General",
      };
    });
  } catch (error) {
    console.error("Error in getArticlesData:", error);
    return [];
  }
};

export const getArticleBySlug = async (slug: string): Promise<ArticleItem | null> => {
  try {
    const supabase = createClient();
    
    let { data, error } = await supabase
      .from("Article")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data) {
      const { data: fallbackData, error: fallbackError } = await supabase
        .from("article")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (fallbackError || !fallbackData) return null;
      data = fallbackData;
    }

    const isPublished = data.published !== undefined ? data.published : (data.showOnHome !== undefined ? data.showOnHome : true);
    return {
      id: data.id,
      title: data.title || "",
      slug: data.slug || "",
      content: data.content || "",
      imageUrl: data.imageUrl || data.image_url || "",
      tags: data.tags || "",
      published: isPublished,
      showOnHome: data.showOnHome !== undefined ? data.showOnHome : isPublished,
      createdAt: data.createdAt || data.created_at || new Date().toISOString(),
      updatedAt: data.updatedAt || data.updated_at || new Date().toISOString(),
      excerpt: data.excerpt || "",
      category: data.category || "General",
    };
  } catch (error) {
    console.error("Error in getArticleBySlug:", error);
    return null;
  }
};
