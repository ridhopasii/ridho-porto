import Container from "@/common/components/elements/Container";
import PageHeading from "@/common/components/elements/PageHeading";

export const metadata = {
  title: "Links - Satria Bahari",
};

export default function LinksPage() {
  return (
    <Container data-aos="fade-up">
      <PageHeading title="Links" description="My links" />
      <div className="py-10 text-center text-neutral-500">
        Links content coming soon.
      </div>
    </Container>
  );
}
