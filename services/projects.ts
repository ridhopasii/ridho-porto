import { createClient } from "@/common/utils/server";

export const getProjectsData = async () => {
  const supabase = createClient();

  let { data, error } = await supabase.from("Project").select();

  if (error) throw new Error(error.message);
  if (!data) return [];

  return data.map((item) => {
    return {
      ...item,
      image: item.imageUrl || "",
      is_featured: item.featured || false,
      stacks: item.tags ? item.tags.split(',').map((t: string) => t.trim()) : [],
    };
  });
};

export const getProjectsDataBySlug = async (slug: string) => {
  const supabase = createClient();

  let { data, error } = await supabase
    .from("Project")
    .select()
    .eq("slug", slug)
    .single();

  if (error) throw new Error(error.message);
  if (!data) return null;

  return {
    ...data,
    image: data.imageUrl || "",
    is_featured: data.featured || false,
    stacks: data.tags ? data.tags.split(',').map((t: string) => t.trim()) : [],
  };
};

