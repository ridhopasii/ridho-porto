import { Metadata } from "next";
import AwardManager from "@/modules/admin/components/managers/AwardManager";

export const metadata: Metadata = {
  title: "Admin - awards | Ridho",
  robots: "noindex, nofollow",
};

export default function Page() {
  return (
    <div className="animate-[fadeIn_0.5s_ease-out]">
      <AwardManager />
    </div>
  );
}
