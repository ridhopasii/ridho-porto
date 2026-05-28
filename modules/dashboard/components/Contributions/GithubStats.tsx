import { FiUsers, FiUserCheck, FiBook } from "react-icons/fi";

interface GithubStatsProps {
  followers: number;
  following: number;
  repositories: number;
}

const StatItem = ({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) => (
  <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-lg text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400">
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{value}</p>
      <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">{label}</p>
    </div>
  </div>
);

const GithubStats = ({ followers, following, repositories }: GithubStatsProps) => {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <StatItem label="Followers" value={followers} icon={<FiUsers />} />
      <StatItem label="Following" value={following} icon={<FiUserCheck />} />
      <StatItem label="Repositories" value={repositories} icon={<FiBook />} />
    </div>
  );
};

export default GithubStats;
