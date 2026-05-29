import { checkAdminAuth } from "@/common/libs/adminAuth";
import AdminLogin from "@/modules/admin/components/AdminLogin";

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = await checkAdminAuth();

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return <>{children}</>;
}
