import { BiCodeAlt as SkillsIcon } from "react-icons/bi";
import { getTranslations } from "next-intl/server";

import { supabaseServer } from "@/common/libs/supabase-server";
import SkillsMarquee from "./SkillsMarquee";

interface Skill {
  id: number;
  name: string;
  icon: string;
  background: string;
}

const HomeSkills = async () => {
  const t = await getTranslations("HomePage");

  const { data: skills } = await supabaseServer
    .from("Skill")
    .select("*")
    .eq("showOnHome", true)
    .order("name", { ascending: true });

  const stacksInArray: Skill[] = skills || [];

  if (stacksInArray.length === 0) return null;

  // Filter out duplicates (case-insensitive name check)
  const seen = new Set<string>();
  const uniqueSkills = stacksInArray.filter((skill) => {
    const nameKey = skill.name.toLowerCase().trim();
    if (seen.has(nameKey)) return false;
    seen.add(nameKey);
    return true;
  });

  return (
    <section className="space-y-4">
      <div>
        <div className="flex items-center gap-2">
          <SkillsIcon size={18} className="text-neutral-600 dark:text-neutral-400" />
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            {t("skills.title")}
          </h2>
        </div>
        <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-0.5">
          {t("skills.sub_title")}
        </p>
      </div>

      <SkillsMarquee skills={uniqueSkills} />
    </section>
  );
};

export default HomeSkills;
