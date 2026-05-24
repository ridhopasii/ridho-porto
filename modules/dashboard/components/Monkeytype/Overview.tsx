import { useTranslations } from "next-intl";

import OverviewItem from "./OverviewItem";

interface OverviewProps {
  data: any;
}

const Overview = ({ data }: OverviewProps) => {
  const t = useTranslations("DashboardPage.monkeytype");

  if (!data || !data.personalBests) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <OverviewItem data={data.personalBests.time} type={t("unit_time")} />
      <OverviewItem data={data.personalBests.words} type={t("unit_words")} />
    </div>
  );
};

export default Overview;
