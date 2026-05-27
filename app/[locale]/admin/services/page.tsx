import { Metadata } from "next";
import ServiceManager from "@/modules/admin/components/managers/ServiceManager";

export const metadata: Metadata = {
  title: "Admin - services | Ridho",
  robots: "noindex, nofollow",
};

export default function Page() {
  return (
    <div className="animate-[fadeIn_0.5s_ease-out]">
      <ServiceManager />
    </div>
  );
}
