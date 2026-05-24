import { BiCodeAlt as SkillsIcon } from "react-icons/bi";
import { getTranslations } from "next-intl/server";

import DynamicIcon from "@/common/components/DynamicIcon";
import { supabaseServer } from "@/common/libs/supabase-server";

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

      <div className="flex flex-wrap gap-2">
        {stacksInArray.map((skill, index) => (
          <div
            key={index}
            title={skill.name}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-200 cursor-default"
          >
            <span className="w-4 h-4 flex items-center justify-center text-neutral-600 dark:text-neutral-400">
              <DynamicIcon name={skill.icon} />
            </span>
            <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
              {skill.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HomeSkills;
