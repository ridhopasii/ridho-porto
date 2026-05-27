import { Metadata } from "next";
import TestimonialManager from "@/modules/admin/components/managers/TestimonialManager";

export const metadata: Metadata = {
  title: "Admin - testimonials | Ridho",
  robots: "noindex, nofollow",
};

export default function Page() {
  return (
    <div className="animate-[fadeIn_0.5s_ease-out]">
      <TestimonialManager />
    </div>
  );
}
