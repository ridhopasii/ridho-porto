import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Container from "@/common/components/elements/Container";
import PageHeading from "@/common/components/elements/PageHeading";
import About from "@/modules/about";
import { METADATA } from "@/common/constants/metadata";
import { getPageContent, readPageContent } from "@/common/libs/page-content";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AboutPage" });
  const content = await getPageContent("about", locale);
  return {
    title: `${readPageContent(content, "title", t("title"))} ${METADATA.exTitle}`,
    description: readPageContent(content, "description", t("description")),
    alternates: { canonical: `${process.env.DOMAIN}/${locale}/about` },
  };
}

const AboutPage = async ({ params }: Props) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AboutPage" });
  const content = await getPageContent("about", locale);
  return (
    <Container data-aos="fade-up">
      <PageHeading
        title={readPageContent(content, "title", t("title"))}
        description={readPageContent(content, "description", t("description"))}
      />
      <About content={content} />
    </Container>
  );
};

export default AboutPage;
