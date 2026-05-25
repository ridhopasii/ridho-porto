import { Metadata } from "next";
import Container from "@/common/components/elements/Container";
import PageHeading from "@/common/components/elements/PageHeading";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Ridho Robbi Pasi Portfolio",
};

export default function PrivacyPage() {
  return (
    <Container>
      <PageHeading title="Privacy Policy" description="Last updated: May 2026" />
      <div className="prose prose-neutral dark:prose-invert max-w-none mt-8 space-y-6">
        <p>
          This Privacy Policy describes how your personal information is collected, used, and shared when you visit or interact with the portfolio website of Ridho Robbi Pasi.
        </p>

        <h2 className="text-xl font-semibold">1. Information We Collect</h2>
        <p>
          We collect information that you voluntarily provide to us when you express an interest in obtaining information about us or our products and Services, when you participate in activities on the Website, or otherwise when you contact us. This may include your name, email address, and the contents of your messages.
        </p>

        <h2 className="text-xl font-semibold">2. Third-Party Integrations (OAuth)</h2>
        <p>
          Our website integrates with third-party APIs such as TikTok, GitHub, and Instagram to display portfolio content and social media presence. When you authenticate using these services (e.g., "Login with TikTok"):
        </p>
        <ul className="list-disc pl-6">
          <li>We only request permissions strictly necessary for displaying your content on the portfolio (such as read-only access to basic profile info and videos).</li>
          <li>We do NOT sell, rent, or trade your data to any third parties.</li>
          <li>Any authentication tokens are securely stored and handled according to industry standards.</li>
        </ul>

        <h2 className="text-xl font-semibold">3. How We Use Your Information</h2>
        <p>
          We use the information we collect or receive to communicate with you, to operate and maintain the website, and to personalize your experience. Analytics data may be collected anonymously to improve website performance.
        </p>

        <h2 className="text-xl font-semibold">4. Data Security</h2>
        <p>
          We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
        </p>

        <h2 className="text-xl font-semibold">5. Contact Us</h2>
        <p>
          If you have questions or comments about this Privacy Policy, please contact us through the forms provided on the website or via our official social media channels.
        </p>
      </div>
    </Container>
  );
}
