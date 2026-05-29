import { Metadata } from "next";
import { notFound } from "next/navigation";

import Container from "@/common/components/elements/Container";
import PublicationDetail from "@/modules/blog/components/PublicationDetail";
import { METADATA } from "@/common/constants/metadata";
import { getPublicationBySlug } from "@/services/achievements";

interface PublicationDetailPageProps {
  params: Promise<{ slug: string; locale: string; }>;
}

export const generateMetadata = async ({
  params,
}: PublicationDetailPageProps): Promise<Metadata> => {
  const { slug, locale } = await params;
  const publication = await getPublicationBySlug(slug);

  if (!publication || (publication.showOnHome === false)) {
    return {
      title: `Publication Not Found ${METADATA.exTitle}`,
    };
  }

  return {
    title: `${publication.title} ${METADATA.exTitle}`,
    description: publication.description || publication.title,
    openGraph: {
      images: publication.imageUrl ? [publication.imageUrl] : [],
      url: `${METADATA.openGraph.url}/blog/publikasi/${publication.slug}`,
      siteName: METADATA.openGraph.siteName,
      locale: locale === "id" ? "id_ID" : "en_US",
      type: "article",
      authors: [METADATA.creator],
    },
    keywords: `${publication.title}, ${publication.tags}`,
    alternates: {
      canonical: `${(process.env.DOMAIN || "https://ridhorobbipasi.my.id")}/${locale}/blog/publikasi/${slug}`,
    },
  };
};

const PublicationDetailPage = async ({ params }: PublicationDetailPageProps) => {
  const { slug } = await params;
  const publication = await getPublicationBySlug(slug);

  if (!publication || (publication.showOnHome === false)) {
    notFound();
  }

  return (
    <Container data-aos="fade-up">
      <PublicationDetail publication={publication} />
    </Container>
  );
};

export default PublicationDetailPage;
