import { Metadata } from "next";
import OrganizationManager from "@/modules/admin/components/managers/OrganizationManager";

export const metadata: Metadata = {
  title: "Admin - organization | Ridho",
  robots: "noindex, nofollow",
};

export default function Page() {
  return (
    <div className="animate-[fadeIn_0.5s_ease-out]">
      <OrganizationManager />
    </div>
  );
}
