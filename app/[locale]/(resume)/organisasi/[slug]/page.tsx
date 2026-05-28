import { notFound } from "next/navigation";
import { supabaseServer } from "@/common/libs/supabase-server";
import OrganizationDetail from "@/modules/resume/components/OrganizationDetail";
import DetailHeader from "@/modules/resume/components/DetailHeader";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await supabaseServer.from("Organization").select("name, role").eq("slug", slug).single();
  if (!data) return { title: "Organization Not Found" };
  return { title: `${data.role} at ${data.name} | Resume` };
}

export default async function OrganizationSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data } = await supabaseServer.from("Organization").select("*").eq("slug", slug).single();

  if (!data) {
    notFound();
  }

  return (
    <div className="mt-8">
      <DetailHeader title="Detail Organisasi" />
      <OrganizationDetail data={data} />
    </div>
  );
}
