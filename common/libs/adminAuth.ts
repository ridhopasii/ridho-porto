import { timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

import { getPasswordHash } from "./password-settings";

export const ADMIN_PASSWORD_SETTING_KEY = "admin_password_hash";

export async function checkAdminAuth() {
  const token = (await cookies()).get("admin_token")?.value;
  if (!token) return false;

  const expectedToken = await getPasswordHash(
    ADMIN_PASSWORD_SETTING_KEY,
    "ADMIN_PASSWORD",
  );
  if (!expectedToken) return false;

  const a = Buffer.from(token);
  const b = Buffer.from(expectedToken);
  return a.length === b.length && timingSafeEqual(a, b);
}
