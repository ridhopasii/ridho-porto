"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useParams, useRouter } from "next/navigation";
import {
  TbLayoutDashboard,
  TbNotes,
  TbHistory,
  TbChartBar,
  TbTarget,
  TbPigMoney,
  TbSettings,
  TbWallet,
  TbReceipt2,
  TbLogout,
  TbExternalLink,
  TbMenu2,
  TbX,
  TbChevronRight,
  TbEdit,
  TbCheck,
} from "react-icons/tb";
import ThemeToggle from "@/common/components/layouts/sidebar/ThemeToggle";
import { geist, jetBrainsMono } from "@/common/styles/fonts";

interface PrivateHubLayoutProps {
  children: React.ReactNode;
  editMode?: boolean;
  onEditModeChange?: (val: boolean) => void;
}

const NAV_GROUPS = [
  {
    title: "PRODUKTIVITAS",
    items: [
      { icon: TbNotes,         label: "Harian",           tab: "harian" },
      { icon: TbHistory,       label: "Riwayat",          tab: "riwayat" },
      { icon: TbChartBar,      label: "Tracker",          tab: "tracker" },
      { icon: TbTarget,        label: "Rencana",          tab: "rencana" },
      { icon: TbPigMoney,      label: "Tabungan",         tab: "tabungan" },
      { icon: TbSettings,      label: "Pengaturan Hari",  tab: "pengaturan_hari" },
    ],
  },
  {
    title: "KEUANGAN",
    divider: true,
    items: [
      { icon: TbWallet,   label: "Dompet",     tab: "dompet" },
      { icon: TbReceipt2, label: "Transaksi",  tab: "transaksi" },
    ],
  },
];

const PAGE_TITLES: Record<string, string> = {
  harian: "Harian",
  riwayat: "Riwayat",
  tracker: "Tracker",
  rencana: "Rencana",
  tabungan: "Tabungan",
  pengaturan_hari: "Pengaturan Hari",
  dompet: "Dompet",
  transaksi: "Transaksi",
};

