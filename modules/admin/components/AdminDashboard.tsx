"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiSearch, FiBell, FiLogOut } from "react-icons/fi";

import ProjectManager from "./managers/ProjectManager";
import AwardManager from "./managers/AwardManager";
import GuestbookManager from "./managers/GuestbookManager";
import UsesManager from "./managers/UsesManager";
import LinkManager from "./managers/LinkManager";
import ChangelogManager from "./managers/ChangelogManager";
import PageContentManager from "./managers/PageContentManager";
import ContactManager from "./managers/ContactManager";
import EducationManager from "./managers/EducationManager";
import ExperienceManager from "./managers/ExperienceManager";
import OrganizationManager from "./managers/OrganizationManager";
import SkillManager from "./managers/SkillManager";
import SocialManager from "./managers/SocialManager";
import ArticleManager from "./managers/ArticleManager";
import GalleryManager from "./managers/GalleryManager";
import TestimonialManager from "./managers/TestimonialManager";
import ProfileManager from "./managers/ProfileManager";
import SiteSettingsManager from "./managers/SiteSettingsManager";
import SecurityManager from "./SecurityManager";
import FinanceManager from "./managers/FinanceManager";
import ProductivityManager from "./managers/ProductivityManager";
import HabitsManager from "./managers/HabitsManager";
import PlanningManager from "./managers/PlanningManager";
import PublicationManager from "./managers/PublicationManager";
import OverviewManager from "./managers/OverviewManager";
import ServiceManager from "./managers/ServiceManager";
import ThemeToggle from "@/common/components/layouts/sidebar/ThemeToggle";

