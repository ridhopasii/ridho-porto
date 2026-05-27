export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getProfileData } from "@/services/profile";

const DEFAULT_AVATAR = "/profile.webp";

export const GET = async () => {
  try {
    const data = await getProfileData();

    if (!data) {
      return NextResponse.json(
        { avatarUrl: DEFAULT_AVATAR },
        { status: 200 },
      );
    }

    const fetchedAvatar = data.avatarUrl || DEFAULT_AVATAR;
    const finalAvatar = fetchedAvatar.includes("github.com") ? DEFAULT_AVATAR : fetchedAvatar;

    return NextResponse.json(
      {
        ...data,
        avatarUrl: finalAvatar,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Profile API Error:", error.message);
    return NextResponse.json(
      { avatarUrl: DEFAULT_AVATAR },
      { status: 200 },
    );
  }
};
