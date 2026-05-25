"use client";

import { m as motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { AchievementItem } from "@/common/types/achievements";

import EmptyState from "@/common/components/elements/EmptyState";
import AchievementCard from "./AchievementCard";
import FilterHeader from "./FilterHeader";

interface AchievementsProps {
  achievements: AchievementItem[];
  categoriesData: any;
  typesData: any;
}

const Achievements = ({ achievements, categoriesData, typesData }: AchievementsProps) => {
  const t = useTranslations("AchievementsPage");

  const params = useSearchParams();

  const type = params.get("type");
  const category = params.get("category");
  const search = params.get("search");

  const filteredAchievements: AchievementItem[] = achievements
    ?.filter((item: AchievementItem) => {
      const matchesShow = item?.is_show;

      const matchesCategory = !category || item?.category === category;

      const matchesType = !type || item?.type === type;

      return matchesShow && matchesType && matchesCategory;
    })
    .sort((a: AchievementItem, b: AchievementItem) => b.id - a.id);

  return (
    <section className="space-y-4">
      <FilterHeader
        categoryOptions={categoriesData}
        typeOptions={typesData}
        totalData={achievements?.length}
      />

      {filteredAchievements?.length === 0 && (
        <EmptyState message={t("no_data")} />
      )}

      {filteredAchievements?.length !== 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {filteredAchievements?.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <AchievementCard {...item} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Achievements;
