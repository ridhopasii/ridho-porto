import { Metadata } from "next";
import ProductivityManager from "@/modules/admin/components/managers/ProductivityManager";

export const metadata: Metadata = {
  title: "Admin - productivity | Ridho",
  robots: "noindex, nofollow",
};

export default function Page() {
  return (
    <div className="animate-[fadeIn_0.5s_ease-out]">
      <ProductivityManager />
    </div>
  );
}
