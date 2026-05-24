import { Metadata } from "next";
import Container from "@/common/components/elements/Container";
import PageHeading from "@/common/components/elements/PageHeading";
import AdminDashboard from "@/modules/admin/components/AdminDashboard";

export const metadata: Metadata = {
  title: "Admin Dashboard | Ridho",
  description: "Manage portfolio content.",
  robots: "noindex, nofollow",
};

const AdminPage = () => {
  return (
    <Container data-aos="fade-up">
      <PageHeading title="Admin" description="Manage your content and images." />
      <AdminDashboard />
    </Container>
  );
};

export default AdminPage;
