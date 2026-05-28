import Link from "next/link";
import { AiOutlineStar, AiOutlineFork } from "react-icons/ai";
import { VscRepo } from "react-icons/vsc";

export interface PinnedRepo {
  name: string;
  description?: string;
  url: string;
  stargazerCount: number;
  forkCount: number;
  primaryLanguage?: {
    name: string;
    color: string;
  };
}

interface PinnedReposProps {
  repos: PinnedRepo[];
}

const PinnedRepos = ({ repos }: PinnedReposProps) => {
  if (!repos || repos.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        {repos.map((repo, idx) => (
          <Link
            key={idx}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col justify-between space-y-4 rounded-2xl border border-neutral-200 bg-white p-4 transition-all hover:scale-[1.02] hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-neutral-700"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <VscRepo className="text-neutral-500" size={18} />
                <span className="font-semibold text-blue-600 dark:text-blue-400 group-hover:underline">
                  {repo.name}
                </span>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">
                {repo.description || "No description provided."}
              </p>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-neutral-500">
              {repo.primaryLanguage && (
                <div className="flex items-center gap-1.5">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: repo.primaryLanguage.color || "#ccc" }}
                  />
                  <span>{repo.primaryLanguage.name}</span>
                </div>
              )}
              {repo.stargazerCount > 0 && (
                <div className="flex items-center gap-1 hover:text-neutral-900 dark:hover:text-neutral-300">
                  <AiOutlineStar size={14} />
                  <span>{repo.stargazerCount}</span>
                </div>
              )}
              {repo.forkCount > 0 && (
                <div className="flex items-center gap-1 hover:text-neutral-900 dark:hover:text-neutral-300">
                  <AiOutlineFork size={14} />
                  <span>{repo.forkCount}</span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PinnedRepos;
