"use client";

import { useState } from "react";
import { FaInstagram, FaTiktok } from "react-icons/fa";

import Tiktok from "./Tiktok";

const Creations = () => {
  const [activeTab, setActiveTab] = useState<"tiktok" | "instagram">("tiktok");

  return (
    <div className="space-y-5">
      <div className="w-full rounded-xl bg-neutral-100 p-1 dark:bg-neutral-800 yellow:bg-amber-100 ramadan:bg-emerald-950/80 valentine:bg-rose-100">
        <div className="relative grid grid-cols-2 gap-1">
          <button
            onClick={() => setActiveTab("tiktok")}
            className={`relative flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors duration-200 ${
              activeTab === "tiktok"
                ? "text-neutral-800 dark:text-neutral-100 yellow:text-amber-900 ramadan:text-amber-200 valentine:text-white"
                : "text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 yellow:text-amber-600/60 yellow:hover:text-amber-700 ramadan:text-amber-500/50 ramadan:hover:text-amber-400 valentine:text-rose-400/60 valentine:hover:text-rose-500"
            }`}
          >
            {activeTab === "tiktok" && (
              <div className="absolute inset-0 rounded-lg bg-white shadow-sm dark:bg-neutral-700 yellow:bg-amber-400 ramadan:bg-emerald-700 valentine:bg-rose-500" />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <FaTiktok size={15} />
              TikTok
            </span>
          </button>
          <button
            onClick={() => setActiveTab("instagram")}
            className={`relative flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors duration-200 ${
              activeTab === "instagram"
                ? "text-neutral-800 dark:text-neutral-100 yellow:text-amber-900 ramadan:text-amber-200 valentine:text-white"
                : "text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 yellow:text-amber-600/60 yellow:hover:text-amber-700 ramadan:text-amber-500/50 ramadan:hover:text-amber-400 valentine:text-rose-400/60 valentine:hover:text-rose-500"
            }`}
          >
            {activeTab === "instagram" && (
              <div className="absolute inset-0 rounded-lg bg-white shadow-sm dark:bg-neutral-700 yellow:bg-amber-400 ramadan:bg-emerald-700 valentine:bg-rose-500" />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <FaInstagram size={15} />
              Instagram
            </span>
          </button>
        </div>
      </div>

      <div className="overflow-x-clip">
        {activeTab === "tiktok" && <Tiktok />}
        {activeTab === "instagram" && (
          <div className="flex flex-col items-center justify-center py-10 text-neutral-500 dark:text-neutral-400">
            <FaInstagram size={48} className="mb-4 opacity-50" />
            <p>Instagram content coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Creations;
