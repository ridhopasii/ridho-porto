"use client";

import Link from "next/link";
import { useCallback } from "react";
import { usePathname, useParams, useRouter } from "next/navigation";
import {
  TbHome, TbLayoutDashboard,
  TbFolder, TbMedal, TbPhoto,
  TbSchool, TbBriefcase, TbUsers, TbCode, TbShare,
  TbArticle, TbBook, TbListDetails,
  TbNotebook, TbMail, TbStar,
  TbTools, TbLink, TbHistory,
  TbUserEdit, TbSettings, TbShieldLock,
  TbLogout, TbExternalLink, TbX,
} from "react-icons/tb";


interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname() || "";
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) || "id";
  const base = `/${locale}/admin`;

  const isActive = useCallback(
    (href: string, exact = false) => {
      if (exact) return pathname === href;
      return pathname === href || pathname.startsWith(href + "/");
    },
    [pathname]
  );

  const menuGroups = [
    {
      title: "UTAMA",
      items: [
        { icon: TbLayoutDashboard, label: "Overview", href: base, exact: true },
        { icon: TbHome, label: "Beranda", href: `${base}/home` },
      ],
    },
    {
      title: "PORTFOLIO",
      items: [
        { icon: TbFolder, label: "Proyek", href: `${base}/projects` },
        { icon: TbMedal, label: "Penghargaan", href: `${base}/awards` },
        { icon: TbPhoto, label: "Galeri Foto", href: `${base}/gallery` },
      ],
    },
    {
      title: "PROFIL",
      items: [
        { icon: TbSchool, label: "Pendidikan", href: `${base}/education` },
        { icon: TbBriefcase, label: "Pengalaman Kerja", href: `${base}/experience` },
        { icon: TbUsers, label: "Organisasi", href: `${base}/organization` },
        { icon: TbCode, label: "Keahlian", href: `${base}/skills` },
        { icon: TbShare, label: "Sosial Media", href: `${base}/social` },
      ],
    },
    {
      title: "KONTEN",
      items: [
        { icon: TbArticle, label: "Blog & Artikel", href: `${base}/articles` },
        { icon: TbBook, label: "Publikasi", href: `${base}/publications` },
        { icon: TbListDetails, label: "Layanan", href: `${base}/services` },
        { icon: TbTools, label: "Peralatan", href: `${base}/uses` },
        { icon: TbLink, label: "Tautan", href: `${base}/links` },
        { icon: TbHistory, label: "Changelog", href: `${base}/changelog` },
      ],
    },
    {
      title: "INTERAKSI",
      items: [
        { icon: TbNotebook, label: "Buku Tamu", href: `${base}/guestbook` },
        { icon: TbMail, label: "Pesan Masuk", href: `${base}/contact` },
        { icon: TbStar, label: "Testimoni", href: `${base}/testimonials` },
      ],
    },
    {
      title: "PENGATURAN",
      divider: true,
      items: [
        { icon: TbUserEdit, label: "Profil & Identitas", href: `${base}/profile` },
        { icon: TbSettings, label: "Pengaturan Global", href: `${base}/settings` },
        { icon: TbShieldLock, label: "Keamanan", href: `${base}/security` },
      ],
    },
  ];


  const handleLogout = useCallback(async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push(`/${locale}`);
    router.refresh();
  }, [router, locale]);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-[256px] flex-col border-r border-neutral-200 bg-white py-5 text-neutral-600 transition-transform duration-300 ease-in-out dark:border-neutral-800 dark:bg-[#0a0a0a] dark:text-neutral-400
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Logo & close */}
        <div className="mb-6 flex items-center gap-3 px-5">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-neutral-900 text-white shadow-sm dark:bg-white dark:text-black">
            <TbSettings size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-[13px] font-bold leading-tight text-neutral-900 dark:text-neutral-100">Admin Panel</h1>
            <p className="truncate text-[11px] font-medium text-neutral-500">Portfolio CMS</p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:text-neutral-500 dark:hover:bg-neutral-900 dark:hover:text-neutral-300 lg:hidden"
          >
            <TbX size={16} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {menuGroups.map((group, gi) => (
            <div key={gi}>
              {group.divider && (
                <hr className="mx-3 mb-4 border-t border-neutral-200 dark:border-neutral-800/60" />
              )}
              <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-600">
                {group.title}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = isActive(item.href, (item as any).exact);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] tracking-tight transition-all duration-150
                        ${
                          active
                            ? "border border-neutral-200 bg-neutral-100 font-semibold text-neutral-900 shadow-sm dark:border-neutral-700/50 dark:bg-neutral-900 dark:text-neutral-100"
                            : "border border-transparent text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-500 dark:hover:bg-neutral-900/50 dark:hover:text-neutral-300"
                        }`}
                    >
                      <item.icon
                        size={16}
                        className={active ? "text-neutral-800 dark:text-neutral-200" : "text-neutral-400 dark:text-neutral-600"}
                      />
                      {item.label}
                    </Link>
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
    </>
  );
}
