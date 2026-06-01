"use client";

import clsx from "clsx";
import Link from "next/link";
import { MdVerified as VerifiedIcon } from "react-icons/md";
import useSWR from "swr";

import useIsMobile from "@/hooks/useIsMobile";
import { useMenu } from "@/common/stores/menu";
import { fetcher } from "@/services/fetcher";

import ThemeToggle from "./sidebar/ThemeToggle";
import MobileMenuButton from "./sidebar/MobileMenuButton";
import MobileMenu from "./sidebar/MobileMenu";
import Tooltip from "../elements/Tooltip";
import Image from "../elements/Image";

const DEFAULT_AVATAR = "/profile.webp";

const MobileHeader = () => {
  const isMobile = useIsMobile();
  const { isOpen, toggleMenu } = useMenu();
  const imageSize = isMobile ? 40 : 100;

  const { data } = useSWR("/api/profile", fetcher);
  const avatarUrl = data?.avatarUrl || DEFAULT_AVATAR;
  const fullName = data?.fullName || "Ridho Robbi Pasi";
  const firstName = fullName.split(" ")[0];

  return (
    <div className="flex flex-col rounded-b-md px-4 py-4 shadow-sm lg:hidden">
      <div
        className={`flex w-full justify-between ${isOpen ? "items-start" : "items-center"}`}
      >
        <div
          className={`flex ${isOpen ? "flex-col space-y-3" : "flex-row space-x-3 items-center"}`}
        >
          <div className="z-10 w-max rounded-full border-2 border-white shadow-md dark:border-neutral-800">
            <Image
              src={avatarUrl}
              alt={fullName}
              width={isOpen ? 80 : 36}
              height={isOpen ? 80 : 36}
              rounded="rounded-full"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <Link href="/" passHref>
              <h2 className="whitespace-nowrap text-lg font-medium flex items-center gap-1.5">
                {isOpen ? fullName : firstName}
              </h2>
            </Link>
            <span
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.dispatchEvent(new CustomEvent("open-private-hub"));
              }}
              className="cursor-pointer transition-transform hover:scale-110 active:scale-95 flex items-center"
              title="Private Hub"
            >
              <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" className="text-[#1D9BF0] flex-shrink-0" height="16" width="16" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="m23 12-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 12l2.44 2.79-.34 3.7 3.61.82L8.6 22.5l3.4-1.47 3.4 1.46 1.89-3.19 3.61-.82-.34-3.69L23 12zm-12.91 4.72-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z"></path></svg>
            </span>
          </div>
        </div>
        {isMobile && (
          <div
            className={clsx(
              "mt-2 flex items-center gap-5 lg:hidden",
              isOpen &&
                "h-[120px] flex-col-reverse items-end justify-between pb-1",
            )}
          >
            <ThemeToggle />
            <MobileMenuButton expandMenu={isOpen} setExpandMenu={toggleMenu} />
          </div>
        )}
      </div>
      {isMobile && <>{isOpen && <MobileMenu />}</>}
    </div>
  );
};

export default MobileHeader;
