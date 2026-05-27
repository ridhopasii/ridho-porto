import { Metadata } from "next";
import ProjectManager from "@/modules/admin/components/managers/ProjectManager";

export const metadata: Metadata = {
  title: "Admin - projects | Ridho",
  robots: "noindex, nofollow",
};

export default function Page() {
  return (
    <div className="animate-[fadeIn_0.5s_ease-out]">
      <ProjectManager />
    </div>
  );
}
