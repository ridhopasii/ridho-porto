"use client";

import React, { useTransition } from "react";
import { m as motion } from "framer-motion";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { HiOutlineGlobeAlt } from "react-icons/hi";

const IntlToggle = () => {
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    if (isPending) return;
    const nextLocale = currentLocale === "en" ? "id" : "en";
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`flex h-9 items-center gap-2 rounded-full border-[1.5px] border-neutral-300 bg-neutral-100 px-3 transition-all duration-200 hover:scale-105 hover:bg-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700 ${
        isPending ? "pointer-events-none opacity-50" : ""
      }`}
      aria-label="Toggle language"
    >
      <HiOutlineGlobeAlt size={16} className="text-neutral-500 dark:text-neutral-400" />
      <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-200">
        {currentLocale}
      </span>
    </button>
  );
};

export default IntlToggle;
