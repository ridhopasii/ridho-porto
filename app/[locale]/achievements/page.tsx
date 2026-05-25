export const revalidate = 60;
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import Container from "@/common/components/elements/Container";
import PageHeading from "@/common/components/elements/PageHeading";
import Achievements from "@/modules/achievements";
import { METADATA } from "@/common/constants/metadata";
import { Suspense } from "react";
import {
  getAchievementsData,
  getAchivementCategories,
  getAchivementTypes,
} from "@/services/achievements";

interface AchievementsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
  params,
}: AchievementsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AchievementsPage" });

  return {
    title: `${t("title")} ${METADATA.exTitle}`,
    description: t("description"),
    keywords: "software engineer achievements, certificates, ridho robbi pasi",
    alternates: {
      canonical: `${(process.env.DOMAIN || "https://ridhorobbipasi.my.id")}/${locale}/achievements`,
    },
  };
}

const AchievementsPage = async ({
  params,
  searchParams,
}: AchievementsPageProps) => {
  const { locale } = await params;
  const sp = await searchParams;
  const t = await getTranslations({ locale, namespace: "AchievementsPage" });

  const category =
    typeof sp.category === "string" ? sp.category : undefined;
  const search =
    typeof sp.search === "string" ? sp.search : undefined;

  const [achievements, categoriesData, typesData] = await Promise.all([
    getAchievementsData({ category, search }),
    getAchivementCategories(),
    getAchivementTypes(),
  ]);

  return (
    <Container data-aos="fade-up">
      <PageHeading title={t("title")} description={t("description")} />
      <Suspense>
        <Achievements
          achievements={achievements}
          categoriesData={categoriesData}
          typesData={typesData}
        />
      </Suspense>
    </Container>
  );
};

export default AchievementsPage;
