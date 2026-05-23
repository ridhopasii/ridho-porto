import axios from "axios";
import { z } from "zod";

import { MONKEYTYPE_ACCOUNT } from "@/common/constants/monkeytype";

const { username, api_key } = MONKEYTYPE_ACCOUNT;

const USER_ENDPOINT = `https://api.monkeytype.com/users/${username}/profile`;

const MonkeytypeUserSchema = z.object({
  name: z.string().optional(),
  banned: z.boolean().optional(),
  addedAt: z.number().optional(),
  typingStats: z.any().optional(),
  personalBests: z.any().optional(),
}).passthrough();

export const getMonkeytypeData = async () => {
  try {
    const response = await axios.get(USER_ENDPOINT, {
      headers: {
        Authorization: `ApeKey ${api_key}`,
      },
    });

    const status = response.status;
    const responseJson = response.data;

    if (status > 400) {
      return { status, data: {} };
    }

    const parsed = MonkeytypeUserSchema.safeParse(responseJson?.data);
    if (!parsed.success) {
      console.error("Monkeytype Validation Error:", parsed.error);
      return { status, data: {} };
    }

    return { status, data: parsed.data };
  } catch (error) {
    console.error("Monkeytype API Error:", error);
    return { status: 500, data: {} };
  }
};
