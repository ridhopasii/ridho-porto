import { checkPrivateDashboardAuth } from "@/common/libs/privateDashboardAuth";
import PrivateDashboardGate from "@/modules/dashboard/components/PrivateDashboardGate";

export default async function PrivateDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = await checkPrivateDashboardAuth();

  if (!isAuthenticated) {
    return <PrivateDashboardGate />;
  }

  return <>{children}</>;
}
