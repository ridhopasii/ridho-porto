export const dynamic = "force-dynamic";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import Container from "@/common/components/elements/Container";
import PageHeading from "@/common/components/elements/PageHeading";
import BlogList from "@/modules/blog/components/BlogList";
import { METADATA } from "@/common/constants/metadata";
import { getArticlesData } from "@/services/blog";

interface BlogPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "BlogPage" });

  return {
    title: `${t("title")} ${METADATA.exTitle}`,
    description: t("description"),
    keywords: "ridho robbi pasi blog, programming tutorial, web development, information systems student UNJA",
    alternates: {
      canonical: `${(process.env.DOMAIN || "https://ridhorobbipasi.my.id")}/${locale}/blog`,
    },
  };
}

const BlogPage = async ({ params }: BlogPageProps) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "BlogPage" });
  const articles = await getArticlesData();

  // Filter only published articles for public viewing
  const publishedArticles = articles.filter(a => a.published);

  return (
    <Container data-aos="fade-up">
      <PageHeading title={t("title")} description={t("description")} />
      <BlogList articles={publishedArticles} />
    </Container>
  );
};

export default BlogPage;
