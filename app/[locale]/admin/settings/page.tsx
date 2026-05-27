import { Metadata } from "next";
import SiteSettingsManager from "@/modules/admin/components/managers/SiteSettingsManager";

export const metadata: Metadata = {
  title: "Admin - settings | Ridho",
  robots: "noindex, nofollow",
};

export default function Page() {
  return (
    <div className="animate-[fadeIn_0.5s_ease-out]">
      <SiteSettingsManager />
    </div>
  );
}
