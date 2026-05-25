import { Metadata } from "next";
import { checkAdminAuth } from "@/common/libs/adminAuth";
import AdminLogin from "@/modules/admin/components/AdminLogin";
import AdminDashboard from "@/modules/admin/components/AdminDashboard";

export const metadata: Metadata = {
  title: "Admin Dashboard | Ridho",
  description: "Manage portfolio content.",
  robots: "noindex, nofollow",
};

const AdminPage = async () => {
  const isAuthenticated = await checkAdminAuth();

  return (
    <>
      {isAuthenticated ? <AdminDashboard /> : <AdminLogin />}
    </>
  );
};

export default AdminPage;
