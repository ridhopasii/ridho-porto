"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

import { LazyMotion, domMax } from "framer-motion";
import ChatButton from "../../../modules/chat/components/ChatButton";
import PrivateHubButton from "../../../modules/dashboard/components/PrivateHubButton";

import Sidebar from "./sidebar";
import AdminLayout from "../../../modules/dashboard/components/admin/AdminLayout";


const Notif = dynamic(() => import("../elements/Notif"), { ssr: false });

interface LayoutsProps {
  children: React.ReactNode;
}

const Layouts = ({ children }: LayoutsProps) => {
  const pathname = usePathname();

  const isShowChatButton = pathname !== "/chat" && !pathname.endsWith("/dashboard");
  const isStandalonePage = pathname.endsWith("/links");
  const isAdminPage = pathname.includes("/admin");

  if (isAdminPage) {
    return <AdminLayout>{children}</AdminLayout>;
  }

  if (isStandalonePage) {
    return <LazyMotion features={domMax}>{children}</LazyMotion>;
  }

  return (
    <LazyMotion features={domMax}>
      <div className="relative mx-auto max-w-7xl lg:px-12">
        <div className="mx-auto flex flex-col lg:flex-row lg:gap-8 lg:py-8">
          <Sidebar />
          <main className="relative w-full max-w-[854px] transition-all duration-300 lg:w-4/5">
            {/* Elegant glass container for the main content */}
            <div className="min-h-screen w-full rounded-3xl border border-neutral-200/50 bg-white/40 p-4 shadow-sm backdrop-blur-xl dark:border-neutral-800/50 dark:bg-neutral-900/40 md:p-8">
              {children}
            </div>
          </main>
        </div>
        <Notif />
        {isShowChatButton && <ChatButton />}
        <PrivateHubButton />
      </div>
    </LazyMotion>
  );
};

export default Layouts;
