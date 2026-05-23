import Container from "@/common/components/elements/Container";
import PageHeading from "@/common/components/elements/PageHeading";

export const metadata = {
  title: "Guestbook - Satria Bahari",
};

export default function GuestbookPage() {
  return (
    <Container data-aos="fade-up">
      <PageHeading title="Guestbook" description="Leave a message" />
      <div className="py-10 text-center text-neutral-500">
        Guestbook feature coming soon.
      </div>
    </Container>
  );
}
