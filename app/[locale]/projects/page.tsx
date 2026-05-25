export const revalidate = 60;
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import Container from "@/common/components/elements/Container";
import PageHeading from "@/common/components/elements/PageHeading";
import Projects from "@/modules/projects";
import { METADATA } from "@/common/constants/metadata";
import { getProjectsData } from "@/services/projects";

interface ProjectsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: ProjectsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ProjectsPage" });

  return {
    title: `${t("title")} ${METADATA.exTitle}`,
    description: t("description"),
    keywords: "portfolio frontend developer, software engineer jambi",
    alternates: {
      canonical: `${(process.env.DOMAIN || "https://ridhorobbipasi.my.id")}/${locale}/projects`,
    },
  };
}

const ProjectsPage = async ({ params }: ProjectsPageProps) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ProjectsPage" });
  const projects = await getProjectsData();

  return (
    <Container data-aos="fade-up">
      <PageHeading title={t("title")} description={t("description")} />
      <Projects projects={projects} />
    </Container>
  );
};

export default ProjectsPage;
