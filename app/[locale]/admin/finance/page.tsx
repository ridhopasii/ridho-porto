import { Metadata } from "next";
import FinanceManager from "@/modules/admin/components/managers/FinanceManager";

export const metadata: Metadata = {
  title: "Admin - finance | Ridho",
  robots: "noindex, nofollow",
};

export default function Page() {
  return (
    <div className="animate-[fadeIn_0.5s_ease-out]">
      <FinanceManager />
    </div>
  );
}
