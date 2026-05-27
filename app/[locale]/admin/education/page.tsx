import { Metadata } from "next";
import EducationManager from "@/modules/admin/components/managers/EducationManager";

export const metadata: Metadata = {
  title: "Admin - education | Ridho",
  robots: "noindex, nofollow",
};

export default function Page() {
  return (
    <div className="animate-[fadeIn_0.5s_ease-out]">
      <EducationManager />
    </div>
  );
}
