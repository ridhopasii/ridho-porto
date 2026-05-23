import { WAKATIME_ACCOUNT } from "@/common/constants/wakatime";
import axios from "axios";
import { unstable_cache } from "next/cache";
import { z } from "zod";

const { api_key, base_url, all_time_endpoint, stats_endpoint } =
  WAKATIME_ACCOUNT;

const WakatimeStatsSchema = z.object({
  start: z.string().optional(),
  end: z.string().optional(),
  modified_at: z.string().optional(),
  best_day: z.object({
    date: z.string().optional(),
    text: z.string().optional(),
  }).optional().nullable(),
  human_readable_daily_average_including_other_language: z.string().optional(),
  human_readable_total_including_other_language: z.string().optional(),
  languages: z.array(z.any()).optional(),
  editors: z.array(z.any()).optional(),
}).passthrough();

const WakatimeAllTimeSchema = z.object({
  text: z.string().optional(),
  total_seconds: z.number().optional(),
}).passthrough();

const fetchReadStats = async () => {
  try {
    const response = await axios.get(
      `${base_url}${stats_endpoint}/last_7_days`,
      {
        headers: { Authorization: `Basic ${api_key}` },
      },
    );

    const parsed = WakatimeStatsSchema.safeParse(response.data?.data);
    if (!parsed.success) {
      console.error("Wakatime Stats Validation Error:", parsed.error);
      return { data: {} as any };
    }
    const safeData = parsed.data;

    return {
      data: {
        start_date: safeData.start,
        end_date: safeData.end,
        last_update: safeData.modified_at,
        best_day: {
          date: safeData.best_day?.date,
          text: safeData.best_day?.text,
        },
        human_readable_daily_average:
          safeData.human_readable_daily_average_including_other_language,
        human_readable_total:
          safeData.human_readable_total_including_other_language,
        languages: safeData.languages?.slice(0, 6),
        editors: safeData.editors,
      },
    };
  } catch (error) {
    console.error("Wakatime Stats Error:", error);
    return { data: {} as any };
  }
};

const fetchAllTimeSinceToday = async () => {
  try {
    const response = await axios.get(`${base_url}${all_time_endpoint}`, {
      headers: { Authorization: `Basic ${api_key}` },
    });

    const parsed = WakatimeAllTimeSchema.safeParse(response.data?.data);
    if (!parsed.success) {
      console.error("Wakatime All Time Validation Error:", parsed.error);
      return { data: {} as any };
    }
    const safeData = parsed.data;

    return {
      data: {
        text: safeData.text,
        total_seconds: safeData.total_seconds,
      },
    };
  } catch (error) {
    console.error("Wakatime All Time Error:", error);
    return { data: {} as any };
  }
};

export const getReadStats = unstable_cache(
  async () => fetchReadStats(),
  ["wakatime-read-stats-key"],
  { revalidate: 3600, tags: ["wakatime-stats-tag"] },
);

export const getAllTimeSinceToday = unstable_cache(
  async () => fetchAllTimeSinceToday(),
  ["wakatime-all-time-key"],
  { revalidate: 3600, tags: ["wakatime-all-time-tag"] },
);
