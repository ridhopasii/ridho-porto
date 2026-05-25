import { Metadata } from "next";
import { notFound } from "next/navigation";

import Container from "@/common/components/elements/Container";
import PageHeading from "@/common/components/elements/PageHeading";
import BlogDetail from "@/modules/blog/components/BlogDetail";
import { METADATA } from "@/common/constants/metadata";
import { getArticleBySlug } from "@/services/blog";

interface BlogDetailPageProps {
  params: Promise<{ slug: string; locale: string; }>;
}

export const generateMetadata = async ({
  params,
}: BlogDetailPageProps): Promise<Metadata> => {
  const { slug, locale } = await params;
  const article = await getArticleBySlug(slug);

  if (!article || !article.published) {
    return {
      title: `Article Not Found ${METADATA.exTitle}`,
    };
  }

  return {
    title: `${article.title} ${METADATA.exTitle}`,
    description: article.excerpt || article.title,
    openGraph: {
      images: article.imageUrl ? [article.imageUrl] : [],
      url: `${METADATA.openGraph.url}/blog/${article.slug}`,
      siteName: METADATA.openGraph.siteName,
      locale: locale === "id" ? "id_ID" : "en_US",
      type: "article",
      authors: [METADATA.creator],
    },
    keywords: `${article.title}, ${article.tags}`,
    alternates: {
      canonical: `${(process.env.DOMAIN || "https://ridhorobbipasi.my.id")}/${locale}/blog/${slug}`,
    },
  };
};

const BlogDetailPage = async ({ params }: BlogDetailPageProps) => {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article || !article.published) {
    notFound();
  }

  return (
    <Container data-aos="fade-up">
      <BlogDetail article={article} />
    </Container>
  );
};

export default BlogDetailPage;
