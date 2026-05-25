import { getProfileData } from "@/services/profile";
import { supabaseServer } from "@/common/libs/supabase-server";
import { METADATA } from "@/common/constants/metadata";
import LinksClient from "./LinksClient";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: Props) {
  const { locale } = await params;
  return {
    title: `Links ${METADATA.exTitle}`,
    description: "Kumpulan tautan sosial media dan portofolio saya.",
    alternates: {
      canonical: `${(process.env.DOMAIN || "https://ridhorobbipasi.my.id")}/${locale}/links`,
    },
  };
}

export const revalidate = 60;

export default async function LinksPage({ params }: Props) {
  const { locale } = await params;
  const [profile, { data: links }] = await Promise.all([
    getProfileData(),
    supabaseServer
      .from("Link")
      .select("*")
      .order("id", { ascending: true })
  ]);

  const defaultProfile = {
    fullName: "Ridho Robbi Pasi",
    title: "Fullstack Developer",
    bio: "Teknik Informatika UNIMAL Student",
    location: "Aceh, Indonesia",
    email: "ridhorobbipasi@gmail.com",
    avatarUrl: "/images/signature.png",
    heroImage: null,
    cvLink: null,
    whatsappUrl: null
  };

  const finalProfile = profile || defaultProfile;

  return (
    <LinksClient
      profile={finalProfile}
      links={links || []}
      locale={locale}
    />
  );
}
