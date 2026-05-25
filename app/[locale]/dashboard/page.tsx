import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import Container from "@/common/components/elements/Container";
import { METADATA } from "@/common/constants/metadata";
import { checkPrivateDashboardAuth } from "@/common/libs/privateDashboardAuth";
import Dashboard from "@/modules/dashboard/components/Dashboard";
import PrivateDashboardGate from "@/modules/dashboard/components/PrivateDashboardGate";
import { getFinanceHubData } from "@/services/finance";
import { getProductivityHubData } from "@/services/productivity";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "DashboardPage" });
  return {
    title: `${t("title")} ${METADATA.exTitle}`,
    description: t("description"),
    alternates: { canonical: `${process.env.DOMAIN}/${locale}/dashboard` },
  };
}

const DashboardPage = async ({ params }: Props) => {
  const { locale } = await params;
  const isAuthenticated = await checkPrivateDashboardAuth();

  if (!isAuthenticated) {
    return <PrivateDashboardGate />;
  }

  const [productivity, finance] = await Promise.all([
    getProductivityHubData(),
    getFinanceHubData(),
  ]);

  return (
    <Container data-aos="fade-up" className="mx-auto max-w-7xl px-4 lg:px-6">
      <Dashboard
        locale={locale}
        productivity={productivity}
        finance={finance}
      />
    </Container>
  );
};

export default DashboardPage;
