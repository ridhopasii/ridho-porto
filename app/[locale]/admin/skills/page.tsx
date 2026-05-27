import { Metadata } from "next";
import SkillManager from "@/modules/admin/components/managers/SkillManager";

export const metadata: Metadata = {
  title: "Admin - skills | Ridho",
  robots: "noindex, nofollow",
};

export default function Page() {
  return (
    <div className="animate-[fadeIn_0.5s_ease-out]">
      <SkillManager />
    </div>
  );
}
