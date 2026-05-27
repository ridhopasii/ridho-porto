import { createPublicClient } from "@/common/utils/serverPublic";

export const getProfileData = async () => {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("Profile")
      .select(
        "id, fullName, title, bio, location, email, avatarUrl, heroImage, cvLink, whatsappUrl, username"
      )
      .limit(1)
      .single();

    if (error || !data) {
      // Fallback: try lowercase table name (local migration)
      const { data: data2, error: error2 } = await supabase
        .from("profile")
        .select("*")
        .limit(1)
        .single();

      if (error2 || !data2) return null;
      return {
        id: data2.id,
        fullName: data2.full_name || "",
        username: data2.username || "",
        title: data2.title || "",
        bio: data2.bio || "",
        location: data2.location || "",
        email: data2.email || "",
        avatarUrl: (data2.avatar_url || "").includes("github.com") 
          ? "/profile.webp" 
          : (data2.avatar_url || null),
        heroImage: data2.hero_image || null,
        cvLink: data2.cv_link || null,
        whatsappUrl: data2.whatsapp_url || null,
      };
    }

    return {
      id: data.id,
      fullName: (data as any).fullName || (data as any).full_name || "",
      username: (data as any).username || "",
      title: data.title || "",
      bio: data.bio || "",
      location: data.location || "",
      email: data.email || "",
      avatarUrl: ((data as any).avatarUrl || (data as any).avatar_url || "").includes("github.com") 
        ? "/profile.webp" 
        : ((data as any).avatarUrl || (data as any).avatar_url || null),
      heroImage: (data as any).heroImage || (data as any).hero_image || null,
      cvLink: (data as any).cvLink || (data as any).cv_link || null,
      whatsappUrl: (data as any).whatsappUrl || (data as any).whatsapp_url || null,
    };
  } catch {
    return null;
  }
};
