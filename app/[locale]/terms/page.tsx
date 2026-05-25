import { Metadata } from "next";
import Container from "@/common/components/elements/Container";
import PageHeading from "@/common/components/elements/PageHeading";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Ridho Robbi Pasi Portfolio",
};

export default function TermsPage() {
  return (
    <Container>
      <PageHeading title="Terms of Service" description="Last updated: May 2026" />
      <div className="prose prose-neutral dark:prose-invert max-w-none mt-8 space-y-6">
        <p>
          Welcome to the personal portfolio website of Ridho Robbi Pasi. By accessing or using this website, you agree to be bound by these Terms of Service.
        </p>

        <h2 className="text-xl font-semibold">1. Use of Content</h2>
        <p>
          All content provided on this website is for informational purposes only. The owner of this website makes no representations as to the accuracy or completeness of any information on this site or found by following any link on this site.
        </p>

        <h2 className="text-xl font-semibold">2. Intellectual Property</h2>
        <p>
          The materials contained in this website, including projects, designs, and code snippets, are protected by applicable copyright and trademark law unless stated otherwise. You may not distribute, modify, transmit, reuse, or use the content for public or commercial purposes without written permission.
        </p>

        <h2 className="text-xl font-semibold">3. Third-Party Links and Integrations</h2>
        <p>
          This website may contain links to third-party web sites or services (e.g., TikTok, GitHub, Instagram) that are not owned or controlled by Ridho Robbi Pasi. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third party web sites or services.
        </p>

        <h2 className="text-xl font-semibold">4. Changes to Terms</h2>
        <p>
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our website after those revisions become effective, you agree to be bound by the revised terms.
        </p>

        <h2 className="text-xl font-semibold">5. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us through the provided contact forms on the website.
        </p>
      </div>
    </Container>
  );
}
