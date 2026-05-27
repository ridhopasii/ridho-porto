import { Metadata } from "next";
import PlanningManager from "@/modules/admin/components/managers/PlanningManager";

export const metadata: Metadata = {
  title: "Admin - planning | Ridho",
  robots: "noindex, nofollow",
};

export default function Page() {
  return (
    <div className="animate-[fadeIn_0.5s_ease-out]">
      <PlanningManager />
    </div>
  );
}
