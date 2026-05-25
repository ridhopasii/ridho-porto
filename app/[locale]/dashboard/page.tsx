import { Suspense } from "react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import Container from "@/common/components/elements/Container";
import PageHeading from "@/common/components/elements/PageHeading";
import { METADATA } from "@/common/constants/metadata";
import DashboardPublic from "@/modules/dashboard/components/DashboardPublic";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "DashboardPage" });
  return {
    title: `${t("title")} ${METADATA.exTitle}`,
    description: t("description"),
    alternates: { canonical: `${(process.env.DOMAIN || "https://ridhorobbipasi.my.id")}/${locale}/dashboard` },
  };
}

const DashboardPage = async ({ params }: Props) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "DashboardPage" });

  return (
    <Container data-aos="fade-up">
      <PageHeading title={t("title")} description={t("description")} />
      <Suspense fallback={<div className="animate-pulse space-y-8"><div className="h-40 rounded-3xl bg-neutral-100 dark:bg-neutral-900" /><div className="h-64 rounded-3xl bg-neutral-100 dark:bg-neutral-900" /></div>}>
        <DashboardPublic />
      </Suspense>
    </Container>
  );
};

export default DashboardPage;
