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
  params: { locale: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({
  params: { locale },
}: AchievementsPageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "AchievementsPage" });

  return {
    title: `${t("title")} ${METADATA.exTitle}`,
    description: t("description"),
    keywords: "software engineer achievements, certificates, satria bahari",
    alternates: {
      canonical: `${process.env.DOMAIN}/${locale}/achievements`,
    },
  };
}

const AchievementsPage = async ({
  params: { locale },
  searchParams,
}: AchievementsPageProps) => {
  const t = await getTranslations({ locale, namespace: "AchievementsPage" });

  const category =
    typeof searchParams.category === "string" ? searchParams.category : undefined;
  const search =
    typeof searchParams.search === "string" ? searchParams.search : undefined;

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
