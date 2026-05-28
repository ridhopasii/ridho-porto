import { Suspense } from "react";
import Achievements from "@/modules/achievements";
import {
  getAchievementsData,
  getAchivementCategories,
  getAchivementTypes,
} from "@/services/achievements";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PencapaianPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  
  const category = typeof sp.category === "string" ? sp.category : undefined;
  const search = typeof sp.search === "string" ? sp.search : undefined;

  const [achievements, categoriesData, typesData] = await Promise.all([
    getAchievementsData({ category, search }),
    getAchivementCategories(),
    getAchivementTypes(),
  ]);

  return (
    <Suspense>
      <Achievements 
        achievements={achievements} 
        categoriesData={categoriesData} 
        typesData={typesData} 
      />
    </Suspense>
  );
}
