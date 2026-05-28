"use client";

import { useRouter } from "next/navigation";
import { m as motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { GiExtraTime as CTAIcon } from "react-icons/gi";
import { GiTimeTrap as ServiceIcon } from "react-icons/gi";
import useSWR from "swr";

import Card from "@/common/components/elements/Card";
import Button from "@/common/components/elements/Button";
import SectionHeading from "@/common/components/elements/SectionHeading";
import SectionSubHeading from "@/common/components/elements/SectionSubHeading";
import DynamicIcon from "@/common/components/DynamicIcon";
import { fetcher } from "@/services/fetcher";

const Services = () => {
  const t = useTranslations("HomePage.services");
  const router = useRouter();

  const { data: services } = useSWR("/api/admin/services", fetcher);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <SectionHeading title={t("title")} icon={<ServiceIcon size={24} />} />
        <SectionSubHeading>{t("sub_title")}</SectionSubHeading>
      </div>

      {services && services.length > 0 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {services.map((item: any) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="group relative overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              {/* Glassmorphic Top Gradient Highlight */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50/50 via-transparent to-transparent dark:from-blue-950/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-all duration-300">
                  {item.icon?.startsWith("http") || item.icon?.startsWith("/") ? (
                    <img src={item.icon} alt={item.title} className="w-8 h-8 object-contain" />
                  ) : (
                    <DynamicIcon name={item.icon || "HiOutlineBriefcase"} size={24} />
                  )}
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-lg text-neutral-800 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                    {item.title}
                  </h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* CTA Section */}
      <Card className="space-y-4 p-6 relative overflow-hidden group">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-500/5 via-transparent to-transparent dark:from-blue-500/10 opacity-100" />
        <div className="flex items-center gap-2">
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              duration: 1,
              repeat: Infinity,
              repeatType: "loop",
            }}
          >
            <CTAIcon size={27} className="text-blue-600 dark:text-blue-400" />
          </motion.div>
          <p className="text-lg font-medium text-neutral-900 dark:text-neutral-50">
            {t("cta.title")}
          </p>
        </div>
        <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
          {t("cta.sub_title")}
        </p>
        <Button
          className="transition duration-300 hover:scale-105 active:scale-95 bg-blue-600 hover:bg-blue-700 text-white border-none shadow-sm shadow-blue-500/20"
          onClick={() => router.push("/#contact")}
        >
          {t("cta.button")}
        </Button>
      </Card>
    </section>
  );
};

export default Services;
