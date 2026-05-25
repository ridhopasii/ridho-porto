export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { ADMIN_PASSWORD_SETTING_KEY, checkAdminAuth } from "@/common/libs/adminAuth";
import {
  hashPassword,
  getPasswordHash,
  upsertSetting,
} from "@/common/libs/password-settings";
import {
  PRIVATE_DASHBOARD_PASSWORD_SETTING_KEY,
} from "@/common/libs/privateDashboardAuth";

const ALLOWED_KEYS = new Set([
  ADMIN_PASSWORD_SETTING_KEY,
  PRIVATE_DASHBOARD_PASSWORD_SETTING_KEY,
]);

export async function GET() {
  if (!(await checkAdminAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [adminPasswordHash, privateDashboardPasswordHash] = await Promise.all([
    getPasswordHash(ADMIN_PASSWORD_SETTING_KEY, "ADMIN_PASSWORD"),
    getPasswordHash(
      PRIVATE_DASHBOARD_PASSWORD_SETTING_KEY,
      "PRIVATE_DASHBOARD_PASSWORD",
    ),
  ]);

  return NextResponse.json({
    adminPasswordSet: Boolean(adminPasswordHash),
    privateDashboardPasswordSet: Boolean(privateDashboardPasswordHash),
  });
}

export async function POST(req: Request) {
  if (!(await checkAdminAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { key, password } = await req.json();

    if (!ALLOWED_KEYS.has(key)) {
      return NextResponse.json({ error: "Invalid key" }, { status: 400 });
    }

    if (typeof password !== "string" || !password.trim()) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 },
      );
    }

    const hashed = hashPassword(password.trim());
    await upsertSetting(key, hashed);

    if (key === ADMIN_PASSWORD_SETTING_KEY) {
      (await cookies()).set("admin_token", hashed, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
