import Container from "@/common/components/elements/Container";
import PageHeading from "@/common/components/elements/PageHeading";

export const metadata = {
  title: "Changelog - Satria Bahari",
};

export default function ChangelogPage() {
  return (
    <Container data-aos="fade-up">
      <PageHeading title="Changelog" description="Project history" />
      <div className="py-10 text-center text-neutral-500">
        Changelog content coming soon.
      </div>
    </Container>
  );
}
