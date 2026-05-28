import { notFound } from "next/navigation";
import { supabaseServer } from "@/common/libs/supabase-server";
import AchievementDetail from "@/modules/resume/components/AchievementDetail";
import DetailHeader from "@/modules/resume/components/DetailHeader";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await supabaseServer.from("Award").select("title").eq("slug", slug).single();
  if (!data) return { title: "Achievement Not Found" };
  return { title: `${data.title} | Resume` };
}

export default async function AchievementSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: item } = await supabaseServer.from("Award").select("*").eq("slug", slug).single();

  if (!item) {
    notFound();
  }

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

  const parsedImages = parseImages(item.images);

  const mappedData = {
    id: item.id,
    credential_id: item.credentialId || "",
    slug: item.slug || "",
    name: item.title,
    issuing_organization: item.organizer,
    type: item.category || "Penghargaan",
    category: item.category || "Penghargaan",
    url_credential: item.certificateUrl || item.proofUrl || "",
    issue_date: item.createdAt || item.date || new Date().toISOString(),
    image: item.certificateUrl || (parsedImages.length > 0 ? parsedImages[0] : "/images/achievements/placeholder.webp"),
    images: parsedImages,
    description: item.description || "",
    is_show: item.showOnHome ?? true,
  };

  return (
    <div className="mt-8">
      <DetailHeader title="Detail Pencapaian" />
      <AchievementDetail data={mappedData as any} />
    </div>
  );
}
