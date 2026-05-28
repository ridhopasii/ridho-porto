import { getPageContent } from "@/common/libs/page-content";
import EducationList from "@/modules/about/components/EducationList";
import { Suspense } from "react";

export default async function PendidikanPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const content = await getPageContent("about", locale);

  return (
    <Suspense>
      <EducationList content={content} />
    </Suspense>
  );
}
