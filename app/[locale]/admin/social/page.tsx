import { Metadata } from "next";
import SocialManager from "@/modules/admin/components/managers/SocialManager";

export const metadata: Metadata = {
  title: "Admin - social | Ridho",
  robots: "noindex, nofollow",
};

export default function Page() {
  return (
    <div className="animate-[fadeIn_0.5s_ease-out]">
      <SocialManager />
    </div>
  );
}
