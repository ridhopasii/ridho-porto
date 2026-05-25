"use client";

import Link from "next/link";
import { m as motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { BiCalendar as CalendarIcon, BiLinkExternal as ExternalIcon } from "react-icons/bi";

import EmptyState from "@/common/components/elements/EmptyState";
import { PublicationItem } from "@/common/types/publication";

interface PublicationsListProps {
  publications: PublicationItem[];
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const PublicationsList = ({ publications }: PublicationsListProps) => {
  const t = useTranslations("AchievementsPage");

  const filteredPublications = publications.filter(
    (item) => item.showOnHome ?? true,
  );

  return (
    <section className="space-y-4">
      <div className="text-sm text-neutral-500 dark:text-neutral-400">
        {t("title")} untuk publikasi, artikel, dan karya tulis yang sudah
        dipublikasikan.
      </div>

      {filteredPublications.length === 0 ? (
        <EmptyState message={t("no_data")} />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredPublications.map((item, index) => (
              <motion.article
                key={item.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25, delay: index * 0.04 }}
                className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-950"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-500/10 text-neutral-400">
                      <span className="text-xs uppercase tracking-[0.3em]">
                        Publication
                      </span>
                    </div>
                  )}

                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-blue-700 shadow-sm backdrop-blur dark:bg-neutral-900/95 dark:text-blue-300">
                    {item.outlet || "Publication"}
                  </span>
                </div>

                <div className="space-y-3 p-5">
                  <div className="space-y-1">
                    <h3 className="line-clamp-2 text-base font-bold text-neutral-900 transition-colors group-hover:text-blue-600 dark:text-neutral-100 dark:group-hover:text-blue-400">
                      {item.title}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {item.description ||
                        "Karya tulis, publikasi, atau artikel yang bisa ditampilkan di halaman pencapaian."}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {item.tags
                      ?.split(",")
                      .map((tag) => tag.trim())
                      .filter(Boolean)
                      .slice(0, 3)
                      .map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[10px] font-medium text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400"
                        >
                          #{tag}
                        </span>
                      ))}
                  </div>

                  <div className="flex items-center justify-between border-t border-neutral-100 pt-3 text-xs text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
                    <span className="flex items-center gap-1.5">
                      <CalendarIcon size={13} />
                      {formatDate(item.createdAt || item.date)}
                    </span>

                    {item.url ? (
                      <Link
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-semibold text-blue-600 transition hover:text-blue-700 dark:text-blue-400"
                      >
                        Buka
                        <ExternalIcon size={14} />
                      </Link>
                    ) : (
                      <span className="text-neutral-400">No link</span>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
};

export default PublicationsList;
