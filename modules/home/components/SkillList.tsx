import { BiCodeAlt as SkillsIcon } from "react-icons/bi";
import { getTranslations } from "next-intl/server";

import SectionHeading from "@/common/components/elements/SectionHeading";
import SectionSubHeading from "@/common/components/elements/SectionSubHeading";
import SkillGrid from "./SkillGrid";

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

      <SkillGrid skills={stacksInArray} />
    </section>
  );
};

export default SkillList;
