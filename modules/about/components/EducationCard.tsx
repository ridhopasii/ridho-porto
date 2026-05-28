"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HiChevronRight as ChevronIcon, HiArrowRight } from "react-icons/hi";
import Image from "@/common/components/elements/Image";
import { BsBuildings as CompanyIcon } from "react-icons/bs";
import { useLocale } from "next-intl";
import Link from "next/link";
import MDXComponent from "@/common/components/elements/MDXComponent";

import { EducationProps } from "@/common/types/education";
import SpotlightCard from "@/common/components/elements/SpotlightCard";

const EducationCard = ({
  school,
  major,
  logo,
  degree,
  start_year,
  end_year,
  link,
  location,
  GPA,
  slug,
  description,
}: EducationProps) => {
  const [isShowDetails, setIsShowDetails] = useState(false);
  const locale = useLocale();

  const hideText = locale === "en" ? "Hide" : "Sembunyikan";
  const showText = locale === "en" ? "Show" : "Tampilkan";
  const detailsText = locale === "en" ? "details" : "detail";

  return (
    <SpotlightCard className="flex items-start gap-5 p-6">
      {logo ? (
        <Image width={70} height={70} src={logo} alt={school} />
      ) : (
        <CompanyIcon size={65} />
      )}

      <div className="space-y-1">
        <a href={link || "#"} target="_blank">
          <h6>{school}</h6>
        </a>
        <div className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
          <div className="flex flex-col gap-1 md:flex-row md:gap-2">
            <span>{degree}</span>
            <span className="hidden text-neutral-300 dark:text-neutral-700 md:block">
              •
            </span>
            <span>{major}</span>
            {GPA && (
              <div className="flex gap-2">
                <span className="hidden text-neutral-300 dark:text-neutral-700 md:block">
                  •
                </span>
                <span>GPA: </span>
                <span>{GPA}</span>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1 text-[12px] md:flex-row md:gap-2 items-center">
            <span className="dark:text-neutral-500">
              {start_year} - {end_year}
            </span>
            <span className="hidden rounded-full text-neutral-300 dark:text-neutral-700 md:block">
              •
            </span>
            <span>{location}</span>
          </div>
          <div className="pt-2 flex flex-row items-center justify-between">
            {description ? (
              <button
                onClick={() => setIsShowDetails(!isShowDetails)}
                className="-ml-1 flex items-center justify-center gap-x-1 transition duration-300 hover:text-neutral-800 dark:text-neutral-500 dark:hover:text-neutral-300"
              >
                <motion.span
                  animate={{ rotate: isShowDetails ? 90 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="inline-block"
                >
                  <ChevronIcon size={18} />
                </motion.span>
                <p className="text-sm font-medium">
                  {isShowDetails ? hideText : showText} {detailsText}
                </p>
              </button>
            ) : <div />}

            {slug && (
              <Link
                href={`/${locale}/pendidikan/${slug}`}
                className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Full Page <HiArrowRight size={14} />
              </Link>
            )}
          </div>

          <div className="w-full">
            <AnimatePresence>
              {isShowDetails && description && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="space-y-4 py-3 leading-normal text-neutral-600 dark:text-neutral-400 mt-2 border-t border-neutral-200 dark:border-neutral-800 pt-4">
                    <MDXComponent>{description}</MDXComponent>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
};

export default EducationCard;
