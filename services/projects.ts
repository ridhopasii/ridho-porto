import { createPublicClient } from "@/common/utils/serverPublic";

export const getProjectsData = async () => {
  const supabase = createPublicClient();

  let { data, error } = await supabase.from("Project").select();

  if (error) throw new Error(error.message);
  if (!data) return [];

  return data.map((item) => {
    return {
      ...item,
      image: item.imageUrl || "",
      is_featured: item.featured || false,
      is_show: item.showOnHome ?? true,
      link_demo: item.demoUrl || null,
      link_github: item.repoUrl || null,
      stacks: item.tags ? item.tags.split(',').map((t: string) => t.trim()) : [],
    };
  });
};

export const getProjectsDataBySlug = async (slug: string) => {
  const supabase = createPublicClient();

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
    is_show: data.showOnHome ?? true,
    link_demo: data.demoUrl || null,
    link_github: data.repoUrl || null,
    stacks: data.tags ? data.tags.split(',').map((t: string) => t.trim()) : [],
  };
};

