"use client";

import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import { geist, jetBrainsMono } from "@/common/styles/fonts";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      className={`min-h-screen bg-neutral-50 text-neutral-800 selection:bg-blue-100 selection:text-blue-900 dark:bg-[#0a0a0a] dark:text-neutral-200 dark:selection:bg-neutral-800 dark:selection:text-white ${geist.variable} ${jetBrainsMono.variable} font-admin-body-md`}
    >
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <AdminTopbar onMenuToggle={() => setSidebarOpen((v) => !v)} />
      <main className="pt-16 lg:ml-[256px] min-h-screen">{children}</main>
    </div>
  );
}
