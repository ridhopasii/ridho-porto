import Link from "next/link";
import Image from "@/common/components/elements/Image";
import { ProfileItem } from "@/common/types/tiktok";

function StatItem({ count, label }: { count: number; label: string }) {
  const format = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num;
  };

  return (
    <div className="flex items-center gap-1.5">
      <strong className="text-[17px] font-bold text-black dark:text-white">
        {format(count)}
      </strong>
      <span className="text-[16px] text-neutral-500 dark:text-neutral-400">
        {label}
      </span>
    </div>
  );
}

export default function ProfileHeader({
  avatar_large_url,
  follower_count,
  following_count,
  profile_deep_link,
  username,
  bio_description,
  display_name,
  likes_count,
}: ProfileItem) {
  return (
    <div className="flex flex-col md:flex-row max-w-[800px] mb-8">
      {/* Avatar */}
      <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-8">
        <div className="relative mx-auto h-[116px] w-[116px] md:h-[172px] md:w-[172px]">
          <Image
            src={avatar_large_url}
            className="rounded-full object-cover"
            alt={display_name || username}
            fill
          />
        </div>
      </div>

      {/* Profile Info */}
      <div className="flex flex-col items-center md:items-start text-center md:text-left">
        <h1 className="text-[32px] font-bold leading-[38px] text-black dark:text-white">
          {display_name || username}
        </h1>
        <h2 className="text-[18px] font-semibold leading-[25px] text-black dark:text-white mt-1">
          {username}
        </h2>

        {/* Stats */}
        <div className="flex items-center gap-5 mt-5">
          <StatItem count={following_count} label="Mengikuti" />
          <StatItem count={follower_count} label="Pengikut" />
          <StatItem count={likes_count} label="Suka" />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-5">
          <Link
            href={profile_deep_link || "#"}
            target="_blank"
            className="bg-[#fe2c55] text-white px-[44px] py-[6px] rounded-[4px] font-semibold text-[16px] min-w-[160px] text-center hover:bg-[#ef2950] transition-colors"
          >
            Ikuti
          </Link>
          <button
            className="flex items-center justify-center w-[36px] h-[36px] rounded-[4px] border border-neutral-300 bg-white text-black transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:bg-[rgba(255,255,255,0.08)] dark:text-white dark:hover:bg-[rgba(255,255,255,0.12)]"
            aria-label="Share"
          >
            <svg fill="currentColor" color="inherit" fontSize="20px" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em">
              <path d="M23.82 3.5A2 2 0 0 0 20.5 5v10.06C8.7 15.96 1 25.32 1 37a2 2 0 0 0 3.41 1.41c4.14-4.13 10.4-5.6 16.09-5.88v9.97a2 2 0 0 0 3.3 1.52l21.5-18.5a2 2 0 0 0 .02-3.02l-21.5-19Z"></path>
            </svg>
          </button>
          <button
            className="flex items-center justify-center w-[36px] h-[36px] rounded-[4px] border border-neutral-300 bg-white text-black transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:bg-[rgba(255,255,255,0.08)] dark:text-white dark:hover:bg-[rgba(255,255,255,0.12)]"
            aria-label="More"
          >
            <svg fill="currentColor" color="inherit" fontSize="20px" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em">
              <path d="M5 24a4 4 0 1 1 8 0 4 4 0 0 1-8 0Zm15 0a4 4 0 1 1 8 0 4 4 0 0 1-8 0Zm15 0a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z"></path>
            </svg>
          </button>
        </div>

        {/* Bio */}
        <div className="mt-5 text-[16px] leading-[22px] text-black dark:text-white whitespace-pre-wrap max-w-[450px]">
          {bio_description ? (
            <p>{bio_description}</p>
          ) : (
            <p className="text-neutral-500">No bio yet</p>
          )}
          <Link
            href={profile_deep_link || "#"}
            target="_blank"
            className="mt-2 flex items-center gap-1 font-semibold hover:underline"
          >
            <svg fill="currentColor" width="1em" height="1em" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
              <path d="m21.88 37.43 3.18-3.18a1.5 1.5 0 0 1 2.12 0l2.12 2.12a1.5 1.5 0 0 1 0 2.13l-3.18 3.18a14 14 0 1 1-19.8-19.8L9.5 18.7a1.5 1.5 0 0 1 2.13 0l2.12 2.12a1.5 1.5 0 0 1 0 2.12l-3.18 3.18a8 8 0 1 0 11.3 11.31ZM38.5 29.3a1.5 1.5 0 0 1-2.13 0l-2.12-2.12a1.5 1.5 0 0 1 0-2.12l3.19-3.18a8 8 0 1 0-11.32-11.32l-3.18 3.19a1.5 1.5 0 0 1-2.12 0l-2.12-2.12a1.5 1.5 0 0 1 0-2.13l3.18-3.18a14 14 0 0 1 19.8 19.8L38.5 29.3Z"></path>
              <path d="M17.99 32.13a1.5 1.5 0 0 0 2.12 0l12.02-12.02a1.5 1.5 0 0 0 0-2.12l-2.12-2.12a1.5 1.5 0 0 0-2.12 0L15.87 27.89a1.5 1.5 0 0 0 0 2.12l2.12 2.12Z"></path>
            </svg>
            tiktok.com/@{username}
          </Link>
        </div>
      </div>
    </div>
  );
}
