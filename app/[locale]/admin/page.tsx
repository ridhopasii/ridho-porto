import { Metadata } from "next";
import AdminDashboard from "@/modules/admin/components/AdminDashboard";
import AdminLogin from "@/modules/admin/components/AdminLogin";
import { checkAdminAuth } from "@/common/libs/adminAuth";

export const metadata: Metadata = {
  title: "Admin Dashboard | Ridho",
  description: "Manage portfolio content.",
  robots: "noindex, nofollow",
};

const AdminPage = () => {
  const isAuthenticated = checkAdminAuth();

  return (
    <>
      {isAuthenticated ? <AdminDashboard /> : <AdminLogin />}
    </>
  );
};

export default AdminPage;
