"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { BiChevronLeft as ArrowLeftIcon, BiCalendar as CalendarIcon, BiLinkExternal as ExternalLinkIcon } from "react-icons/bi";

import { PublicationItem } from "@/common/types/publication";
import MDXComponent from "@/common/components/elements/MDXComponent";

interface PublicationDetailProps {
  publication: any;
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const PublicationDetail = ({ publication }: PublicationDetailProps) => {
  const t = useTranslations("BlogPage");
  const router = useRouter();

  const tagsList = publication.tags
    ? publication.tags.split(",").map((tag: string) => tag.trim()).filter(Boolean)
    : [];

  return (
    <article className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors group focus:outline-none"
      >
        <ArrowLeftIcon
          size={20}
          className="group-hover:-translate-x-0.5 transition-transform"
        />
        {t("back_button") || "Kembali"}
      </button>

      {/* Header Info */}
      <div className="space-y-4">
        {/* Outlet Pill */}
        <span className="inline-block text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 bg-violet-500/10 px-3 py-1 rounded border border-violet-500/20 capitalize">
          {publication.outlet || "Publication"}
        </span>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 leading-tight">
          {publication.title}
        </h1>

        {/* Metadata */}
        <div className="flex flex-wrap gap-4 text-xs text-neutral-500 dark:text-neutral-400 font-light items-center">
          <span className="flex items-center gap-1.5">
            <CalendarIcon size={14} className="text-neutral-400" />
            {formatDate(publication.date || publication.createdAt)}
          </span>
          {publication.url && (
            <>
              <span className="h-3 w-px bg-neutral-300 dark:bg-neutral-800" />
              <Link
                href={publication.url}
                target="_blank"
                className="flex items-center gap-1.5 text-violet-600 dark:text-violet-400 hover:underline"
              >
                <ExternalLinkIcon size={14} />
                Lihat Sumber Asli
              </Link>
            </>
          )}
        </div>

        {/* Tags */}
        {tagsList.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {tagsList.map((tag: string) => (
              <span
                key={tag}
                className="text-[10px] text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-900/60 px-2 py-0.5 rounded border border-neutral-200/50 dark:border-neutral-800/30"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Cover Image */}
      {publication.imageUrl && (
        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl border border-neutral-200/60 dark:border-neutral-800/50 bg-neutral-100 dark:bg-neutral-950">
          <img
            src={publication.imageUrl}
            alt={publication.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Excerpt Summary Card */}
      {publication.description && (
        <div className="p-4 rounded-xl border border-l-4 border-l-violet-500 bg-violet-500/5 border-neutral-200 dark:border-neutral-800/60 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-light italic">
          {publication.description}
        </div>
      )}

      {/* Markdown Body Content */}
      {publication.content && (
        <div className="prose prose-neutral dark:prose-invert max-w-none leading-relaxed text-sm sm:text-base text-neutral-800 dark:text-neutral-300 space-y-6 pt-2 pb-12 border-b border-neutral-200 dark:border-neutral-800">
          <MDXComponent>{publication.content}</MDXComponent>
        </div>
      )}
    </article>
  );
};

export default PublicationDetail;
