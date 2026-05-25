import { NextRequest, NextResponse } from "next/server";
import { getTikTokProfile, getTikTokVideos } from "@/services/tiktok";

export const dynamic = "force-dynamic";

const MOCK_PROFILE = {
  avatar_large_url: "https://p16-common-sign.tiktokcdn.com/tos-alisg-avt-0068/23790cab1f6cb9cb31d358a40d6f7b86~tplv-tiktokx-cropcenter:1080:1080.jpeg",
  display_name: "Pebisnis Sukses",
  bio_description: "Produktifitas\nOn Ig @ridhopasii",
  profile_deep_link: "https://www.tiktok.com/@ridhopasii",
  username: "ridhopasii",
  follower_count: 1604,
  following_count: 347,
  likes_count: 43700,
  video_count: 64,
};

const MOCK_VIDEOS = [
  {
    id: "ridhopasii_1",
    title: "Halo Saya Ridho Robbi Pasi - TechnoPreneur | Digital Marketing",
    cover_image_url: "https://p16-common-sign.tiktokcdn.com/tos-alisg-avt-0068/23790cab1f6cb9cb31d358a40d6f7b86~tplv-tiktokx-cropcenter:1080:1080.jpeg",
    share_url: "https://www.tiktok.com/@ridhopasii",
    view_count: 1862,
    like_count: 154,
    comment_count: 12,
    share_count: 5,
    create_time: 1716500000,
    embed_link: "",
    embed_html: "",
    width: 1080,
    height: 1920,
  },
  {
    id: "ridhopasii_2",
    title: "1. Universitas Sumatera Utara (USU) 2. Universitas Sriwijaya (UNSRI)...",
    cover_image_url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=400&h=533&q=80",
    share_url: "https://www.tiktok.com/@ridhopasii",
    view_count: 2357,
    like_count: 210,
    comment_count: 34,
    share_count: 8,
    create_time: 1716300000,
    embed_link: "",
    embed_html: "",
    width: 1080,
    height: 1920,
  },
  {
    id: "ridhopasii_3",
    title: "SOLUSI AGAR TIDAK ADA LAGI PERISTIWA KECELAKAAN DI KRL",
    cover_image_url: "https://images.unsplash.com/photo-1541887309995-1f95c437f1cc?auto=format&fit=crop&w=400&h=533&q=80",
    share_url: "https://www.tiktok.com/@ridhopasii",
    view_count: 862,
    like_count: 89,
    comment_count: 5,
    share_count: 2,
    create_time: 1716100000,
    embed_link: "",
    embed_html: "",
    width: 1080,
    height: 1920,
  },
  {
    id: "ridhopasii_4",
    title: "1. Kuliah IT di Telkom 2. Jadi orang Bandung 3. Nongki di Braga",
    cover_image_url: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=400&h=533&q=80",
    share_url: "https://www.tiktok.com/@ridhopasii",
    view_count: 8456,
    like_count: 512,
    comment_count: 24,
    share_count: 15,
    create_time: 1715800000,
    embed_link: "",
    embed_html: "",
    width: 1080,
    height: 1920,
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (action === "profile") {
      try {
        const data = await getTikTokProfile();
        if (!data) {
          return NextResponse.json({ success: true, data: MOCK_PROFILE });
        }
        return NextResponse.json({ success: true, data });
      } catch (err) {
        console.warn("TikTok Profile fetch failed, using mock data.");
        return NextResponse.json({ success: true, data: MOCK_PROFILE });
      }
    }

    if (action === "videos") {
      try {
        const cursor = Number(searchParams.get("cursor") || 0);
        const limit = Number(searchParams.get("limit") || 20);
        const data = await getTikTokVideos(cursor, limit);
        if (!data || !data.videos || data.videos.length === 0) {
          return NextResponse.json({ success: true, videos: MOCK_VIDEOS, has_more: false, cursor: 0 });
        }
        return NextResponse.json({ success: true, ...data });
      } catch (err) {
        console.warn("TikTok Videos fetch failed, using mock data.");
        return NextResponse.json({ success: true, videos: MOCK_VIDEOS, has_more: false, cursor: 0 });
      }
    }

    return NextResponse.json({ error: "Action tidak valid" }, { status: 400 });
  } catch (error: any) {
    console.error("API Route Error:", error.message);
    // Safe ultimate fallback
    return NextResponse.json({ success: true, data: MOCK_PROFILE, videos: MOCK_VIDEOS, has_more: false, cursor: 0 });
  }
}
