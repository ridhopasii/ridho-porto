"use client";

import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";
import { useSelectedLayoutSegment } from "next/navigation";
import { useTranslations } from "next-intl";
import { BsArrowRightShort as ArrowRightIcon } from "react-icons/bs";

import { MenuItemProps } from "@/common/types/menu";
import { useMenu } from "@/common/stores/menu";

const MenuItem = ({
  title,
  href,
  icon,
  onClick,
  className = "",
  children,
}: MenuItemProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { hideMenu } = useMenu();
  const isExternalUrl = href?.includes("http");
  const isHashLink = href === "#";

  const selectedLayoutSegment = useSelectedLayoutSegment();
  const pathname = selectedLayoutSegment ? `/${selectedLayoutSegment}` : "/";
  
  // Normalize checking active state
  const isActiveRoute = pathname === href;

  const t = useTranslations("Navigation");

  // Premium active styling matching reference screenshot: rounded-2xl with clean border outline
  const activeClasses = clsx(
    "flex items-center gap-3 py-2.5 px-4 rounded-2xl text-sm font-semibold transition-all duration-200 group w-full",
    isActiveRoute
      ? "border border-neutral-900 dark:border-neutral-200 text-neutral-950 dark:text-neutral-50 bg-white dark:bg-neutral-950/40 shadow-sm"
      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-100/60 dark:hover:bg-neutral-900/40"
  );

  const handleClick = () => {
    hideMenu();
    if (onClick) onClick();
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Special "Chats" (Guestbook) styling as a custom pill container from the reference design
  const isGuestbook = title.toLowerCase() === "guestbook";

  const itemComponent = () => {
    return (
      <div
        className={clsx(
          activeClasses,
          isGuestbook && !isActiveRoute && "bg-neutral-100/70 dark:bg-neutral-900/60 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/60",
          className
        )}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className={clsx(
            "transition-transform duration-300 group-hover:-rotate-12",
            isActiveRoute && "scale-110 text-neutral-950 dark:text-neutral-50"
          )}
        >
          {icon}
        </div>
        <div className="flex-grow">{t(title)}</div>
        {children && <>{children}</>}
        
        {/* Right Arrow Icon for Guestbook / Chats matching the mockup */}
        {isGuestbook && (
          <ArrowRightIcon
            size={18}
            className={clsx(
              "text-neutral-400 dark:text-neutral-600 group-hover:translate-x-0.5 transition-transform duration-200",
              isActiveRoute && "text-neutral-800 dark:text-neutral-200"
            )}
          />
        )}
        
        {isExternalUrl && isHovered && (
          <ArrowRightIcon
            size={18}
            className="-rotate-45 text-neutral-400 dark:text-neutral-500 transition-transform duration-200"
          />
        )}
      </div>
    );
  };

  return isHashLink ? (
    <div className="cursor-pointer">{itemComponent()}</div>
  ) : (
    <Link
      aria-current={isActiveRoute ? "page" : undefined}
      href={href}
      target={isExternalUrl ? "_blank" : ""}
      onClick={handleClick}
      className="block w-full"
    >
      {itemComponent()}
    </Link>
  );
};

export default MenuItem;
