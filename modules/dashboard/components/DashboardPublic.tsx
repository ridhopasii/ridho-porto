"use client";

import { useState, useEffect } from "react";
import { FaChartBar, FaCode, FaTools, FaHistory } from "react-icons/fa";

import Codewars from "./Codewars";
import Monkeytype from "./Monkeytype";
import CodingActive from "./CodingActive";
import Contributions from "./Contributions";
import Uses from "./Uses/Uses";
import ChangelogPublic from "./ChangelogPublic";

import Breakline from "@/common/components/elements/Breakline";
import { GITHUB_ACCOUNTS } from "@/common/constants/github";
import { CODEWARS_ACCOUNT } from "@/common/constants/codewars";
import Umami from "./Umami";

type TabType = "analitik" | "koding" | "peralatan" | "perubahan";

const DashboardPublic = () => {
  const [activeTab, setActiveTab] = useState<TabType>("koding");

  useEffect(() => {
    const segments = window.location.pathname.split("/");
    const lastSegment = segments[segments.length - 1];
    
    if (["koding", "analitik", "peralatan", "perubahan"].includes(lastSegment)) {
      setActiveTab(lastSegment as TabType);
    } else if (lastSegment === "dashboard") {
      setActiveTab("koding");
    }
  }, []);

  const handleTabChange = (tabId: TabType) => {
    setActiveTab(tabId);
    const segments = window.location.pathname.split("/");
    const locale = segments[1] || "id";
    window.history.pushState(null, "", `/${locale}/dashboard/${tabId}`);
  };

  const tabs = [
    { id: "koding" as TabType, label: "Aktivitas Koding", icon: <FaCode size={14} /> },
    { id: "analitik" as TabType, label: "Analitik", icon: <FaChartBar size={14} /> },
    { id: "peralatan" as TabType, label: "Peralatan", icon: <FaTools size={14} /> },
    { id: "perubahan" as TabType, label: "Catatan Perubahan", icon: <FaHistory size={14} /> },
  ];

  return (
    <div className="space-y-6">
      {/* Segmented Tab Navigation */}
      <div className="w-full rounded-xl bg-neutral-100 p-1 dark:bg-neutral-800 yellow:bg-amber-100 ramadan:bg-emerald-950/80 valentine:bg-rose-100">
        <div className="relative grid grid-cols-4 gap-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`relative flex w-full items-center justify-center gap-2 rounded-lg px-2 py-2.5 text-xs lg:text-sm font-semibold transition-colors duration-200 focus:outline-none ${
                  isActive
                    ? "text-neutral-800 dark:text-neutral-100 yellow:text-amber-900 ramadan:text-amber-200 valentine:text-white"
                    : "text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 yellow:text-amber-600/60 yellow:hover:text-amber-700 ramadan:text-amber-500/50 ramadan:hover:text-amber-400 valentine:text-rose-400/60 valentine:hover:text-rose-500"
                }`}
              >
                {isActive && (
                  <div className="absolute inset-0 rounded-lg bg-white shadow-sm dark:bg-neutral-700 yellow:bg-amber-400 ramadan:bg-emerald-700 valentine:bg-rose-500" />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  {tab.icon}
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-2">
        {activeTab === "analitik" && (
          <div data-aos="fade-up">
            <Umami />
          </div>
        )}

        {activeTab === "koding" && (
          <div className="space-y-8" data-aos="fade-up">
            <Contributions endpoint={GITHUB_ACCOUNTS.endpoint} />
            <Breakline className="my-8" />
            <CodingActive />
            <Breakline className="my-8" />
            <Codewars endpoint={CODEWARS_ACCOUNT.endpoint} />
            <Breakline className="my-8" />
            <Monkeytype />
          </div>
        )}

        {activeTab === "peralatan" && (
          <div data-aos="fade-up">
            <Uses />
          </div>
        )}

        {activeTab === "perubahan" && (
          <div data-aos="fade-up">
            <ChangelogPublic />
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPublic;
