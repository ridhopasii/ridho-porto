import { getPageContent } from "@/common/libs/page-content";
import OrganizationList from "@/modules/about/components/OrganizationList";
import { Suspense } from "react";

export default async function OrganisasiPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const content = await getPageContent("about", locale);

  return (
    <Suspense>
      <OrganizationList content={content} />
    </Suspense>
  );
}
