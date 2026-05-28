import { notFound } from "next/navigation";
import { supabaseServer } from "@/common/libs/supabase-server";
import EducationDetail from "@/modules/resume/components/EducationDetail";
import DetailHeader from "@/modules/resume/components/DetailHeader";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await supabaseServer.from("Education").select("school, degree").eq("slug", slug).single();
  if (!data) return { title: "Education Not Found" };
  return { title: `${data.degree} at ${data.school} | Resume` };
}

export default async function EducationSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data } = await supabaseServer.from("Education").select("*").eq("slug", slug).single();

  if (!data) {
    notFound();
  }

  return (
    <div className="mt-8">
      <DetailHeader title="Detail Pendidikan" />
      <EducationDetail data={data} />
    </div>
  );
}
