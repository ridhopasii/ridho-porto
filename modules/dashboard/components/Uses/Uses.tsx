"use client";

import useSWR from "swr";
import { TbTools as ToolsIcon } from "react-icons/tb";
import { useTranslations } from "next-intl";

import UsesSkeleton from "./UsesSkeleton";
import SectionHeading from "@/common/components/elements/SectionHeading";
import SectionSubHeading from "@/common/components/elements/SectionSubHeading";
import EmptyState from "@/common/components/elements/EmptyState";
import { fetcher } from "@/services/fetcher";

const Uses = () => {
  const { data: uses, isLoading, error } = useSWR("/api/uses", fetcher);
  const t = useTranslations("DashboardPage");

  const categories = uses ? Array.from(new Set(uses.map((u: any) => u.category))) : [];

  return (
    <section className="space-y-4">
      <SectionHeading
        title={t("uses.title")}
        icon={<ToolsIcon className="mr-1 text-teal-500" size={22} />}
      />
      <SectionSubHeading>
        <p>{t("uses.sub_title")}</p>
      </SectionSubHeading>

      {error ? (
        <EmptyState message={t("error")} />
      ) : isLoading ? (
        <UsesSkeleton />
      ) : categories.length === 0 ? (
        <p className="text-neutral-500 italic text-sm text-center py-4">Belum ada data peralatan.</p>
      ) : (
        <div className="space-y-8">
          {categories.map((category) => (
            <div key={category as string} className="space-y-3" data-aos="fade-up">
              <h3 className="text-md font-semibold text-neutral-800 dark:text-neutral-200 border-b border-neutral-150 dark:border-neutral-800 pb-1 w-fit">
                {category as string}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {uses
                  ?.filter((u: any) => u.category === category)
                  .map((item: any) => {
                    const CardElement = item.url ? "a" : "div";
                    const isLink = !!item.url;
                    return (
                      <CardElement
                        key={item.id}
                        href={item.url || undefined}
                        target={isLink ? "_blank" : undefined}
                        rel={isLink ? "noopener noreferrer" : undefined}
                        className={`group block p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm transition-all duration-300 ${
                          isLink
                            ? "hover:border-teal-500/50 dark:hover:border-teal-500/50 hover:shadow-md hover:shadow-teal-500/5 dark:hover:shadow-teal-500/5 hover:-translate-y-0.5 cursor-pointer"
                            : ""
                        }`}
                      >
                        <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-teal-500 transition-colors duration-200">
                          {item.name}
                        </h4>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      </CardElement>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Uses;
