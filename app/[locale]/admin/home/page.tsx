import { Metadata } from "next";
import PageContentManager from "@/modules/admin/components/managers/PageContentManager";

export const metadata: Metadata = {
  title: "Admin - Home | Ridho",
  robots: "noindex, nofollow",
};

export default function Page() {
  return (
    <div className="animate-[fadeIn_0.5s_ease-out]">
      <PageContentManager page="home" />
    </div>
  );
}
