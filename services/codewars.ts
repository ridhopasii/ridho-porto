import axios from "axios";
import { z } from "zod";

import { CODEWARS_ACCOUNT } from "@/common/constants/codewars";

const { user_id } = CODEWARS_ACCOUNT;

const CODEWARS_ENDPOINT = `https://www.codewars.com/api/v1/users/${user_id}`;

const CodewarsUserSchema = z.object({
  username: z.string().optional(),
  name: z.string().optional(),
  honor: z.number().optional(),
  clan: z.string().optional(),
  leaderboardPosition: z.number().optional(),
  skills: z.array(z.string()).optional(),
  ranks: z.any().optional(),
  codeChallenges: z.object({
    totalAuthored: z.number().optional(),
    totalCompleted: z.number().optional(),
  }).optional(),
}).passthrough();

export const getCodewarsData = async () => {
  try {
    const response = await axios.get(CODEWARS_ENDPOINT);

    const status = response.status;
    const parsed = CodewarsUserSchema.safeParse(response.data);

    if (status > 400 || !parsed.success) {
      if (!parsed.success) {
        console.error("Codewars Validation Error:", parsed.error);
      }
      return { status, data: {} };
    }

    return { status, data: parsed.data };
  } catch (error) {
    console.error("Codewars API Error:", error);
    return { status: 500, data: {} };
  }
};
