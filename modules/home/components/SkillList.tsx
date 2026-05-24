import { BiCodeAlt as SkillsIcon } from "react-icons/bi";
import { getTranslations } from "next-intl/server";

import SectionHeading from "@/common/components/elements/SectionHeading";
import SectionSubHeading from "@/common/components/elements/SectionSubHeading";
import GlassIcon from "@/common/components/elements/GlassIcon";
import DynamicIcon from "@/common/components/DynamicIcon";
import { supabaseServer } from "@/common/libs/supabase-server";

const SkillList = async () => {
  const t = await getTranslations("HomePage");

  const { data: skills } = await supabaseServer
    .from("Skill")
    .select("*")
    .eq("showOnHome", true)
    .order("name", { ascending: true });

  const stacksInArray = skills || [];

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <SectionHeading title={t("skills.title")} icon={<SkillsIcon />} />
        <SectionSubHeading>
          <p>{t("skills.sub_title")}</p>
        </SectionSubHeading>
      </div>

      <div className="grid w-full grid-cols-6 gap-x-[1em] gap-y-[2.7em] py-2 md:grid-cols-10 lg:grid-cols-11">
        {stacksInArray.map((skill, index) => (
          <GlassIcon
            key={index}
            name={skill.name}
            icon={<DynamicIcon name={skill.icon} />}
            background={skill.background}
          />
        ))}
      </div>
    </section>
  );
};

export default SkillList;
