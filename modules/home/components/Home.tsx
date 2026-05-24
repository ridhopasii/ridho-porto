import { Suspense } from "react";

import Breakline from "@/common/components/elements/Breakline";

import HeroSection from "./HeroSection";
import HomeSkills from "./HomeSkills";
import FeaturedProjects from "./FeaturedProjects";
import RecentPosts from "./RecentPosts";

// Skeleton loaders
const SectionSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    <div className="space-y-2">
      <div className="h-5 w-36 rounded-lg bg-neutral-200 dark:bg-neutral-800" />
      <div className="h-4 w-52 rounded-lg bg-neutral-100 dark:bg-neutral-850" />
    </div>
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-40 rounded-xl bg-neutral-100 dark:bg-neutral-800"
        />
      ))}
    </div>
  </div>
);

const Home = () => {
  return (
    <div className="space-y-10 pb-10">
      {/* Hero / Introduction */}
      <HeroSection />

      <Breakline />

      {/* Tech Skills */}
      <Suspense
        fallback={
          <div className="animate-pulse space-y-3">
            <div className="h-5 w-24 rounded bg-neutral-200 dark:bg-neutral-800" />
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="h-8 w-20 rounded-full bg-neutral-100 dark:bg-neutral-800"
                />
              ))}
            </div>
          </div>
        }
      >
        <HomeSkills />
      </Suspense>

      <Breakline />

      {/* Featured Projects */}
      <Suspense fallback={<SectionSkeleton />}>
        <FeaturedProjects />
      </Suspense>

      <Breakline />

      {/* Recent Blog Posts */}
      <Suspense
        fallback={
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex gap-4 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800"
              >
                <div className="w-20 h-14 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-16 rounded bg-neutral-100 dark:bg-neutral-800" />
                  <div className="h-4 w-48 rounded bg-neutral-200 dark:bg-neutral-700" />
                  <div className="h-3 w-full rounded bg-neutral-100 dark:bg-neutral-800" />
                </div>
              </div>
            ))}
          </div>
        }
      >
        <RecentPosts />
      </Suspense>
    </div>
  );
};

export default Home;
