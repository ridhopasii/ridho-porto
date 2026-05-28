import Link from "next/link";
import Image from "next/image";
import { HiArrowRight } from "react-icons/hi";
import { BiCalendar } from "react-icons/bi";
import { supabaseServer } from "@/common/libs/supabase-server";

interface Article {
  id: number;
  title: string;
  excerpt: string;
  imageUrl: string;
  slug: string;
  category: string;
  createdAt: string;
  tags?: string;
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getRelativeTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600 * 24));
  
  if (diffInDays === 0) return "Hari ini";
  if (diffInDays === 1) return "Kemarin";
  if (diffInDays < 7) return `${diffInDays} hari lalu`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} minggu lalu`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} bulan lalu`;
  return `${Math.floor(diffInDays / 365)} tahun lalu`;
};

const RecentPosts = async () => {
  const { data: articles } = await supabaseServer
    .from("Article")
    .select("id, title, excerpt, imageUrl, slug, category, createdAt, tags")
    .eq("published", true)
    .order("createdAt", { ascending: false })
    .limit(3);

  const recentArticles: Article[] = articles || [];

  if (recentArticles.length === 0) return null;

  return (
    <div className="space-y-12">
      <hr className="border-neutral-100 dark:border-neutral-800/50" />
      <section className="pt-2 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Recent Posts
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-0.5">
            Thoughts, ideas, and learnings.
          </p>
        </div>
        <Link
          href="/creations"
          className="flex items-center gap-1 text-sm text-neutral-500 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors group"
        >
          View all
          <HiArrowRight
            size={14}
            className="group-hover:translate-x-0.5 transition-transform"
          />
        </Link>
      </div>

      <div className="space-y-3">
        {recentArticles.map((article: Article) => (
          <Link
            key={article.id}
            href={`/creations/${article.slug}`}
            className="group flex gap-4 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300 hover:shadow-sm"
          >
            {/* Thumbnail */}
            {article.imageUrl && (
              <div className="relative flex-shrink-0 w-20 h-14 sm:w-24 sm:h-16 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            )}

            {/* Content */}
            <div className="flex flex-col justify-between flex-1 min-w-0">
              <div className="space-y-1">
                {article.category && (
                  <span className="text-[11px] font-medium text-violet-500 dark:text-violet-400 uppercase tracking-wider">
                    {article.category}
                  </span>
                )}
                <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 line-clamp-1 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                  {article.title}
                </h3>
                {article.excerpt && (
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                    {article.excerpt}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3 mt-2 text-xs text-neutral-400 dark:text-neutral-600">
                <span className="flex items-center gap-1">
                  <BiCalendar size={12} />
                  {article.createdAt ? `${formatDate(article.createdAt)} • ${getRelativeTime(article.createdAt)}` : ""}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      </section>
    </div>
  );
};

export default RecentPosts;
