import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { METADATA } from "@/common/constants/metadata";
import AdminOverview from "@/modules/dashboard/components/admin/AdminOverview";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "DashboardPage" });
  return {
    title: `Admin Overview - ${t("title")} ${METADATA.exTitle}`,
    description: t("description"),
    alternates: { canonical: `${(process.env.DOMAIN || "https://ridhorobbipasi.my.id")}/${locale}/admin` },
  };
}

const PrivateDashboardPage = async () => {
  return <AdminOverview />;
};

export default PrivateDashboardPage;
