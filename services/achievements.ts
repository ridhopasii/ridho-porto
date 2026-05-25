import { queryRowsFallback } from "@/common/libs/table-query";
import { supabaseServer } from "@/common/libs/supabase-server";
import { createPublicClient } from "@/common/utils/serverPublic";
import { PublicationItem } from "@/common/types/publication";

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

  const validData = data.filter((item) => {
    const isDummyDate = item.createdAt?.includes("2026-04");
    const isDummyImage = !item.images || item.images.includes("placeholder");
    return !isDummyDate && !isDummyImage;
  });

  return validData.map((item) => {
    return {
      id: item.id,
      credential_id: item.credentialId || "",
      slug: item.slug || "",
      name: item.title,
      issuing_organization: item.organizer,
      type: item.category || "Penghargaan",
      category: item.category || "Penghargaan",
      url_credential: item.certificateUrl || item.proofUrl || "",
      issue_date: item.createdAt || new Date().toISOString(),
      image: item.images || "/images/achievements/placeholder.png",
      is_show: item.showOnHome ?? true,
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
    tags: item.tags || "",
    createdAt: item.createdAt || item.created_at || new Date().toISOString(),
    updatedAt: item.updatedAt || item.updated_at || new Date().toISOString(),
    imageUrl: item.imageUrl || item.image_url || "",
    images: item.images,
    slug: item.slug || "",
    showOnHome: item.showOnHome ?? true,
  }));
};
