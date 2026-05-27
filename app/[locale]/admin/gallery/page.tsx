import { Metadata } from "next";
import GalleryManager from "@/modules/admin/components/managers/GalleryManager";

export const metadata: Metadata = {
  title: "Admin - gallery | Ridho",
  robots: "noindex, nofollow",
};

export default function Page() {
  return (
    <div className="animate-[fadeIn_0.5s_ease-out]">
      <GalleryManager />
    </div>
  );
}
