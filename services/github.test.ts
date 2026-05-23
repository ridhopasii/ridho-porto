import { expect, test, describe, vi } from "vitest";
import axios from "axios";

// Mock next/cache unstable_cache to be a simple pass-through
vi.mock("next/cache", () => ({
  unstable_cache: (cb: any) => cb,
}));

import { getGithubData } from "./github";

describe("GitHub Service", () => {
  test("should fetch and parse github data correctly", async () => {
    const mockUserResponse = {
      data: {
        data: {
          user: {
            contributionsCollection: {
              contributionCalendar: {
                colors: ["#ebedf0", "#9be9a8"],
                totalContributions: 120,
                months: [
                  {
                    firstDay: "2026-01-01",
                    name: "Jan",
                    totalWeeks: 4,
                  },
                ],
                weeks: [
                  {
                    contributionDays: [
                      {
                        color: "#9be9a8",
                        contributionCount: 5,
                        date: "2026-01-01",
                      },
                    ],
                    firstDay: "2026-01-01",
                  },
                ],
              },
            },
          },
        },
      },
    };

    // Spy on axios.post and return mock response
    const spy = vi.spyOn(axios, "post").mockResolvedValue(mockUserResponse);

    const result = await getGithubData();

    expect(result.status).toBe(200);
    expect(result.data).not.toBeNull();
    expect(result.data?.contributionsCollection.contributionCalendar.totalContributions).toBe(120);

    spy.mockRestore();
  });

  test("should handle validation error gracefully", async () => {
    const mockInvalidResponse = {
      data: {
        data: {
          user: {
            contributionsCollection: {
              // missing contributionCalendar
            },
          },
        },
      },
    };

    const spy = vi.spyOn(axios, "post").mockResolvedValue(mockInvalidResponse as any);
    const result = await getGithubData();

    expect(result.status).toBe(502);
    expect(result.data).toBeNull();

    spy.mockRestore();
  });
});
