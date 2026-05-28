import Image from "next/image";
import { differenceInDays, format } from "date-fns";
import { m as motion, Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import useSWR from "swr";

import Tooltip from "@/common/components/elements/Tooltip";
import SpotlightCard from "@/common/components/elements/SpotlightCard";
import { MonkeytypeData } from "@/common/types/monkeytype";
import { fetcher } from "@/services/fetcher";

interface ProfileProps {
  data: MonkeytypeData;
}

interface ItemProps {
  label?: string;
  value?: number | string;
}

const DEFAULT_AVATAR = "/profile.webp";

const Item = ({ label, value }: ItemProps) => (
  <div className="flex flex-col items-center justify-center">
    <span className="text-xs text-neutral-600 dark:text-neutral-400 text-center">
      {label}
    </span>
    <span className="text-xl font-medium text-primary mt-1">{value}</span>
  </div>
);

const Profile = ({ data }: ProfileProps) => {
  const t = useTranslations("DashboardPage.monkeytype");
  const { data: profile } = useSWR("/api/profile", fetcher);

  const avatarUrl = profile?.avatarUrl || DEFAULT_AVATAR;
  const fullName = profile?.fullName || "Ridho Robbi Pasi";

  if (!data || !data.typingStats) {
    return null;
  }

  const date = new Date(data?.addedAt);
  const endDate = new Date();
  const durationDays = differenceInDays(endDate, date);

  const timeTyping = data?.typingStats.timeTyping;
  const minutes = Math.floor(timeTyping / 60);
  const seconds = Math.round(timeTyping % 60);

  let xp = data?.xp;
  let level = 1;
  let xpNeeded = 100;

  while (xp >= xpNeeded) {
    xp -= xpNeeded;
    xpNeeded += 49;
    level++;
  }

  const xpToNextLevel = level * 49 + 100;
  const difference = (xp / xpToNextLevel) * 100;
  const remainder = xpToNextLevel - xp;

  const progressVariants: Variants = {
    initial: { width: 0 },
    animate: {
      width: `${Math.round(difference)}px`,
      transition: { delay: 0.8 },
    },
  };

  const XpProgress = () => (
    <div className="flex w-full items-center justify-between gap-3">
      <Tooltip title={`${data?.xp} ${t("total_xp")}`}>
        <span className="text-sm font-medium text-primary">{level}</span>
      </Tooltip>

      <div className="relative h-2 w-full rounded-full bg-neutral-300 dark:bg-dark ">
        <motion.span
          initial="initial"
          animate="animate"
          variants={progressVariants}
          className="absolute left-0 top-0 h-2 rounded-full bg-neutral-600 dark:bg-neutral-50"
        >
          &ensp;
        </motion.span>
      </div>

      <Tooltip title={`${remainder} xp until next level`}>
        <span className="text-xs text-neutral-600 dark:text-neutral-400">
          {xp}/{Math.floor(xpToNextLevel)}
        </span>
      </Tooltip>
    </div>
  );

  return (
    <SpotlightCard className="flex flex-col p-6">
      <div className="flex w-full flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Image
              src={avatarUrl}
              width={64}
              height={64}
              alt={fullName}
              className="rounded-full border-2 border-neutral-400 transition-all duration-300 dark:border-neutral-600"
            />
            <div className="flex flex-col">
              <span className="text-xl font-medium text-primary">
                {data?.name}
              </span>
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                {data?.details?.bio || "Just typing..."}
              </span>
            </div>
          </div>
          <div className="flex flex-col text-sm text-neutral-600 dark:text-neutral-400 sm:text-right">
            <span>{t("joined")} {format(date, "dd MMM yyyy")}</span>
            <span>{t("current_streak")}: {data?.streak} {t("unit_days")}</span>
            <span>Keyboard: {data?.details?.keyboard || "Custom Build"}</span>
          </div>
        </div>

        <XpProgress />

        <div className="grid grid-cols-3 divide-x divide-neutral-200 rounded-xl bg-neutral-100 p-4 dark:divide-neutral-800 dark:bg-neutral-900/50">
          <Item
            label={t("title_test_started")}
            value={data?.typingStats.startedTests || "N/A"}
          />
          <Item
            label={t("title_test_completed")}
            value={data?.typingStats.completedTests || "N/A"}
          />
          <Item
            label={t("title_time_typing")}
            value={
              format(new Date(0, 0, 0, 0, minutes, seconds), "HH:mm:ss") || "N/A"
            }
          />
        </div>
      </div>
    </SpotlightCard>
  );
};

export default Profile;
