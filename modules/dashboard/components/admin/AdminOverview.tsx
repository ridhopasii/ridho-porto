"use client";

import { createClient } from "@/common/utils/client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  TbFolder, TbMedal, TbPhoto, TbSchool, TbBriefcase,
  TbUsers, TbCode, TbShare, TbArticle, TbBook,
  TbListDetails, TbNotebook, TbMail, TbStar,
  TbTools, TbLink, TbHistory, TbUserEdit,
  TbSettings, TbShieldLock, TbWallet, TbListCheck,
  TbTarget, TbCalendarEvent, TbHome, TbArrowUpRight,
} from "react-icons/tb";

const QUICK_NAV = [
  {
    group: "Portfolio",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    items: [
      { label: "Proyek", href: "/admin/projects", icon: TbFolder },
      { label: "Penghargaan", href: "/admin/awards", icon: TbMedal },
      { label: "Galeri Foto", href: "/admin/gallery", icon: TbPhoto },
    ],
  },
  {
    group: "Profil",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    items: [
      { label: "Pendidikan", href: "/admin/education", icon: TbSchool },
      { label: "Pengalaman", href: "/admin/experience", icon: TbBriefcase },
      { label: "Organisasi", href: "/admin/organization", icon: TbUsers },
      { label: "Keahlian", href: "/admin/skills", icon: TbCode },
      { label: "Sosial Media", href: "/admin/social", icon: TbShare },
    ],
  },
  {
    group: "Konten",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    items: [
      { label: "Blog & Artikel", href: "/admin/articles", icon: TbArticle },
      { label: "Publikasi", href: "/admin/publications", icon: TbBook },
      { label: "Layanan", href: "/admin/services", icon: TbListDetails },
      { label: "Peralatan", href: "/admin/uses", icon: TbTools },
      { label: "Tautan", href: "/admin/links", icon: TbLink },
      { label: "Changelog", href: "/admin/changelog", icon: TbHistory },
    ],
  },
  {
    group: "Interaksi",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    items: [
      { label: "Buku Tamu", href: "/admin/guestbook", icon: TbNotebook },
      { label: "Pesan Masuk", href: "/admin/contact", icon: TbMail },
      { label: "Testimoni", href: "/admin/testimonials", icon: TbStar },
    ],
  },
  {
    group: "Pengaturan",
    color: "text-neutral-400",
    bg: "bg-neutral-500/10",
    border: "border-neutral-500/20",
    items: [
      { label: "Beranda", href: "/admin/home", icon: TbHome },
      { label: "Profil & Identitas", href: "/admin/profile", icon: TbUserEdit },
      { label: "Pengaturan Global", href: "/admin/settings", icon: TbSettings },
      { label: "Keamanan", href: "/admin/security", icon: TbShieldLock },
    ],
  },
  {
    group: "Private Hub",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    items: [
      { label: "Keuangan", href: "/admin/finance", icon: TbWallet },
      { label: "Produktivitas", href: "/admin/productivity", icon: TbListCheck },
      { label: "Habit & Tracker", href: "/admin/habits", icon: TbTarget },
      { label: "Perencanaan", href: "/admin/planning", icon: TbCalendarEvent },
    ],
  },
];

interface Stats {
  projects: number;
  skills: number;
  guestbook: number;
  services: number;
}

export default function AdminOverview() {
  const params = useParams();
  const locale = (params?.locale as string) || "id";

  const [stats, setStats] = useState<Stats | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      const [
        { count: projects },
        { count: skills },
        guestbookRes,
        servicesRes,
      ] = await Promise.all([
        supabase.from("Project").select("*", { count: "exact", head: true }),
        supabase.from("Skill").select("*", { count: "exact", head: true }),
        fetch("/api/admin/guestbook"),
        fetch("/api/admin/services"),
      ]);

      const guestbook = guestbookRes.ok
        ? ((await guestbookRes.json()) as unknown[]).length
        : 0;
      const services = servicesRes.ok
        ? ((await servicesRes.json()) as unknown[]).length
        : 0;

      setStats({
        projects: projects ?? 0,
        skills: skills ?? 0,
        guestbook,
        services,
      });
    };
    load();
  }, []);

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-8 p-4 lg:p-6">
      {/* Header */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900/50">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
          {today}
        </p>
        <h1 className="mt-2 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          Selamat datang, Ridho 👋
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Kelola seluruh konten dan pengaturan portofoliomu dari sini.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          {
            label: "Proyek",
            value: stats?.projects,
            href: `/${locale}/admin/projects`,
            color: "text-blue-400",
          },
          {
            label: "Skills",
            value: stats?.skills,
            href: `/${locale}/admin/skills`,
            color: "text-violet-400",
          },
          {
            label: "Layanan",
            value: stats?.services,
            href: `/${locale}/admin/services`,
            color: "text-emerald-400",
          },
          {
            label: "Buku Tamu",
            value: stats?.guestbook,
            href: `/${locale}/admin/guestbook`,
            color: "text-amber-400",
          },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="group flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-4 transition-all hover:border-neutral-300 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:border-neutral-700 dark:hover:bg-neutral-900"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                {item.label}
              </p>
              <TbArrowUpRight
                size={14}
                className="text-neutral-300 transition-colors group-hover:text-neutral-500 dark:text-neutral-700 dark:group-hover:text-neutral-400"
              />
            </div>
            <p className={`mt-3 text-3xl font-black ${item.color}`}>
              {item.value == null ? (
                <span className="inline-block h-8 w-12 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
              ) : (
                item.value
              )}
            </p>
          </Link>
        ))}
      </div>

      {/* Quick Navigation */}
      <div>
        <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-neutral-500">
          Navigasi Cepat
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {QUICK_NAV.map((section) => (
            <div
              key={section.group}
              className={`rounded-xl border ${section.border} bg-white p-4 dark:bg-neutral-900/40`}
            >
              <p
                className={`mb-3 text-[10px] font-bold uppercase tracking-widest ${section.color}`}
              >
                {section.group}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    href={`/${locale}${item.href}`}
                    className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-[13px] text-neutral-600 transition-all hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
                  >
                    <item.icon size={15} className={`flex-shrink-0 ${section.color}`} />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
