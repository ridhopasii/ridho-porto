import { Metadata } from "next";
import PublicationManager from "@/modules/admin/components/managers/PublicationManager";

export const metadata: Metadata = {
  title: "Admin - publications | Ridho",
  robots: "noindex, nofollow",
};

export default function Page() {
  return (
    <div className="animate-[fadeIn_0.5s_ease-out]">
      <PublicationManager />
    </div>
  );
}
