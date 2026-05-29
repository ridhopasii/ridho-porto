import { queryRowsFallback } from "@/common/libs/table-query";
import { supabaseServer } from "@/common/libs/supabase-server";
import { createPublicClient } from "@/common/utils/serverPublic";
import { PublicationItem } from "@/common/types/publication";

const parseImages = (images: any): string[] => {
  if (Array.isArray(images)) return images.filter(Boolean);
  if (typeof images === "string") {
    if (images.trim().startsWith("[")) {
      try {
        const parsed = JSON.parse(images);
        if (Array.isArray(parsed)) return parsed.filter(Boolean);
      } catch {}
    }
    return images.trim() ? [images] : [];
  }
  return [];
};

export const getAchievementsData = async (params?: { category?: string; search?: string }) => {
  const supabase = createPublicClient();
  let query = supabase.from("Award").select("*");

  if (params?.category) {
    query = query.eq("category", params.category);
  }
  if (params?.search) {
    query = query.ilike("title", `%${params.search}%`);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  if (!data) return [];

  return data.map((item) => {
    const parsedImages = parseImages(item.images);
    return {
      id: item.id,
      credential_id: item.credentialId || "",
      slug: item.slug || "",
      name: item.title,
      issuing_organization: item.organizer,
      type: item.category || "Penghargaan",
      category: item.category || "Penghargaan",
      url_credential: item.proofUrl || item.certificateUrl || "",
      issue_date: item.date || item.createdAt || new Date().toISOString(),
      image: item.certificateUrl || (parsedImages.length > 0 ? parsedImages[0] : "/images/achievements/placeholder.webp"),
      is_show: item.showOnHome ?? true,
      description: item.description || "",
      images: parsedImages,
    };
  });
};

export const getAchivementTypes = async () => {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("Award").select("category");

  if (error) throw new Error(error.message);
  if (!data) return [];

  const types = data
    .map((item) => item.category)
    .filter((t): t is string => !!t);

  return Array.from(new Set(types));
};

export const getAchivementCategories = async () => {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("Award").select("category");

  if (error) throw new Error(error.message);
  if (!data) return [];

  const categories = data
    .map((item) => item.category)
    .filter((cat): cat is string => !!cat);

  return Array.from(new Set(categories));
};

export const getPublicationsData = async (): Promise<PublicationItem[]> => {
  const publications = await queryRowsFallback<any>(
    ["Publication", "publication"],
    (table) =>
      supabaseServer
        .from(table)
        .select("*")
        .order("createdAt", { ascending: false }),
  );

  return publications.map((item: any) => ({
    id: item.id,
    title: item.title || "",
    outlet: item.outlet || "",
    date: item.date || "",
    url: item.url || "",
    description: item.description || "",
    content: item.content || "",
    tags: item.tags || "",
    createdAt: item.createdAt || item.created_at || new Date().toISOString(),
    updatedAt: item.updatedAt || item.updated_at || new Date().toISOString(),
    imageUrl: item.imageUrl || item.image_url || "",
    images: item.images,
    slug: item.slug || "",
    showOnHome: item.showOnHome ?? true,
  }));
};

export const getPublicationBySlug = async (slug: string): Promise<any | null> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("Publication")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    title: data.title || "",
    outlet: data.outlet || "",
    date: data.date || "",
    url: data.url || "",
    description: data.description || "",
    content: data.content || "",
    tags: data.tags || "",
    createdAt: data.createdAt || data.created_at || new Date().toISOString(),
    updatedAt: data.updatedAt || data.updated_at || new Date().toISOString(),
    imageUrl: data.imageUrl || data.image_url || "",
    images: data.images,
    slug: data.slug || "",
    showOnHome: data.showOnHome ?? true,
  };
};
