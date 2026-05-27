import { Metadata } from "next";
import ExperienceManager from "@/modules/admin/components/managers/ExperienceManager";

export const metadata: Metadata = {
  title: "Admin - experience | Ridho",
  robots: "noindex, nofollow",
};

export default function Page() {
  return (
    <div className="animate-[fadeIn_0.5s_ease-out]">
      <ExperienceManager />
    </div>
  );
}
