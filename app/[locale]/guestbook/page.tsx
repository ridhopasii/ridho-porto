import Container from "@/common/components/elements/Container";
import PageHeading from "@/common/components/elements/PageHeading";
import Guestbook from "@/modules/guestbook/components/Guestbook";
import { supabaseServer } from "@/common/libs/supabase-server";
import { METADATA } from "@/common/constants/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const title = locale === "id" ? "Chat Live" : "Live Chat";
  return {
    title: `${title} ${METADATA.exTitle}`,
  };
}

export const revalidate = 60; // ISR cache every 60s

export default async function GuestbookPage({ params }: Props) {
  const { locale } = await params;
  const { data: messages } = await supabaseServer
    .from("Guestbook")
    .select("*")
    .eq("isApproved", true)
    .order("createdAt", { ascending: false });

  const title = locale === "id" ? "Chat Live" : "Live Chat";
  const description = locale === "id" 
    ? "Tinggalkan pesan Anda di sini, mari saling terhubung secara real-time!" 
    : "Leave a message here, let's connect in real-time!";

  return (
    <Container data-aos="fade-up">
      <PageHeading title={title} description={description} />
      <div className="mt-8">
        <Guestbook messages={messages || []} />
      </div>
    </Container>
  );
}
