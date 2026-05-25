export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import {
  hashPassword,
  verifyPassword,
} from "@/common/libs/password-settings";
import { ADMIN_PASSWORD_SETTING_KEY } from "@/common/libs/adminAuth";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    const isValid = await verifyPassword(
      ADMIN_PASSWORD_SETTING_KEY,
      password,
      "ADMIN_PASSWORD",
    );

    if (!isValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const token = hashPassword(password);
    const cookieStore = await cookies();

    cookieStore.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

