import { createClient } from "@/common/utils/server";

export const getAchievementsData = async (params?: { category?: string; search?: string }) => {
  const supabase = createClient();
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
  const supabase = createClient();
  const { data, error } = await supabase.from("Award").select("category");

  if (error) throw new Error(error.message);
  if (!data) return [];

  const types = data
    .map((item) => item.category)
    .filter((t): t is string => !!t);

  return Array.from(new Set(types));
};

export const getAchivementCategories = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.from("Award").select("category");

  if (error) throw new Error(error.message);
  if (!data) return [];

  const categories = data
    .map((item) => item.category)
    .filter((cat): cat is string => !!cat);

  return Array.from(new Set(categories));
};
