"use client";

import Link from "next/link";
import { MdVerified as VerifiedIcon } from "react-icons/md";
import useSWR from "swr";

import ThemeToggle from "./ThemeToggle";
import IntlToggle from "./IntlToggle";
import Tooltip from "../../elements/Tooltip";
import Image from "../../elements/Image";
import { fetcher } from "@/services/fetcher";
import { useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";

import cn from "@/common/libs/clsxm";

interface ProfileHeaderProps {
  expandMenu: boolean;
  imageSize: number;
}

const DEFAULT_AVATAR = "/profile.webp";

const ProfileHeader = ({ expandMenu, imageSize }: ProfileHeaderProps) => {
  const { data, mutate } = useSWR("/api/profile", fetcher);
  
  const supabase = createBrowserClient(
    (process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"),
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder"),
  );

  useEffect(() => {
    const channel = supabase
      .channel('profile-changes-header')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Profile' }, () => mutate())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profile' }, () => mutate())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [mutate, supabase]);
  
  const fetchedAvatar = data?.avatarUrl || DEFAULT_AVATAR;
  const avatarUrl = fetchedAvatar.includes("github.com") ? DEFAULT_AVATAR : fetchedAvatar;
  const fullName = data?.fullName || "Ridho Robbi Pasi";
  const username = data?.username || "@ridhopasii";

  return (
    <div
      className={cn(
        "flex w-full flex-grow items-center gap-4 lg:flex-col  lg:gap-0.5",
        expandMenu && "flex-col !items-start",
      )}
    >
      <Image
        src={avatarUrl}
        width={expandMenu ? 80 : imageSize * 1}
        height={expandMenu ? 80 : imageSize * 1}
        alt={fullName}
        className="border-2 border-neutral-400 dark:border-neutral-600 lg:hover:scale-105"
        rounded="rounded-full"
      />

      <div className="mt-1 flex items-center gap-2 lg:mt-4">
        <Link href="/" passHref>
          <h2 className="flex-grow text-lg font-medium lg:text-xl">
            <span className="lg:hidden">{expandMenu ? fullName : fullName.split(" ")[0]}</span>
            <span className="hidden lg:block">{fullName}</span>
          </h2>
        </Link>

        <div className={cn("transition-all duration-300", !expandMenu && "hidden lg:block")}>
          <Tooltip title="Verified">
            <VerifiedIcon size={18} className="text-blue-400" />
          </Tooltip>
        </div>
      </div>

      <div className="hidden text-sm text-neutral-600 transition-all duration-300 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-400 lg:flex">
        {username}
      </div>

      <div className="hidden justify-between gap-6 lg:mt-4 lg:flex">
        <IntlToggle />
        <ThemeToggle />
      </div>
    </div>
  );
};

export default ProfileHeader;

