import { Metadata } from "next";
import GuestbookManager from "@/modules/admin/components/managers/GuestbookManager";

export const metadata: Metadata = {
  title: "Admin - guestbook | Ridho",
  robots: "noindex, nofollow",
};

export default function Page() {
  return (
    <div className="animate-[fadeIn_0.5s_ease-out]">
      <GuestbookManager />
    </div>
  );
}
