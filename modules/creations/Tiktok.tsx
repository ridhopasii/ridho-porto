"use client";

import { useState } from "react";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import { useTranslations } from "next-intl";

import VideoList from "./VideoList";
import ProfileHeader from "./ProfileHeader";
import { ProfileHeaderSkeleton, VideoListSkeleton } from "./TiktokSkeleton";

import EmptyState from "@/common/components/elements/EmptyState";
import { fetcher } from "@/services/fetcher";

const TIKTOK_API_BASE = "/api/tiktok?action=";

const Tiktok = () => {
  const t = useTranslations("ContentsPage");
  const [sortOption, setSortOption] = useState<"newest" | "oldest" | "views" | "likes" | "comments">("newest");

  const { data: profile, isLoading: profileLoading } = useSWR(
    `${TIKTOK_API_BASE}profile`,
    fetcher,
  );

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.has_more) return null;
    if (pageIndex === 0) return `${TIKTOK_API_BASE}videos`;
    return `${TIKTOK_API_BASE}videos&cursor=${previousPageData.cursor}`;
  };

  const {
    data,
    size,
    setSize,
    error: videoError,
    isValidating: videoValidating,
    isLoading: videoLoading,
  } = useSWRInfinite(getKey, fetcher);

  const allVideos = data ? data.flatMap((page) => page.videos) : [];
  const hasMore = data ? data[data.length - 1]?.has_more : false;
  const isRefreshing = videoValidating && data && data.length === size;

  const sortedVideos = [...allVideos].sort((a, b) => {
    switch (sortOption) {
      case "oldest":
        return a.create_time - b.create_time;
      case "views":
        return b.view_count - a.view_count;
      case "likes":
        return b.like_count - a.like_count;
      case "comments":
        return b.comment_count - a.comment_count;
      case "newest":
      default:
        return b.create_time - a.create_time;
    }
  });

  const isLoadingInitial = profileLoading || (videoLoading && !data);

  if (isLoadingInitial) {
    return (
      <section className="space-y-6">
        <ProfileHeaderSkeleton />
        <VideoListSkeleton />
      </section>
    );
  }

  if (videoError || !profile?.data) return <EmptyState message={t("error")} />;

  if (allVideos.length === 0) return <EmptyState message={t("no_data")} />;

  return (
    <section className="space-y-4">
      <ProfileHeader {...profile?.data} allVideos={allVideos} />

      <div className="flex justify-end">
        <select 
          value={sortOption} 
          onChange={(e) => setSortOption(e.target.value as any)}
          className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-900"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="views">Most Views</option>
          <option value="likes">Most Likes</option>
          <option value="comments">Most Comments</option>
        </select>
      </div>

      <VideoList videos={sortedVideos} />

      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={() => setSize(size + 1)}
            disabled={isRefreshing}
            className="rounded-full bg-neutral-200 px-4 py-1 text-sm text-dark transition-all duration-300 hover:scale-105 hover:bg-neutral-200 disabled:opacity-50 dark:bg-neutral-800 dark:text-light"
          >
            {isRefreshing ? "Loading..." : t("load_more") || "Load More"}
          </button>
        </div>
      )}
    </section>
  );
};

export default Tiktok;
