"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { createBrowserClient } from "@supabase/ssr";

// Modules
import ProjectManager from "./managers/ProjectManager";
import AwardManager from "./managers/AwardManager";
import GuestbookManager from "./managers/GuestbookManager";
import UsesManager from "./managers/UsesManager";
import LinkManager from "./managers/LinkManager";
import ChangelogManager from "./managers/ChangelogManager";
import PageContentManager from "./managers/PageContentManager";
import ContactManager from "./managers/ContactManager";

const TABS = [
  { id: "projects", label: "Proyek" },
  { id: "achievements", label: "Pencapaian" },
  { id: "home", label: "Beranda (Teks)" },
  { id: "about", label: "Tentang (Teks)" },
  { id: "guestbook", label: "Buku Tamu" },
  { id: "uses", label: "Peralatan" },
  { id: "links", label: "Tautan" },
  { id: "changelog", label: "Catatan Perubahan" },
  { id: "contact", label: "Pesan Kontak" },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  return (
    <div className="flex flex-col md:flex-row gap-6 min-h-[70vh]">
      {/* Sidebar */}
      <div className="w-full md:w-64 flex-shrink-0 bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
        <h3 className="font-bold text-lg mb-4 px-2">Master CMS</h3>
        <nav className="flex flex-col gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-left px-4 py-2 rounded-lg text-sm transition-colors ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white font-medium shadow-sm"
                  : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow bg-neutral-50 dark:bg-neutral-900/50 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">{TABS.find(t => t.id === activeTab)?.label}</h2>
          <p className="text-sm text-neutral-500">Kelola data {TABS.find(t => t.id === activeTab)?.label.toLowerCase()} kamu di sini.</p>
        </div>

        {activeTab === "projects" && <ProjectManager />}
        {activeTab === "achievements" && <AwardManager />}
        {activeTab === "home" && <PageContentManager page="home" />}
        {activeTab === "about" && <PageContentManager page="about" />}
        {activeTab === "guestbook" && <GuestbookManager />}
        {activeTab === "uses" && <UsesManager />}
        {activeTab === "links" && <LinkManager />}
        {activeTab === "changelog" && <ChangelogManager />}
        {activeTab === "contact" && <ContactManager />}
      </div>
    </div>
  );
}
