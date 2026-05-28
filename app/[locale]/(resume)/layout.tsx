import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Container from "@/common/components/elements/Container";
import ResumeNavigation from "@/modules/resume/components/ResumeNavigation";
import { METADATA } from "@/common/constants/metadata";

type Props = { 
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: `Resume ${METADATA.exTitle}`,
    description: "Resume dan riwayat perjalanan karir, pendidikan, serta organisasi.",
    alternates: { canonical: `${(process.env.DOMAIN || "https://ridhorobbipasi.my.id")}/${locale}` },
  };
}

export default async function ResumeLayout({ children, params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AboutPage" });

  return (
    <Container data-aos="fade-up">
      <ResumeNavigation />
      
      <div className="animate-[fadeIn_0.5s_ease-out]">
        {children}
      </div>
    </Container>
  );
}
