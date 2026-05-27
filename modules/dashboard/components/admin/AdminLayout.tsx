"use client";

import React, { useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import { geist, jetBrainsMono } from "@/common/styles/fonts";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Apply fonts to the layout wrapper
  return (
    <div className={`min-h-screen bg-[#0a0a0a] text-neutral-200 selection:bg-neutral-800 selection:text-white ${geist.variable} ${jetBrainsMono.variable} font-admin-body-md`}>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-[256px] pt-16">
        {children}
      </main>
    </div>
  );
}
