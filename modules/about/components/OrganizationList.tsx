import { getTranslations } from "next-intl/server";
import { BsBuildings as OrganizationIcon } from "react-icons/bs";

import SectionHeading from "@/common/components/elements/SectionHeading";
import SectionSubHeading from "@/common/components/elements/SectionSubHeading";
import { PageContentMap, readPageContent } from "@/common/libs/page-content";
import { supabaseServer } from "@/common/libs/supabase-server";

import { OrganizationProps } from "@/common/types/organization";

import OrganizationCard from "./OrganizationCard";

interface OrganizationListProps {
  content?: PageContentMap;
}

const OrganizationList = async ({ content }: OrganizationListProps) => {
  const t = await getTranslations("AboutPage");

  const { data: organizations } = await supabaseServer
    .from("Organization")
    .select(
      "name, role, period, description, website, logoUrl, proofUrl, slug, order, showOnHome, images",
    )
    .eq("showOnHome", true)
    .order("order", { ascending: true });

  const filteredOrganizations = (organizations || []) as OrganizationProps[];
  const title = readPageContent(
    content,
    "organization.title",
    t("organization.title"),
  );
  const subTitle = readPageContent(
    content,
    "organization.sub_title",
    t("organization.sub_title"),
  );
  const emptyText = readPageContent(content, "no_data", t("no_data"));

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <SectionHeading title={title} icon={<OrganizationIcon />} />
        <SectionSubHeading>
          <p>{subTitle}</p>
        </SectionSubHeading>
      </div>

      {filteredOrganizations.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredOrganizations.map((organization, index) => (
            <OrganizationCard
              key={`${organization.name}-${index}`}
              {...organization}
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

export default OrganizationList;
