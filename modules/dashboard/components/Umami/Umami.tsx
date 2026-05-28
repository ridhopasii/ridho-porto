"use client";

import { useState } from "react";
import useSWR from "swr";
import { SiUmami as UmamiIcon } from "react-icons/si";
import { BsBarChartFill } from "react-icons/bs";
import { AiOutlineLineChart } from "react-icons/ai";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

import UmamiSkeleton from "./UmamiSkeleton";
import TrafficTrendsChart from "./TrafficTrendsChart";
import Overview from "./Overview";
import ComboBoxFilter from "./ComboBoxFilter";

import SectionHeading from "@/common/components/elements/SectionHeading";
import SectionSubHeading from "@/common/components/elements/SectionSubHeading";
import EmptyState from "@/common/components/elements/EmptyState";
import { fetcher } from "@/services/fetcher";
import { UMAMI_ACCOUNT } from "@/common/constants/umami";

const Umami = () => {
  const searchParams = useSearchParams();
  const domain = searchParams.get("domain") || "all";
  const [chartType, setChartType] = useState<"bar" | "line">("bar");

  const key = `/api/umami?domain=${domain}`;

  const { data, isLoading, error } = useSWR(key, fetcher);
  const { is_active } = UMAMI_ACCOUNT;
  const t = useTranslations("DashboardPage");

  if (!is_active) return null;

  return (
    <section className="space-y-4">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="space-y-2">
          <SectionHeading title={t("umami.title")} icon={<UmamiIcon />} />
          <SectionSubHeading>
            <p>{t("umami.sub_title")}</p>
          </SectionSubHeading>
        </div>

        <ComboBoxFilter />
      </div>

      {error ? (
        <EmptyState message={t("error")} />
      ) : isLoading ? (
        <UmamiSkeleton />
      ) : (
        <div className="space-y-6">
          <Overview data={data} />
          
          <div className="space-y-3">
            <div className="flex justify-end">
              <div className="flex items-center gap-1 rounded-lg border border-neutral-200 bg-white p-1 dark:border-neutral-800 dark:bg-neutral-950">
                <button
                  onClick={() => setChartType("bar")}
                  className={`rounded-md p-1.5 transition-colors ${chartType === "bar" ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white" : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"}`}
                  aria-label="Bar Chart"
                >
                  <BsBarChartFill size={16} />
                </button>
                <button
                  onClick={() => setChartType("line")}
                  className={`rounded-md p-1.5 transition-colors ${chartType === "line" ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white" : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"}`}
                  aria-label="Line Chart"
                >
                  <AiOutlineLineChart size={16} />
                </button>
              </div>
            </div>
            <TrafficTrendsChart data={data} type={chartType} />
          </div>
        </div>
      )}
    </section>
  );
};

export default Umami;
