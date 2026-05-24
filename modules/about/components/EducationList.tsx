import { TbSchool as EducationIcon } from "react-icons/tb";
import { getTranslations } from "next-intl/server";

import SectionHeading from "@/common/components/elements/SectionHeading";
import SectionSubHeading from "@/common/components/elements/SectionSubHeading";
import { supabaseServer } from "@/common/libs/supabase-server";

import EducationCard from "./EducationCard";

const EducationList = async () => {
  const t = await getTranslations("AboutPage.education");

  const { data: educations } = await supabaseServer
    .from("Education")
    .select("*")
    .eq("showOnHome", true)
    .order("start_year", { ascending: false });

  const filteredEducations = educations || [];

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <SectionHeading title={t("title")} icon={<EducationIcon />} />
        <SectionSubHeading>
          <p>{t("sub_title")}</p>
        </SectionSubHeading>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredEducations.map((item, index) => (
          <EducationCard key={index} {...item} school={item.institution} logo={item.logoUrl} GPA={item.gpa} />
        ))}
      </div>
    </section>
  );
};

export default EducationList;
