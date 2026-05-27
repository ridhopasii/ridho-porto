import { Metadata } from "next";
import SecurityManager from "@/modules/admin/components/SecurityManager";

export const metadata: Metadata = {
  title: "Admin - security | Ridho",
  robots: "noindex, nofollow",
};

export default function Page() {
  return (
    <div className="animate-[fadeIn_0.5s_ease-out]">
      <SecurityManager />
    </div>
  );
}
