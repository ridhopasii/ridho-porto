import { NextRequest, NextResponse } from "next/server";
import { getTikTokProfile, getTikTokVideos } from "@/services/tiktok";

export const dynamic = "force-dynamic";

const MOCK_PROFILE = {
  avatar_large_url: "/profile.webp",
  avatar_medium_url: "/profile.webp",
  avatar_thumb_url: "/profile.webp",
  aweme_count: 0,
  aweme_cover_count: 0,
  aweme_cover_url: "",
  bind_phone: "",
  bio_description: "",
  bio_url: "",
  can_set_geofencing: null,
  cancel_type: 0,
  city: "",
  commerce_user_level: 0,
  country: "ID",
  cover_url: [],
  create_time: 1684307371,
  custom_verify: "",
  cv_level: "",
  district: "",
  download_setting: 0,
  enterprise_verify_reason: "",
  follower_count: 0,
  following_count: 0,
  favoriting_count: 0,
  gender: 0,
  has_orders: false,
  hide_search: false,
  ins_id: "",
  is_ad_fake: false,
  is_block: false,
  is_discipline_member: false,
  is_star: false,
  language: "id",
  live_agreement: 0,
  live_verify: 0,
  mplatform_followers_count: 0,
  nickname: "TikTok Data",
  region: "ID",
  room_id: 0,
  sec_uid: "",
  secret: 0,
  share_info: {
    share_desc: "",
    share_desc_info: "",
    share_image_url: {
      url_list: [],
    },
    share_qrcode_url: {
      url_list: [],
    },
    share_title: "",
    share_title_myself: "",
    share_title_other: "",
    share_url: "",
  },
  short_id: "",
  signature: "",
  status: 1,
  total_favorited: 0,
  tw_id: "",
  uid: "7234125816912380934",
  unique_id: "tiktok",
  user_canceled: false,
  user_mode: 0,
  user_period: 0,
  user_rate: 1,
  video_icon: {
    url_list: [],
  },
  with_commerce_entry: false,
  with_fusion_shop_entry: false,
  with_shop_entry: false,
  youtube_channel_id: "",
  youtube_channel_title: "",
  youtube_expire_time: 0,
  original_musician: {
    music_count: 0,
    music_used_count: 0,
  },
  advanced_feature_info: [],
};

const MOCK_VIDEOS = [
  {
    id: "ridhopasii_1",
    title: "Halo Saya Ridho Robbi Pasi - TechnoPreneur | Digital Marketing",
    cover_image_url: "/profile.webp",
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
    cover_image_url: "/profile.webp",
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
    cover_image_url: "/profile.webp",
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
