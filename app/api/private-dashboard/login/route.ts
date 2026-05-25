export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  hashPassword,
  verifyPassword,
} from "@/common/libs/password-settings";
import { PRIVATE_DASHBOARD_PASSWORD_SETTING_KEY } from "@/common/libs/privateDashboardAuth";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    const isValid = await verifyPassword(
      PRIVATE_DASHBOARD_PASSWORD_SETTING_KEY,
      password,
      "PRIVATE_DASHBOARD_PASSWORD",
    );

    if (!isValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const token = hashPassword(password);

    (await cookies()).set("private_dashboard_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE() {
  (await cookies()).set("private_dashboard_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  return NextResponse.json({ success: true });
}
