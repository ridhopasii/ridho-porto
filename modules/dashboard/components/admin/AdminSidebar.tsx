"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { 
  TbHome, TbInfoCircle, 
  TbFolder, TbMedal, TbPhoto,
  TbSchool, TbBriefcase, TbUsers, TbCode, TbShare,
  TbArticle, TbBook, TbListDetails,
  TbNotebook, TbMail, TbStar,
  TbTools, TbLink, TbHistory,
  TbUserEdit, TbSettings, TbShieldLock,
  TbWallet, TbListCheck, TbTarget, TbCalendarEvent,
  TbLogout, TbPlus
} from "react-icons/tb";

export default function AdminSidebar() {
  const pathname = usePathname() || "";
  const params = useParams();
  const locale = params?.locale || "id";
  const basePath = `/${locale}/admin`;

  const menuGroups = [
    {
      title: "UTAMA",
      items: [
        { icon: TbHome, label: "Overview", href: `${basePath}` },
        { icon: TbHome, label: "Beranda", href: `${basePath}/home` },
        { icon: TbInfoCircle, label: "Tentang", href: `${basePath}/about` },
      ]
    },
    {
      title: "PORTFOLIO",
      items: [
        { icon: TbFolder, label: "Proyek", href: `${basePath}/projects` },
        { icon: TbMedal, label: "Pencapaian", href: `${basePath}/awards` },
        { icon: TbPhoto, label: "Galeri Foto", href: `${basePath}/gallery` },
      ]
    },
    {
      title: "PROFIL",
      items: [
        { icon: TbSchool, label: "Pendidikan", href: `${basePath}/education` },
        { icon: TbBriefcase, label: "Pengalaman Kerja", href: `${basePath}/experience` },
        { icon: TbUsers, label: "Organisasi", href: `${basePath}/organization` },
        { icon: TbCode, label: "Keahlian", href: `${basePath}/skills` },
        { icon: TbShare, label: "Sosial Media", href: `${basePath}/social` },
      ]
    },
    {
      title: "KONTEN",
      items: [
        { icon: TbArticle, label: "Blog & Artikel", href: `${basePath}/articles` },
        { icon: TbBook, label: "Publikasi Eksternal", href: `${basePath}/publications` },
        { icon: TbListDetails, label: "Layanan", href: `${basePath}/services` },
      ]
    },
    {
      title: "INTERAKSI",
      items: [
        { icon: TbNotebook, label: "Buku Tamu", href: `${basePath}/guestbook` },
        { icon: TbMail, label: "Pesan Kontak", href: `${basePath}/contact` },
        { icon: TbStar, label: "Testimoni", href: `${basePath}/testimonials` },
      ]
    },
    {
      title: "LAINNYA",
      items: [
        { icon: TbTools, label: "Peralatan", href: `${basePath}/uses` },
        { icon: TbLink, label: "Tautan", href: `${basePath}/links` },
        { icon: TbHistory, label: "Catatan Perubahan", href: `${basePath}/changelog` },
      ]
    },
    {
      title: "PENGATURAN",
      divider: true,
      items: [
        { icon: TbUserEdit, label: "Profil & Identitas", href: `${basePath}/profile` },
        { icon: TbSettings, label: "Pengaturan Global", href: `${basePath}/settings` },
        { icon: TbShieldLock, label: "Keamanan", href: `${basePath}/security` },
      ]
    },
    {
      title: "PRIVATE HUB",
      divider: true,
      items: [
        { icon: TbWallet, label: "Keuangan", href: `${basePath}/finance` },
        { icon: TbListCheck, label: "Produktivitas Harian", href: `${basePath}/productivity` },
        { icon: TbTarget, label: "Habit & Tracker", href: `${basePath}/habits` },
        { icon: TbCalendarEvent, label: "Perencanaan", href: `${basePath}/planning` },
      ]
    }
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-[256px] bg-[#0a0a0a] border-r border-neutral-800 flex flex-col py-6 z-50 text-neutral-400">
      <div className="mb-8 px-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-black">
          <TbSettings size={18} />
        </div>
        <div>
          <h1 className="text-[14px] text-neutral-100 font-bold leading-tight">Admin Panel</h1>
          <p className="text-[11px] text-neutral-500 font-medium">Portfolio CMS</p>
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto custom-scrollbar px-3 space-y-6 pb-6">
        {menuGroups.map((group, groupIdx) => (
          <div key={groupIdx}>
            {group.divider && <hr className="border-t border-neutral-800/50 my-4 mx-3" />}
            <div className="px-3 mb-2">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500">
                {group.title}
              </span>
            </div>
            <div className="space-y-0.5">
              {group.items.map((item, idx) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={idx}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-neutral-900 text-neutral-100 font-semibold shadow-sm border border-neutral-800"
                        : "text-neutral-500 hover:bg-neutral-900/50 hover:text-neutral-300 border border-transparent"
                    }`}
                  >
                    <item.icon size={18} className={isActive ? "text-neutral-200" : "text-neutral-500 group-hover:text-neutral-400"} />
                    <span className="text-[13px] tracking-tight">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
