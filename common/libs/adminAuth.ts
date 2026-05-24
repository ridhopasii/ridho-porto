import { cookies } from "next/headers";
import crypto from "crypto";

export function checkAdminAuth() {
  const token = cookies().get("admin_token")?.value;
  if (!token) return false;

  const correctPassword = process.env.ADMIN_PASSWORD;
  if (!correctPassword) return false;

  const expectedToken = crypto
    .createHash("sha256")
    .update(correctPassword + process.env.NEXTAUTH_SECRET)
    .digest("hex");

  return token === expectedToken;
}
