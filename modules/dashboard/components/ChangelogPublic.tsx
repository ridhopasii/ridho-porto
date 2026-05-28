"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { MdHistory as HistoryIcon } from "react-icons/md";
import SectionHeading from "@/common/components/elements/SectionHeading";
import SectionSubHeading from "@/common/components/elements/SectionSubHeading";

export default function ChangelogPublic() {
  const [changelogs, setChangelogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    (process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"),
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder"),
  );

  useEffect(() => {
    async function fetchChangelogs() {
      try {
        const { data, error } = await supabase
          .from("Changelog")
          .select("*")
          .order("date", { ascending: false });

        if (error) throw error;
        setChangelogs(data || []);
      } catch (err) {
        console.error("Error fetching changelogs:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchChangelogs();
  }, [supabase]);

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <SectionHeading title="Catatan Perubahan" icon={<HistoryIcon size={24} />} />
        <SectionSubHeading>Riwayat pembaruan proyek dan website secara berkala.</SectionSubHeading>
      </div>

      <div className="relative border-l border-neutral-200 dark:border-neutral-800 ml-3 md:ml-2 space-y-8 pt-2">
        {loading ? (
          <div className="space-y-6 pl-6">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse space-y-2">
                <div className="h-5 w-24 bg-neutral-200 dark:bg-neutral-800 rounded" />
                <div className="h-4 w-40 bg-neutral-200 dark:bg-neutral-800 rounded" />
                <div className="h-12 w-full bg-neutral-100 dark:bg-neutral-800/50 rounded" />
              </div>
            ))}
          </div>
        ) : changelogs.length === 0 ? (
          <p className="text-neutral-500 italic ml-6">Belum ada catatan perubahan.</p>
        ) : (
          changelogs.map((log) => (
            <div key={log.id} className="relative pl-6 md:pl-8">
              <div className="absolute w-3 h-3 bg-teal-500 rounded-full -left-[6.5px] top-1.5 border-4 border-white dark:border-neutral-950 shadow-sm"></div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="font-bold text-base lg:text-lg text-neutral-800 dark:text-neutral-200">{log.version}</span>
                <span className="text-xs text-neutral-500">
                  {new Date(log.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
              <div className="text-neutral-600 dark:text-neutral-400 max-w-none text-sm leading-relaxed whitespace-pre-wrap bg-neutral-50/50 dark:bg-neutral-900/30 p-4 rounded-xl border border-neutral-100 dark:border-neutral-900">
                {log.description}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
