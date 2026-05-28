import { notFound } from "next/navigation";
import { supabaseServer } from "@/common/libs/supabase-server";
import CareerDetail from "@/modules/resume/components/CareerDetail";
import DetailHeader from "@/modules/resume/components/DetailHeader";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await supabaseServer.from("Experience").select("position, company").eq("slug", slug).single();
  if (!data) return { title: "Career Not Found" };
  return { title: `${data.position} at ${data.company} | Resume` };
}

export default async function CareerSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data } = await supabaseServer.from("Experience").select("*").eq("slug", slug).single();

  if (!data) {
    notFound();
  }

  return (
    <div className="mt-8">
      <DetailHeader title="Detail Karir" />
      <CareerDetail data={data} />
    </div>
  );
}
