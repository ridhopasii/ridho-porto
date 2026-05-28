"use client";

import { useState } from "react";
import { m as motion, AnimatePresence } from "framer-motion";
import GlassIcon from "@/common/components/elements/GlassIcon";
import DynamicIcon from "@/common/components/DynamicIcon";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";

export default function SkillGrid({ skills }: { skills: any[] }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const INITIAL_COUNT = 12;

  const displayedSkills = isExpanded ? skills : skills.slice(0, INITIAL_COUNT);
  const hasMore = skills.length > INITIAL_COUNT;

  return (
    <div className="flex flex-col items-center">
      <div className="grid w-full grid-cols-6 gap-x-[1em] gap-y-[2.7em] py-2 md:grid-cols-10 lg:grid-cols-11">
        <AnimatePresence>
          {displayedSkills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2, delay: index < INITIAL_COUNT ? 0 : (index - INITIAL_COUNT) * 0.02 }}
            >
              <GlassIcon
                name={skill.name}
                icon={<DynamicIcon name={skill.icon} />}
                background={skill.background}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {hasMore && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-8 flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-5 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
        >
          {isExpanded ? (
            <>
              Tutup <HiChevronUp size={16} />
            </>
          ) : (
            <>
              Lihat Semua ({skills.length}) <HiChevronDown size={16} />
            </>
          )}
        </button>
      )}
    </div>
  );
}
