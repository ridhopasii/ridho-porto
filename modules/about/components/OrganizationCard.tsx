"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HiChevronRight as ChevronIcon, HiArrowRight } from "react-icons/hi";
import Link from "next/link";
import Image from "@/common/components/elements/Image";
import { BsBuildings as OrganizationIcon } from "react-icons/bs";
import { useLocale } from "next-intl";
import MDXComponent from "@/common/components/elements/MDXComponent";
import { parseImages } from "@/common/utils/parseImages";

import SpotlightCard from "@/common/components/elements/SpotlightCard";
import { OrganizationProps } from "@/common/types/organization";

const OrganizationCard = ({
  name,
  role,
  period,
  description,
  website,
  logoUrl,
  proofUrl,
  images,
  slug,
}: OrganizationProps) => {
  const [isShowDetails, setIsShowDetails] = useState(false);
  const locale = useLocale();
  const galleryImages = parseImages(images);

  const hideText = locale === "en" ? "Hide" : "Sembunyikan";
  const showText = locale === "en" ? "Show" : "Tampilkan";
  const detailsText = locale === "en" ? "details" : "detail";

  const hasDetails = !!description || galleryImages.length > 0;

  return (
    <SpotlightCard className="flex items-start gap-5 p-6">
      {logoUrl ? (
        <Image
          width={64}
          height={64}
          src={logoUrl}
          alt={name}
          className="shrink-0 rounded-xl border-[1.5px] border-neutral-300 bg-neutral-100 object-contain p-1 dark:border-neutral-700 dark:bg-neutral-950"
        />
      ) : (
        <OrganizationIcon size={64} className="shrink-0 text-neutral-500" />
      )}

      <div className="w-full min-w-0 space-y-2">
        <div className="space-y-1">
          {website ? (
            <Link href={website} target="_blank" rel="noopener noreferrer">
              <h5 className="break-words transition hover:text-neutral-800 hover:underline dark:hover:text-neutral-50">
                {name}
              </h5>
            </Link>
          ) : (
            <h5 className="break-words">{name}</h5>
          )}
          <p className="text-sm font-medium text-primary">{role}</p>
        </div>

        <div className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
          <div className="flex flex-wrap items-center gap-2">
            <p>{period}</p>
            {proofUrl ? (
              <>
                <span className="hidden text-neutral-300 dark:text-neutral-700 md:block">•</span>
                <Link
                  href={proofUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-fit items-center rounded-full border border-neutral-300 px-3 py-1 text-xs font-medium text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                >
                  View Proof
                </Link>
              </>
            ) : null}
          </div>

          <div className="pt-2 flex flex-row items-center justify-between">
            {hasDetails ? (
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
                href={`/${locale}/organisasi/${slug}`}
                className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Full Page <HiArrowRight size={14} />
              </Link>
            )}
          </div>

          <div className="w-full">
            <AnimatePresence>
              {isShowDetails && hasDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="space-y-4 py-3 leading-normal text-neutral-600 dark:text-neutral-400 mt-2 border-t border-neutral-200 dark:border-neutral-800 pt-4">
                    {description && <MDXComponent>{description}</MDXComponent>}
                    
                    {galleryImages.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 pt-2 sm:grid-cols-3">
                        {galleryImages.map((src, index) => (
                          <Image
                            key={`${name}-image-${index}`}
                            src={src as string}
                            alt={`${name} image ${index + 1}`}
                            width={220}
                            height={160}
                            className="h-24 w-full rounded-xl border border-neutral-200 object-cover dark:border-neutral-800"
                          />
                        ))}
                      </div>
                    )}
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

export default OrganizationCard;
