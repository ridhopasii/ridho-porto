import { TbSchool as EducationIcon } from "react-icons/tb";
import { getTranslations } from "next-intl/server";

import SectionHeading from "@/common/components/elements/SectionHeading";
import SectionSubHeading from "@/common/components/elements/SectionSubHeading";
import { PageContentMap, readPageContent } from "@/common/libs/page-content";
import { supabaseServer } from "@/common/libs/supabase-server";

import EducationCard from "./EducationCard";

interface EducationListProps {
  content?: PageContentMap;
}

const EducationList = async ({ content }: EducationListProps) => {
  const t = await getTranslations("AboutPage.education");

  const { data: educations } = await supabaseServer
    .from("Education")
    .select("*")
    .eq("showOnHome", true)
    .order("start_year", { ascending: false });

  const filteredEducations = educations || [];
  const title = readPageContent(content, "education.title", t("title"));
  const subTitle = readPageContent(
    content,
    "education.sub_title",
    t("sub_title"),
  );
  const emptyText = readPageContent(content, "no_data", "No data available.");

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <SectionHeading title={title} icon={<EducationIcon />} />
        <SectionSubHeading>
          <p>{subTitle}</p>
        </SectionSubHeading>
      </div>

      {filteredEducations.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredEducations.map((item, index) => (
            <EducationCard
              key={index}
              {...item}
              school={item.institution}
              logo={item.logoUrl}
              GPA={item.gpa}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {emptyText}
        </p>
      )}
    </section>
  );
};

export default EducationList;
