import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Container from "@/common/components/elements/Container";
import PageHeading from "@/common/components/elements/PageHeading";
import Resume from "@/modules/resume";
import { METADATA } from "@/common/constants/metadata";
import { getPageContent, readPageContent } from "@/common/libs/page-content";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: `Resume ${METADATA.exTitle}`,
    description: "Resume dan riwayat perjalanan karir, pendidikan, serta organisasi.",
    alternates: { canonical: `${(process.env.DOMAIN || "https://ridhorobbipasi.my.id")}/${locale}/resume` },
  };
}

const ResumePage = async ({ params }: Props) => {
  const { locale } = await params;
  const content = await getPageContent("about", locale);
  
  return (
    <Container data-aos="fade-up">
      <PageHeading
        title="Resume"
        description="Riwayat perjalanan karir, pendidikan, dan pengalaman organisasi saya."
      />
      <Resume content={content} />
    </Container>
  );
};

export default ResumePage;
