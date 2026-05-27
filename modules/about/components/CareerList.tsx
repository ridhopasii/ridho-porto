import { getTranslations } from "next-intl/server";
import { HiOutlineBriefcase as CareerIcon } from "react-icons/hi";

import SectionHeading from "@/common/components/elements/SectionHeading";
import SectionSubHeading from "@/common/components/elements/SectionSubHeading";
import { PageContentMap, readPageContent } from "@/common/libs/page-content";
import { supabaseServer } from "@/common/libs/supabase-server";

import CareerCard from "./CareerCard";

interface CareerListProps {
  content?: PageContentMap;
}

const CareerList = async ({ content }: CareerListProps) => {
  const t = await getTranslations("AboutPage.career");

  const { data: careers } = await supabaseServer
    .from("Experience")
    .select("*")
    .order("start_date", { ascending: false });

  const filteredCareers = careers || [];
  const title = readPageContent(content, "career.title", t("title"));
  const subTitle = readPageContent(content, "career.sub_title", t("sub_title"));
  const emptyText = readPageContent(content, "no_data", "No data available.");

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <SectionHeading title={title} icon={<CareerIcon />} />
        <SectionSubHeading>
          <p>{subTitle}</p>
        </SectionSubHeading>
      </div>

      {filteredCareers.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredCareers.map((career, index) => (
            <CareerCard key={index} indexCareer={index} logo={career.logoUrl || career.logo_url} {...career} />
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

export default CareerList;
