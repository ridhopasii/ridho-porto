"use client";

import { useState } from "react";
import { FaBriefcase, FaGraduationCap, FaUsers } from "react-icons/fa";

interface ResumeTabsProps {
  careerList: React.ReactNode;
  educationList: React.ReactNode;
  organizationList: React.ReactNode;
}

const ResumeTabs = ({ careerList, educationList, organizationList }: ResumeTabsProps) => {
  const [activeTab, setActiveTab] = useState<"karir" | "pendidikan" | "organisasi">("karir");

  return (
    <div className="space-y-6">
      {/* Tabs Menu */}
      <div className="w-full rounded-xl bg-neutral-100 p-1 dark:bg-neutral-800 yellow:bg-amber-100 ramadan:bg-emerald-950/80 valentine:bg-rose-100">
        <div className="relative grid grid-cols-3 gap-1">
          <button
            onClick={() => setActiveTab("karir")}
            className={`relative flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors duration-200 ${
              activeTab === "karir"
                ? "text-neutral-800 dark:text-neutral-100 yellow:text-amber-900 ramadan:text-amber-200 valentine:text-white"
                : "text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 yellow:text-amber-600/60 yellow:hover:text-amber-700 ramadan:text-amber-500/50 ramadan:hover:text-amber-400 valentine:text-rose-400/60 valentine:hover:text-rose-500"
            }`}
          >
            {activeTab === "karir" && (
              <div className="absolute inset-0 rounded-lg bg-white shadow-sm dark:bg-neutral-700 yellow:bg-amber-400 ramadan:bg-emerald-700 valentine:bg-rose-500" />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <FaBriefcase size={14} />
              Karir
            </span>
          </button>
          
          <button
            onClick={() => setActiveTab("pendidikan")}
            className={`relative flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors duration-200 ${
              activeTab === "pendidikan"
                ? "text-neutral-800 dark:text-neutral-100 yellow:text-amber-900 ramadan:text-amber-200 valentine:text-white"
                : "text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 yellow:text-amber-600/60 yellow:hover:text-amber-700 ramadan:text-amber-500/50 ramadan:hover:text-amber-400 valentine:text-rose-400/60 valentine:hover:text-rose-500"
            }`}
          >
            {activeTab === "pendidikan" && (
              <div className="absolute inset-0 rounded-lg bg-white shadow-sm dark:bg-neutral-700 yellow:bg-amber-400 ramadan:bg-emerald-700 valentine:bg-rose-500" />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <FaGraduationCap size={14} />
              Pendidikan
            </span>
          </button>

          <button
            onClick={() => setActiveTab("organisasi")}
            className={`relative flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors duration-200 ${
              activeTab === "organisasi"
                ? "text-neutral-800 dark:text-neutral-100 yellow:text-amber-900 ramadan:text-amber-200 valentine:text-white"
                : "text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 yellow:text-amber-600/60 yellow:hover:text-amber-700 ramadan:text-amber-500/50 ramadan:hover:text-amber-400 valentine:text-rose-400/60 valentine:hover:text-rose-500"
            }`}
          >
            {activeTab === "organisasi" && (
              <div className="absolute inset-0 rounded-lg bg-white shadow-sm dark:bg-neutral-700 yellow:bg-amber-400 ramadan:bg-emerald-700 valentine:bg-rose-500" />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <FaUsers size={14} />
              Organisasi
            </span>
          </button>
        </div>
      </div>

      {/* Tabs Contents */}
      <div className="overflow-x-clip pt-2">
        <div className={`transition-opacity duration-300 ${activeTab === "karir" ? "block animate-[fadeIn_0.5s_ease-out]" : "hidden"}`}>
          {careerList}
        </div>
        
        <div className={`transition-opacity duration-300 ${activeTab === "pendidikan" ? "block animate-[fadeIn_0.5s_ease-out]" : "hidden"}`}>
          {educationList}
        </div>

        <div className={`transition-opacity duration-300 ${activeTab === "organisasi" ? "block animate-[fadeIn_0.5s_ease-out]" : "hidden"}`}>
          {organizationList}
        </div>
      </div>
    </div>
  );
};

export default ResumeTabs;
