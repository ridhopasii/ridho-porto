"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { FiFileText, FiBriefcase, FiMessageSquare, FiEye } from "react-icons/fi";
import { motion } from "framer-motion";

export default function OverviewManager() {
  const [stats, setStats] = useState({
    projects: 0,
    articles: 0,
    guestbook: 0,
  });
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    (process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"),
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder")
  );

  useEffect(() => {
    async function fetchStats() {
      const { count: projectCount } = await supabase.from("Project").select("*", { count: "exact", head: true });
      const { count: articleCount } = await supabase.from("Article").select("*", { count: "exact", head: true });
      const { count: guestbookCount } = await supabase.from("Guestbook").select("*", { count: "exact", head: true });
      
      setStats({
        projects: projectCount || 0,
        articles: articleCount || 0,
        guestbook: guestbookCount || 0,
      });
      setLoading(false);
    }
    fetchStats();
  }, []);

  const cards = [
    { title: "Total Proyek", value: stats.projects, icon: <FiBriefcase className="w-6 h-6 text-indigo-500" />, color: "from-indigo-500/10 to-blue-500/5", border: "border-indigo-100 dark:border-indigo-900/30" },
    { title: "Total Artikel", value: stats.articles, icon: <FiFileText className="w-6 h-6 text-emerald-500" />, color: "from-emerald-500/10 to-teal-500/5", border: "border-emerald-100 dark:border-emerald-900/30" },
    { title: "Pesan Buku Tamu", value: stats.guestbook, icon: <FiMessageSquare className="w-6 h-6 text-amber-500" />, color: "from-amber-500/10 to-orange-500/5", border: "border-amber-100 dark:border-amber-900/30" },
    { title: "Total Kunjungan", value: "24.5K", icon: <FiEye className="w-6 h-6 text-rose-500" />, color: "from-rose-500/10 to-pink-500/5", border: "border-rose-100 dark:border-rose-900/30" },
  ];

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div></div>;
  }

  return (
    <div className="space-y-8">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, idx) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.4 }}
            className={`relative overflow-hidden rounded-2xl border ${card.border} bg-gradient-to-br ${card.color} p-6 shadow-sm backdrop-blur-xl dark:bg-neutral-900`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">{card.title}</p>
                <p className="mt-2 text-3xl font-bold text-neutral-900 dark:text-white">{card.value}</p>
              </div>
              <div className="rounded-full bg-white/50 p-3 shadow-sm backdrop-blur-md dark:bg-black/20">
                {card.icon}
              </div>
            </div>
            {/* Decorative blob */}
            <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-white/20 blur-2xl dark:bg-white/5" />
          </motion.div>
        ))}
      </div>

      {/* Fake Chart & Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Chart Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="col-span-1 flex flex-col rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50 lg:col-span-2"
        >
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">Statistik Pengunjung (Simulasi)</h3>
            <select className="rounded-lg border border-neutral-200 bg-transparent px-3 py-1 text-sm dark:border-neutral-800">
              <option>7 Hari Terakhir</option>
              <option>30 Hari Terakhir</option>
            </select>
          </div>
          
          <div className="flex flex-1 items-end gap-2 sm:gap-4 h-48 w-full mt-4">
            {[40, 70, 45, 90, 65, 85, 110].map((height, i) => (
              <div key={i} className="group relative flex flex-1 flex-col justify-end">
                <div 
                  className="w-full rounded-t-md bg-blue-100 transition-all duration-300 hover:bg-blue-300 dark:bg-blue-900/40 dark:hover:bg-blue-700/60" 
                  style={{ height: `${height}%` }}
                />
                {/* Fake tooltip on hover */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 rounded bg-neutral-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {height * 12} views
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="col-span-1 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50"
        >
          <h3 className="mb-6 text-lg font-semibold text-neutral-800 dark:text-neutral-200">Aktivitas Terkini</h3>
          <div className="space-y-6">
            {[
              { title: "Buku Tamu Baru", desc: "Seseorang baru saja mengisi buku tamu.", time: "2 jam lalu", color: "bg-amber-500" },
              { title: "Proyek Diperbarui", desc: "Proyek 'Portfolio v2' berhasil disimpan.", time: "5 jam lalu", color: "bg-blue-500" },
              { title: "Login Berhasil", desc: "Sesi admin baru dimulai dari Jakarta.", time: "12 jam lalu", color: "bg-emerald-500" },
            ].map((act, i) => (
              <div key={i} className="flex gap-4">
                <div className="relative mt-1 flex h-4 w-4 shrink-0 items-center justify-center">
                  <span className={`absolute h-full w-full animate-ping rounded-full ${act.color} opacity-20`}></span>
                  <span className={`h-2 w-2 rounded-full ${act.color}`}></span>
                  {/* Timeline vertical line */}
                  {i !== 2 && <div className="absolute left-1/2 top-4 -ml-px h-10 w-[2px] bg-neutral-100 dark:bg-neutral-800" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{act.title}</p>
                  <p className="text-xs text-neutral-500">{act.desc}</p>
                  <p className="mt-1 text-xs text-neutral-400">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
