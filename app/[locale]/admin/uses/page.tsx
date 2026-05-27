import { Metadata } from "next";
import UsesManager from "@/modules/admin/components/managers/UsesManager";

export const metadata: Metadata = {
  title: "Admin - uses | Ridho",
  robots: "noindex, nofollow",
};

export default function Page() {
  return (
    <div className="animate-[fadeIn_0.5s_ease-out]">
      <UsesManager />
    </div>
  );
}
