import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { METADATA } from "@/common/constants/metadata";
import ProfileForm from "@/modules/dashboard/components/admin/ProfileForm";
import { getProfileData } from "@/services/profile";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "DashboardPage" });
  return {
    title: `Profile Management - ${t("title")} ${METADATA.exTitle}`,
    description: "Manage your digital identity and profile settings.",
    alternates: { canonical: `${(process.env.DOMAIN || "https://ridhorobbipasi.my.id")}/${locale}/admin/profile` },
  };
}

const ProfileManagementPage = async () => {
  // Fetch the actual profile data from Supabase
  const profileData = await getProfileData();

  return <ProfileForm initialData={profileData} />;
};

export default ProfileManagementPage;
