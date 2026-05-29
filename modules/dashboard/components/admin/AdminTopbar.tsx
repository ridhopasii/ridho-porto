"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { TbMenu2, TbExternalLink, TbChevronRight } from "react-icons/tb";
import ThemeToggle from "@/common/components/layouts/sidebar/ThemeToggle";

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Overview",
  "/admin/home": "Beranda",
  "/admin/projects": "Proyek",
  "/admin/awards": "Penghargaan",
  "/admin/gallery": "Galeri Foto",
  "/admin/education": "Pendidikan",
  "/admin/experience": "Pengalaman Kerja",
  "/admin/organization": "Organisasi",
  "/admin/skills": "Keahlian",
  "/admin/social": "Sosial Media",
  "/admin/articles": "Blog & Artikel",
  "/admin/publications": "Publikasi",
  "/admin/services": "Layanan",
  "/admin/uses": "Peralatan",
  "/admin/links": "Tautan",
  "/admin/changelog": "Changelog",
  "/admin/guestbook": "Buku Tamu",
  "/admin/contact": "Pesan Masuk",
  "/admin/testimonials": "Testimoni",
  "/admin/profile": "Profil & Identitas",
  "/admin/settings": "Pengaturan Global",
  "/admin/security": "Keamanan",
};

interface AdminTopbarProps {
  onMenuToggle: () => void;
}

export default function AdminTopbar({ onMenuToggle }: AdminTopbarProps) {
  const params = useParams();
  const pathname = usePathname() || "";
  const locale = (params?.locale as string) || "id";

  const adminSegment = pathname.replace(`/${locale}`, "");
  const pageTitle = PAGE_TITLES[adminSegment] ?? "Admin";
  const isOverview = adminSegment === "/admin";

  return (
    <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-neutral-200 bg-white/90 px-4 backdrop-blur-md dark:border-neutral-800 dark:bg-[#0a0a0a]/90 lg:left-[256px] lg:px-6">
      {/* Left: hamburger + breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-200 lg:hidden"
          aria-label="Toggle sidebar"
        >
          <TbMenu2 size={20} />
        </button>

        <nav className="flex items-center gap-1.5 text-[13px]">
          <span className="font-medium text-neutral-500">Admin</span>
          {!isOverview && (
            <>
              <TbChevronRight size={13} className="text-neutral-400 dark:text-neutral-700" />
              <span className="font-semibold text-neutral-800 dark:text-neutral-200">{pageTitle}</span>
            </>
          )}
        </nav>
      </div>

      {/* Right: actions + avatar */}
      <div className="flex items-center gap-3">
        <Link
          href={`/${locale}`}
          target="_blank"
          className="hidden items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-neutral-500 transition-all hover:border-neutral-300 hover:text-neutral-800 dark:border-neutral-800 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:text-neutral-200 sm:flex"
        >
          <TbExternalLink size={13} />
          Lihat Situs
        </Link>

        <ThemeToggle />

        <div className="flex items-center gap-2.5 border-l border-neutral-200 pl-3 dark:border-neutral-800">
          <div className="text-right hidden sm:block">
            <p className="text-[13px] font-semibold leading-none text-neutral-800 dark:text-neutral-200">Ridho</p>
            <p className="mt-0.5 text-[11px] leading-none text-neutral-500">Administrator</p>
          </div>
          <div className="h-8 w-8 overflow-hidden rounded-full border border-neutral-200 shadow-sm dark:border-neutral-700">
            <Image
              src="/profile.webp"
              alt="Admin"
              width={32}
              height={32}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