type AdminTab =
  | "overview"
  | "projects"
  | "awards"
  | "home_text"
  | "about_text"
  | "guestbook"
  | "uses"
  | "links"
  | "changelog"
  | "contact"
  | "education"
  | "experience"
  | "organization"
  | "skills"
  | "social"
  | "articles"
  | "gallery"
  | "testimonials"
  | "services"
  | "profile"
  | "settings"
  | "security"
  | "finance"
  | "productivity"
  | "habits"
  | "planning"
  | "publications";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    window.location.reload();
  };

  const tabs: {
    id: AdminTab;
    label: string;
    icon: string;
    category?: string;
  }[] = [
    { category: "Dashboard", id: "overview", label: "Ringkasan (Overview)", icon: "📊" },
    { category: "Portfolio", id: "projects", label: "Proyek", icon: "🚀" },
    { id: "awards", label: "Pencapaian", icon: "🏆" },
    { id: "gallery", label: "Galeri Foto", icon: "📸" },

    {
      category: "Profile Data",
      id: "education",
      label: "Pendidikan",
      icon: "🎓",
    },
    { id: "experience", label: "Pengalaman Kerja", icon: "💼" },
    { id: "organization", label: "Organisasi", icon: "🏢" },
    { id: "skills", label: "Keahlian (Skills)", icon: "⚡" },
    { id: "social", label: "Sosial Media", icon: "🔗" },

    {
      category: "Content & Blog",
      id: "articles",
      label: "Blog & Artikel",
      icon: "✍️",
    },
    { id: "publications", label: "Publikasi Eksternal", icon: "📰" },
    { id: "services", label: "Layanan (Services)", icon: "🤝" },
    { id: "home_text", label: "Beranda (Teks)", icon: "🏠" },
    { id: "about_text", label: "Tentang (Teks)", icon: "📖" },

    {
      category: "Interactions",
      id: "guestbook",
      label: "Buku Tamu",
      icon: "📝",
    },
    { id: "contact", label: "Pesan Kontak", icon: "✉️" },
    { id: "testimonials", label: "Testimoni", icon: "⭐" },

    { category: "Others", id: "uses", label: "Peralatan (Uses)", icon: "💻" },
    { id: "links", label: "Tautan (Links)", icon: "🔗" },
    { id: "changelog", label: "Catatan Perubahan", icon: "🔄" },

    { category: "Settings & System", id: "profile", label: "Profil & Identitas", icon: "👤" },
    { id: "settings", label: "Pengaturan Global", icon: "⚙️" },
    { id: "security", label: "Keamanan (Security)", icon: "🔒" },

    { category: "Private Hub", id: "finance", label: "Keuangan (Finance)", icon: "💰" },
    { id: "productivity", label: "Produktivitas Harian", icon: "⏱️" },
    { id: "habits", label: "Habit & Tracker", icon: "📅" },
    { id: "planning", label: "Perencanaan Masa Depan", icon: "🎯" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewManager />;
      case "projects":
        return <ProjectManager />;
      case "awards":
        return <AwardManager />;
      case "guestbook":
        return <GuestbookManager />;
      case "uses":
        return <UsesManager />;
      case "links":
        return <LinkManager />;
      case "changelog":
        return <ChangelogManager />;
      case "contact":
        return <ContactManager />;
      case "home_text":
        return <PageContentManager page="home" /> ;
      case "about_text":
        return <PageContentManager page="about" />;
      case "education":
        return <EducationManager />;
      case "experience":
        return <ExperienceManager />;
      case "organization":
        return <OrganizationManager />;
      case "skills":
        return <SkillManager />;
      case "social":
        return <SocialManager />;
      case "articles":
        return <ArticleManager />;
      case "gallery":
        return <GalleryManager />;
      case "testimonials":
        return <TestimonialManager />;
      case "services":
        return <ServiceManager />;
      case "profile":
        return <ProfileManager />;
      case "settings":
        return <SiteSettingsManager />;
      case "security":
        return <SecurityManager />;
      case "finance":
        return <FinanceManager />;
      case "productivity":
        return <ProductivityManager />;
      case "habits":
        return <HabitsManager />;
      case "planning":
        return <PlanningManager />;
      case "publications":
        return <PublicationManager />;
      default:
        return <div>Pilih Modul</div>;
    }
  };

  if (!isMounted) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50 dark:bg-[#0a0a0a]">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-neutral-200 bg-white shadow-xl transition-transform duration-300 dark:border-neutral-800 dark:bg-[#111111] lg:static lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-neutral-100 p-6 dark:border-neutral-800">
          <div>
            <h2 className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-2xl font-bold text-transparent">
              Master CMS
            </h2>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              Admin Control Panel
            </p>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden">
            <FiX className="h-6 w-6 text-neutral-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {tabs.map((tab, idx) => (
            <React.Fragment key={tab.id}>
              {tab.category && (
                <p
                  className={`mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 ${
                    idx > 0 ? "mt-6" : ""
                  }`}
                >
                  {tab.category}
                </p>
              )}
              <button
                onClick={() => {
                  setActiveTab(tab.id);
                  if (window.innerWidth < 1024) setIsSidebarOpen(false);
                }}
                className={`relative flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-blue-50 font-semibold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                    : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800/50"
                }`}
              >
                {/* Active Indicator Line */}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 h-full w-1 rounded-r-full bg-blue-500"
                  />
                )}
                <span className="text-lg">{tab.icon}</span>
                {tab.label}
              </button>
            </React.Fragment>
          ))}
        </div>

        <div className="border-t border-neutral-100 p-4 dark:border-neutral-800">
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50/50 px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:bg-red-900/10 dark:hover:bg-red-900/30"
          >
            <FiLogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-neutral-200 bg-white/70 px-6 backdrop-blur-md dark:border-neutral-800 dark:bg-[#0a0a0a]/70">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 lg:hidden"
            >
              <FiMenu className="h-6 w-6" />
            </button>
            
            {/* Breadcrumb */}
            <div className="hidden items-center gap-2 text-sm text-neutral-500 sm:flex">
              <span>Admin</span>
              <span className="text-neutral-300 dark:text-neutral-600">/</span>
              <span className="font-medium text-neutral-800 dark:text-neutral-200">
                {tabs.find((t) => t.id === activeTab)?.label}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Fake Search */}
            <div className="hidden items-center gap-2 rounded-full border border-neutral-200 bg-neutral-100/50 px-4 py-1.5 dark:border-neutral-800 dark:bg-neutral-900 md:flex">
              <FiSearch className="h-4 w-4 text-neutral-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-32 bg-transparent text-sm outline-none placeholder:text-neutral-400 dark:text-white"
              />
            </div>
            
            {/* Notification Bell */}
            <button className="relative rounded-full p-2 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800">
              <FiBell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#0a0a0a]" />
            </button>

            <ThemeToggle />
            
            {/* Profile Avatar */}
            <div className="h-8 w-8 overflow-hidden rounded-full border border-neutral-200 dark:border-neutral-700">
              <img src="/profile.webp" alt="Admin" className="h-full w-full object-cover" />
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10">
          <div className="mx-auto max-w-7xl">
            <header className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                {tabs.find((t) => t.id === activeTab)?.label}
              </h1>
              <p className="mt-2 text-neutral-500">
                {activeTab === "overview" 
                  ? "Welcome back, here's what's happening today." 
                  : "Kelola konten untuk bagian ini di website kamu."}
              </p>
            </header>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="min-h-[500px]"
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
