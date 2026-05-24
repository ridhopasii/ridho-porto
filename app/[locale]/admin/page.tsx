import { Metadata } from "next";
import dynamic from "next/dynamic";
import { checkAdminAuth } from "@/common/libs/adminAuth";
import AdminLogin from "@/modules/admin/components/AdminLogin";

const AdminDashboard = dynamic(
  () => import("@/modules/admin/components/AdminDashboard"),
  { ssr: false }
);

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
