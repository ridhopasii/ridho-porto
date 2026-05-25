import { cookies } from "next/headers";

import { getPasswordHash } from "./password-settings";

export const PRIVATE_DASHBOARD_PASSWORD_SETTING_KEY =
  "private_dashboard_password_hash";

export async function checkPrivateDashboardAuth() {
  const token = (await cookies()).get("private_dashboard_token")?.value;
  if (!token) return false;

  const expectedToken = await getPasswordHash(
    PRIVATE_DASHBOARD_PASSWORD_SETTING_KEY,
    "PRIVATE_DASHBOARD_PASSWORD",
  );
  if (!expectedToken) return false;

  return token === expectedToken;
}

