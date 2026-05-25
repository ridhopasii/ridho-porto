export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getProfileData } from "@/services/profile";

const DEFAULT_AVATAR =
  "https://github.com/ridhopasii.png";

export const GET = async () => {
  try {
    const data = await getProfileData();

    if (!data) {
      return NextResponse.json(
        {
          fullName: "Ridho Robbi Pasi",
          title: "Fullstack Developer",
          avatarUrl: DEFAULT_AVATAR,
          location: "Aceh, Indonesia",
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      {
        ...data,
        avatarUrl: data.avatarUrl || DEFAULT_AVATAR,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Profile API Error:", error.message);
    return NextResponse.json(
      {
        fullName: "Ridho Robbi Pasi",
        title: "Fullstack Developer",
        avatarUrl: DEFAULT_AVATAR,
        location: "Aceh, Indonesia",
      },
      { status: 200 },
    );
  }
};
