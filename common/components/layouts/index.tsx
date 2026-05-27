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
      <div className="mx-auto max-w-7xl lg:px-12">
        <div className="mx-auto flex flex-col lg:flex-row lg:gap-5 lg:py-4">
          <Sidebar />
          <main className="max-w-[854px] transition-all duration-300 lg:w-4/5">
            {children}
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
