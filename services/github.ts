import axios from "axios";
import { GITHUB_ACCOUNTS } from "@/common/constants/github";
import { unstable_cache } from "next/cache";
import { z } from "zod";

const GITHUB_USER_ENDPOINT = "https://api.github.com/graphql";

const GithubContributionDaySchema = z.object({
  color: z.string(),
  contributionCount: z.number(),
  date: z.string(),
});

const GithubWeekSchema = z.object({
  contributionDays: z.array(GithubContributionDaySchema),
  firstDay: z.string(),
});

const GithubMonthSchema = z.object({
  firstDay: z.string(),
  name: z.string(),
  totalWeeks: z.number(),
});

const GithubUserSchema = z.object({
  contributionsCollection: z.object({
    contributionCalendar: z.object({
      colors: z.array(z.string()),
      totalContributions: z.number(),
      months: z.array(GithubMonthSchema),
      weeks: z.array(GithubWeekSchema),
    }),
  }),
});

const GITHUB_USER_QUERY = `query($username: String!) {
  user(login: $username) {
    contributionsCollection {
      contributionCalendar {
        colors
        totalContributions
        months {
          firstDay
          name
          totalWeeks
        }
        weeks {
          contributionDays {
            color
            contributionCount
            date
          }
          firstDay
        }
      }
    }
  }
}`;

const fetchGithubData = async (username: string, token: string | undefined) => {
  try {
    if (!token && process.env.NODE_ENV !== "test") {
      console.warn("GitHub API: No token provided.");
      return null;
    }
    const response = await axios.post(
      GITHUB_USER_ENDPOINT,
      {
        query: GITHUB_USER_QUERY,
        variables: { username },
      },
      {
        headers: { Authorization: `bearer ${token}` },
      },
    );

    const parsed = GithubUserSchema.safeParse(response.data?.data?.user);
    if (!parsed.success) {
      console.error("GitHub API Validation Error:", parsed.error);
      return null;
    }

    return parsed.data;
  } catch (error) {
    console.error("GitHub API Error:", error);
    return null;
  }
};

const getCachedGithubData = unstable_cache(
  async (username: string, token: string | undefined) =>
    fetchGithubData(username, token),
  ["github-stats-cache-key"],
  {
    revalidate: 3600,
    tags: ["github-stats-tag"],
  },
);

export const getGithubData = async () => {
  const { username, token } = GITHUB_ACCOUNTS;

  if (!username) {
    return { status: 500, data: null };
  }

  const data = await getCachedGithubData(username, token);

  if (!data) {
    return { status: 502, data: null };
  }

  return { status: 200, data };
};
