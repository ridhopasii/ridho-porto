import { Metadata } from "next";
import HabitsManager from "@/modules/admin/components/managers/HabitsManager";

export const metadata: Metadata = {
  title: "Admin - habits | Ridho",
  robots: "noindex, nofollow",
};

export default function Page() {
  return (
    <div className="animate-[fadeIn_0.5s_ease-out]">
      <HabitsManager />
    </div>
  );
}
