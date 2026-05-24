import Container from "@/common/components/elements/Container";
import PageHeading from "@/common/components/elements/PageHeading";
import Guestbook from "@/modules/guestbook/components/Guestbook";
import { supabaseServer } from "@/common/libs/supabase-server";

export const metadata = {
  title: "Guestbook - Satria Bahari",
};

export const revalidate = 60; // ISR cache every 60s

export default async function GuestbookPage() {
  // Fetch only approved messages
  const { data: messages } = await supabaseServer
    .from("Guestbook")
    .select("*")
    .eq("isApproved", true)
    .order("createdAt", { ascending: false });

  return (
    <Container data-aos="fade-up">
      <PageHeading title="Guestbook" description="Leave a message" />
      <div className="mt-8">
        <Guestbook messages={messages || []} />
      </div>
    </Container>
  );
}
