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
import SkillManager from "./managers/SkillManager";
import SocialManager from "./managers/SocialManager";
import ArticleManager from "./managers/ArticleManager";
import GalleryManager from "./managers/GalleryManager";
import TestimonialManager from "./managers/TestimonialManager";
import ServiceManager from "./managers/ServiceManager";

type AdminTab = 
  | "projects" | "awards" | "home_text" | "about_text" 
  | "guestbook" | "uses" | "links" | "changelog" | "contact"
  | "education" | "experience" | "skills" | "social"
  | "articles" | "gallery" | "testimonials" | "services";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>("projects");

  const handleLogout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    window.location.reload();
  };

  const tabs: { id: AdminTab; label: string; icon: string; category?: string }[] = [
    { category: "Portfolio", id: "projects", label: "Proyek", icon: "🚀" },
    { id: "awards", label: "Pencapaian", icon: "🏆" },
    { id: "gallery", label: "Galeri Foto", icon: "📸" },
    
    { category: "Profile Data", id: "education", label: "Pendidikan", icon: "🎓" },
    { id: "experience", label: "Pengalaman Kerja", icon: "💼" },
    { id: "skills", label: "Keahlian (Skills)", icon: "⚡" },
    { id: "social", label: "Sosial Media", icon: "🔗" },

    { category: "Content & Blog", id: "articles", label: "Blog & Artikel", icon: "✍️" },
    { id: "services", label: "Layanan (Services)", icon: "🤝" },
    { id: "home_text", label: "Beranda (Teks)", icon: "🏠" },
    { id: "about_text", label: "Tentang (Teks)", icon: "📖" },
    
    { category: "Interactions", id: "guestbook", label: "Buku Tamu", icon: "📝" },
    { id: "contact", label: "Pesan Kontak", icon: "✉️" },
    { id: "testimonials", label: "Testimoni", icon: "⭐" },
    
    { category: "Others", id: "uses", label: "Peralatan (Uses)", icon: "💻" },
    { id: "links", label: "Tautan (Links)", icon: "🔗" },
    { id: "changelog", label: "Catatan Perubahan", icon: "🔄" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "projects": return <ProjectManager />;
      case "awards": return <AwardManager />;
      case "guestbook": return <GuestbookManager />;
      case "uses": return <UsesManager />;
      case "links": return <LinkManager />;
      case "changelog": return <ChangelogManager />;
      case "contact": return <ContactManager />;
      case "home_text": return <PageContentManager page="home" />;
      case "about_text": return <PageContentManager page="about" />;
      case "education": return <EducationManager />;
      case "experience": return <ExperienceManager />;
      case "skills": return <SkillManager />;
      case "social": return <SocialManager />;
      case "articles": return <ArticleManager />;
      case "gallery": return <GalleryManager />;
      case "testimonials": return <TestimonialManager />;
      case "services": return <ServiceManager />;
      default: return <div>Select a module</div>;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex flex-col shadow-sm">
        <div className="p-5 border-b border-neutral-200 dark:border-neutral-800">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Master CMS</h2>
          <p className="text-xs text-neutral-500 mt-1">Manage your entire portfolio</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {tabs.map((tab, idx) => (
            <React.Fragment key={tab.id}>
              {tab.category && (
                <p className={`text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1 px-3 ${idx > 0 ? "mt-4" : ""}`}>
                  {tab.category}
                </p>
              )}
              <button
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-medium"
                    : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            </React.Fragment>
          ))}
        </div>

        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold">{tabs.find(t => t.id === activeTab)?.label}</h1>
            <p className="text-neutral-500 mt-2">Manage content for this section across your website.</p>
          </header>
          
          <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-800">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}
