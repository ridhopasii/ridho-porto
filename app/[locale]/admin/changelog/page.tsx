import { Metadata } from "next";
import ChangelogManager from "@/modules/admin/components/managers/ChangelogManager";

export const metadata: Metadata = {
  title: "Admin - changelog | Ridho",
  robots: "noindex, nofollow",
};

export default function Page() {
  return (
    <div className="animate-[fadeIn_0.5s_ease-out]">
      <ChangelogManager />
    </div>
  );
}
