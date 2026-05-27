import { Metadata } from "next";
import LinkManager from "@/modules/admin/components/managers/LinkManager";

export const metadata: Metadata = {
  title: "Admin - links | Ridho",
  robots: "noindex, nofollow",
};

export default function Page() {
  return (
    <div className="animate-[fadeIn_0.5s_ease-out]">
      <LinkManager />
    </div>
  );
}
