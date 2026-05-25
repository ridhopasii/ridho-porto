"use client";

import React, { useState } from "react";
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
import ServiceManager from "./managers/ServiceManager";

type AdminTab =
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
  | "services";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>("projects");

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
  ];

  const renderContent = () => {
    switch (activeTab) {
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
        return <PageContentManager page="home" />;
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
      default:
        return <div>Select a module</div>;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50 dark:bg-neutral-950 md:flex-row">
      {/* Sidebar */}
      <aside className="flex w-full flex-col border-r border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900 md:w-64">
        <div className="border-b border-neutral-200 p-5 dark:border-neutral-800">
          <h2 className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-xl font-bold text-transparent">
            Master CMS
          </h2>
          <p className="mt-1 text-xs text-neutral-500">
            Manage your entire portfolio
          </p>
        </div>

        <div className="flex-1 space-y-1 overflow-y-auto p-3">
          {tabs.map((tab, idx) => (
            <React.Fragment key={tab.id}>
              {tab.category && (
                <p
                  className={`mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-neutral-400 ${idx > 0 ? "mt-4" : ""}`}
                >
                  {tab.category}
                </p>
              )}
              <button
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-50 font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            </React.Fragment>
          ))}
        </div>

        <div className="border-t border-neutral-200 p-4 dark:border-neutral-800">
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-10">
        <div className="mx-auto max-w-6xl">
          <header className="mb-8">
            <h1 className="text-3xl font-bold">
              {tabs.find((t) => t.id === activeTab)?.label}
            </h1>
            <p className="mt-2 text-neutral-500">
              Manage content for this section across your website.
            </p>
          </header>

          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}