export default function PrivateHubLayout({
  children,
  editMode = false,
  onEditModeChange,
}: PrivateHubLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname() || "";
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) || "id";

  // Detect current tab from pathname or query
  const segments = pathname.split("/");
  const lastSegment = segments[segments.length - 1];
  const currentTab = PAGE_TITLES[lastSegment] ? lastSegment : "harian";
  const pageTitle = PAGE_TITLES[currentTab] ?? "Private Hub";

  const handleTabClick = useCallback(
    (tab: string) => {
      router.push(`/${locale}/private-hub/${tab}`);
      setSidebarOpen(false);
    },
    [router, locale]
  );

  const handleLogout = useCallback(async () => {
    await fetch("/api/private-dashboard/login", { method: "DELETE" });
    router.push(`/${locale}`);
    router.refresh();
  }, [router, locale]);

  return (
    <div
      className={`min-h-screen bg-neutral-50 text-neutral-800 selection:bg-cyan-100 selection:text-cyan-900 dark:bg-[#0a0a0a] dark:text-neutral-200 dark:selection:bg-neutral-800 dark:selection:text-white ${geist.variable} ${jetBrainsMono.variable} font-sans antialiased`}
    >
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-[240px] flex-col border-r border-neutral-200 bg-white py-5 text-neutral-600 transition-transform duration-300 ease-in-out dark:border-neutral-800 dark:bg-[#0a0a0a] dark:text-neutral-400
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="mb-6 flex items-center gap-3 px-5">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-sm">
            <TbLayoutDashboard size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-[13px] font-bold leading-tight text-neutral-900 dark:text-neutral-100">Private Hub</h1>
            <p className="truncate text-[11px] font-medium text-neutral-500">Dashboard Pribadi</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:text-neutral-500 dark:hover:bg-neutral-900 dark:hover:text-neutral-300 lg:hidden"
          >
            <TbX size={16} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {NAV_GROUPS.map((group, gi) => (
            <div key={gi}>
              {group.divider && (
                <hr className="mx-3 mb-4 border-t border-neutral-200 dark:border-neutral-800/60" />
              )}
              <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-600">
                {group.title}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = currentTab === item.tab;
                  return (
                    <button
                      key={item.tab}
                      onClick={() => handleTabClick(item.tab)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] tracking-tight transition-all duration-150
                        ${
                          active
                            ? "border border-cyan-200/60 bg-cyan-50 font-semibold text-cyan-900 shadow-sm dark:border-cyan-800/30 dark:bg-cyan-950/30 dark:text-cyan-300"
                            : "border border-transparent text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-500 dark:hover:bg-neutral-900/50 dark:hover:text-neutral-300"
                        }`}
                    >
                      <item.icon
                        size={16}
                        className={active ? "text-cyan-600 dark:text-cyan-400" : "text-neutral-400 dark:text-neutral-600"}
                      />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-neutral-200 px-3 pt-4 space-y-0.5 dark:border-neutral-800">
          <Link
            href={`/${locale}`}
            target="_blank"
            className="flex items-center gap-3 rounded-lg border border-transparent px-3 py-2 text-[13px] text-neutral-600 transition-all hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-500 dark:hover:bg-neutral-900/50 dark:hover:text-neutral-300"
          >
            <TbExternalLink size={16} className="text-neutral-400 dark:text-neutral-600" />
            Lihat Situs
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg border border-transparent px-3 py-2 text-[13px] text-red-600 transition-all hover:bg-red-50 hover:text-red-700 dark:text-red-500/60 dark:hover:bg-red-950/30 dark:hover:text-red-400"
          >
            <TbLogout size={16} />
            Keluar
          </button>
        </div>
      </aside>

      {/* Topbar */}
      <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-neutral-200 bg-white/90 px-4 backdrop-blur-md dark:border-neutral-800 dark:bg-[#0a0a0a]/90 lg:left-[240px] lg:px-6">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-200 lg:hidden"
            aria-label="Toggle sidebar"
          >
            <TbMenu2 size={20} />
          </button>

          <nav className="flex items-center gap-1.5 text-[13px]">
            <span className="font-medium text-neutral-500">Private Hub</span>
            <TbChevronRight size={13} className="text-neutral-400 dark:text-neutral-700" />
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">{pageTitle}</span>
          </nav>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Kembali ke Web */}
          <Link
            href={`/${locale}`}
            className="hidden items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-neutral-500 transition-all hover:border-neutral-300 hover:text-neutral-800 dark:border-neutral-800 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:text-neutral-200 sm:flex"
          >
            <TbExternalLink size={13} />
            Web
          </Link>

          {/* Edit Mode toggle */}
          {onEditModeChange && (
            <button
              onClick={() => onEditModeChange(!editMode)}
              className={`hidden items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest transition-all sm:flex ${
                editMode
                  ? "border-cyan-300 bg-cyan-50 text-cyan-700 dark:border-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300"
                  : "border-neutral-200 text-neutral-500 hover:border-neutral-300 hover:text-neutral-800 dark:border-neutral-800 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:text-neutral-200"
              }`}
            >
              {editMode ? <TbCheck size={13} /> : <TbEdit size={13} />}
              {editMode ? "Selesai" : "Edit"}
            </button>
          )}


          <ThemeToggle />

          <div className="flex items-center gap-2.5 border-l border-neutral-200 pl-3 dark:border-neutral-800">
            <div className="text-right hidden sm:block">
              <p className="text-[13px] font-semibold leading-none text-neutral-800 dark:text-neutral-200">Ridho</p>
              <p className="mt-0.5 text-[11px] leading-none text-neutral-500">Private</p>
            </div>
            <div className="h-8 w-8 overflow-hidden rounded-full border border-neutral-200 shadow-sm dark:border-neutral-700">
              <Image
                src="/profile.webp"
                alt="Profile"
                width={32}
                height={32}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-16 lg:ml-[240px] min-h-screen">
        {children}
      </main>
    </div>
  );
}
