import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

import Container from "@/common/components/elements/Container";
import { getPageContent, readPageContent } from "@/common/libs/page-content";
import Home from "@/modules/home";
import { METADATA } from "@/common/constants/metadata";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "HomePage" });
  const content = await getPageContent("home", locale);

  return {
    title: `${METADATA.creator} | Portfolio`,
    description: readPageContent(
      content,
      "resume.paragraph_1",
      t("resume.paragraph_1"),
    ),
    alternates: {
      canonical: `${process.env.DOMAIN}/${locale}`,
    },
    openGraph: {
      title: `${METADATA.creator} | Personal Website`,
      description: readPageContent(
        content,
        "resume.paragraph_1",
        t("resume.paragraph_1"),
      ),
      url: `${process.env.DOMAIN}/${locale}`,
      siteName: METADATA.openGraph.siteName,
      locale: locale === "id" ? "id_ID" : "en_US",
      type: "website",
    },
  };
}

const HomePage = async ({ params }: HomePageProps) => {
  const { locale } = await params;
  const content = await getPageContent("home", locale);
  return (
    <Container data-aos="fade-up">
      <Home content={content} />
    </Container>
  );
};

export default HomePage;
