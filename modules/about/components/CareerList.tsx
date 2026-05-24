import { getTranslations } from "next-intl/server";
import { HiOutlineBriefcase as CareerIcon } from "react-icons/hi";

import SectionHeading from "@/common/components/elements/SectionHeading";
import SectionSubHeading from "@/common/components/elements/SectionSubHeading";
import { supabaseServer } from "@/common/libs/supabase-server";

import CareerCard from "./CareerCard";

const CareerList = async () => {
  const t = await getTranslations("AboutPage.career");

  const { data: careers } = await supabaseServer
    .from("Experience")
    .select("*")
    .eq("showOnHome", true)
    .order("start_date", { ascending: false });

  const filteredCareers = careers || [];

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <SectionHeading title={t("title")} icon={<CareerIcon />} />
        <SectionSubHeading>
          <p>{t("sub_title")}</p>
        </SectionSubHeading>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredCareers.map((career, index) => (
          <CareerCard key={index} indexCareer={index} {...career} />
        ))}
      </div>
    </section>
  );
};

export default CareerList;
