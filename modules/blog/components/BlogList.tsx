"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { BiSearch as SearchIcon, BiCalendar as CalendarIcon, BiTimeFive as TimeIcon } from "react-icons/bi";
import { HiOutlineTag as TagIcon } from "react-icons/hi";

import { ArticleItem } from "@/services/blog";
import EmptyState from "@/common/components/elements/EmptyState";
import Image from "@/common/components/elements/Image";

interface BlogListProps {
  articles: ArticleItem[];
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getReadingTime = (content: string) => {
  const words = content ? content.split(/\s+/).length : 0;
  return Math.max(1, Math.ceil(words / 200));
};

const BlogList = ({ articles }: BlogListProps) => {
  const t = useTranslations("BlogPage");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredArticles = articles
    .filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory =
        selectedCategory === "All" ||
        article.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });

  // Extract unique categories
  const categories = ["All", ...Array.from(new Set(articles.map((item) => item.category)))];

  return (
    <div className="space-y-6">
      {/* Search and Filter Area */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-200 dark:border-neutral-800 pb-5">
        {/* Search Bar */}
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder={t("search_placeholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-900/50 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
          />
          <SearchIcon className="absolute left-3 top-2.5 text-neutral-400" size={18} />
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 scrollbar-none max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`
                px-4 py-1.5 text-xs font-semibold rounded-full border transition-all duration-200 capitalize whitespace-nowrap
                ${selectedCategory === cat 
                  ? "bg-neutral-900 border-neutral-900 text-white dark:bg-neutral-100 dark:border-neutral-100 dark:text-neutral-900 shadow-sm" 
                  : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-400 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:hover:border-neutral-600"
                }
              `}
            >
              {cat === "All" ? t("all_categories") : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid List */}
      {filteredArticles.length === 0 ? (
        <EmptyState message={searchQuery ? t("no_results") : t("no_data")} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredArticles.map((article, index) => {
              const readTime = getReadingTime(article.content);
              return (
                <motion.div
                  key={article.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group relative flex flex-col cursor-pointer overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                >
                  <Link href={`/blog/${article.slug}`} className="flex flex-col h-full">
                    {/* Cover Image */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900">
                      {article.imageUrl ? (
                        <img
                          src={article.imageUrl}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-500/10 to-cyan-500/10 dark:from-violet-500/5 dark:to-cyan-500/5 text-neutral-400">
                          <span className="text-xs uppercase tracking-wider font-light text-violet-500 dark:text-violet-400">
                            {article.category}
                          </span>
                        </div>
                      )}
                      
                      {/* Floating Category Tag */}
                      <span className="absolute top-4 left-4 text-[10px] uppercase font-bold tracking-wider text-violet-600 dark:text-violet-400 bg-white/95 dark:bg-neutral-900/95 px-2.5 py-1 rounded-md border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm capitalize">
                        {article.category}
                      </span>
                    </div>

                    {/* Metadata Content */}
                    <div className="flex flex-col justify-between flex-1 p-5 space-y-3">
                      <div className="space-y-2">
                        {/* Title */}
                        <h3 className="font-bold text-base text-neutral-800 dark:text-neutral-100 line-clamp-2 leading-snug group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                          {article.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-3 leading-relaxed font-light">
                          {article.excerpt || article.content.substring(0, 120).replace(/[#*`_-]/g, "") + "..."}
                        </p>
                      </div>

                      {/* Footer Details */}
                      <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-900 text-[11px] text-neutral-400 dark:text-neutral-500 font-light">
                        <span className="flex items-center gap-1">
                          <CalendarIcon size={12} />
                          {formatDate(article.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <TimeIcon size={12} />
                          {readTime} {t("read_time")}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default BlogList;
