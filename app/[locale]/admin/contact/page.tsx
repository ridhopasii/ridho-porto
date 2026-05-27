import { Metadata } from "next";
import ContactManager from "@/modules/admin/components/managers/ContactManager";

export const metadata: Metadata = {
  title: "Admin - contact | Ridho",
  robots: "noindex, nofollow",
};

export default function Page() {
  return (
    <div className="animate-[fadeIn_0.5s_ease-out]">
      <ContactManager />
    </div>
  );
}
