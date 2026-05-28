"use client";

import Link from "next/link";
import { MdVerified as VerifiedIcon } from "react-icons/md";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

import Tooltip from "../../elements/Tooltip";
import Image from "../../elements/Image";
import { fetcher } from "@/services/fetcher";
import cn from "@/common/libs/clsxm";

interface ProfileHeaderProps {
  expandMenu: boolean;
  imageSize: number;
}

const DEFAULT_AVATAR = "/profile.webp";

const ProfileHeader = ({ expandMenu, imageSize }: ProfileHeaderProps) => {
  const { data, mutate } = useSWR("/api/profile", fetcher);
  const [user, setUser] = useState<any>(null);
  
  const supabase = createBrowserClient(
    (process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"),
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder"),
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    const channel = supabase
      .channel('profile-changes-header')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Profile' }, () => mutate())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profile' }, () => mutate())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      subscription.unsubscribe();
    };
  }, [mutate, supabase]);
  
  const fetchedAvatar = data?.avatarUrl || DEFAULT_AVATAR;
  const avatarUrl = fetchedAvatar.includes("github.com") ? DEFAULT_AVATAR : fetchedAvatar;
  const fullName = data?.fullName || "Ridho Robbi Pasi";
  const username = data?.username || "@ridhopasii";

  return (
    <div className="flex w-auto lg:w-full flex-col items-start lg:items-center">
      {/* Premium Grid Background behind avatar (Desktop only) */}
      <div className="hidden lg:block absolute top-0 left-0 right-0 h-[100px] bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)] bg-[size:14px_14px] rounded-t-2xl border-b border-neutral-100 dark:border-neutral-900 opacity-60 pointer-events-none" />
      
      {/* Avatar Container with responsive styling */}
      <div className="relative mt-0 lg:mt-10 flex flex-row lg:flex-col items-center gap-3 lg:gap-0 w-full lg:w-auto">
        <Image
          src={avatarUrl}
          width={expandMenu ? 80 : imageSize * 1}
          height={expandMenu ? 80 : imageSize * 1}
          alt={fullName}
          className="border-2 border-neutral-400 dark:border-neutral-600 lg:border-4 lg:border-white lg:dark:border-neutral-950 shadow-md lg:hover:scale-105 transition-transform duration-300"
          rounded="rounded-full"
        />
        
        {/* Name and Verification Badge */}
        <div className="flex flex-col items-start lg:items-center lg:mt-3 w-full lg:w-auto">
          <Link href="/" passHref className="hover:opacity-80 transition-opacity">
            <h2 className="flex items-center gap-1.5 text-base lg:text-lg font-bold text-neutral-900 dark:text-neutral-50 whitespace-nowrap">
              {fullName}
              <VerifiedIcon className="text-[#1D9BF0] flex-shrink-0" size={16} />
            </h2>
          </Link>

          {/* Username */}
          <div className="text-xs lg:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5 lg:mt-0.5">
            {username}
          </div>
        </div>
      </div>

      {/* Ayo Berkolaborasi Status Badge */}
      <div className="mt-1.5 hidden transition-all duration-300 lg:flex">
        <div className="flex items-center gap-1.5 overflow-hidden rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 yellow:border-amber-400/50 yellow:bg-amber-400/15 ramadan:border-amber-500/40 ramadan:bg-amber-500/10 valentine:border-rose-400/40 valentine:bg-rose-400/10">
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75 yellow:bg-amber-400 ramadan:bg-amber-400 valentine:bg-rose-400"></span>
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary yellow:bg-amber-500 ramadan:bg-amber-500 valentine:bg-rose-500"></span>
          </span>
          <div className="relative h-4 overflow-hidden">
            <span className="block text-[11px] font-semibold tracking-wide text-primary yellow:text-amber-700 ramadan:text-amber-400 valentine:text-rose-600 whitespace-nowrap" style={{ opacity: 1, transform: "none" }}>Ayo Berkolaborasi</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
