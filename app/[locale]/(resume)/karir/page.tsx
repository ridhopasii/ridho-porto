import { getPageContent } from "@/common/libs/page-content";
import CareerList from "@/modules/about/components/CareerList";
import { Suspense } from "react";

export default async function KarirPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const content = await getPageContent("about", locale);

  return (
    <Suspense>
      <CareerList content={content} />
    </Suspense>
  );
}
