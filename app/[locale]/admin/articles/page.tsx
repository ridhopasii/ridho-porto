import { Metadata } from "next";
import ArticleManager from "@/modules/admin/components/managers/ArticleManager";

export const metadata: Metadata = {
  title: "Admin - articles | Ridho",
  robots: "noindex, nofollow",
};

export default function Page() {
  return (
    <div className="animate-[fadeIn_0.5s_ease-out]">
      <ArticleManager />
    </div>
  );
}
