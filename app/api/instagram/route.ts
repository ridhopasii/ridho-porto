import { NextResponse } from "next/server";
import { getInstagramMedia } from "@/services/instagram";

export const dynamic = "force-dynamic";

const MOCK_INSTAGRAM_POSTS = [
  {
    id: "insta_1",
    caption: "My current workspace setup for fullstack development! 💻🔥 Loving the clean, minimal aesthetic. Rate it 1-10! #workspace #setup #developer #deskgoals #webdev",
    media_type: "IMAGE",
    media_url: "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800&h=800&q=80",
    permalink: "https://www.instagram.com/",
    timestamp: "2026-05-20T12:00:00Z"
  },
  {
    id: "insta_2",
    caption: "TypeScript tips for clean, robust React applications! 💡 Always type your components properly and leverage generic types. #typescript #reactjs #webdev #frontend",
    media_type: "IMAGE",
    media_url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&h=800&q=80",
    permalink: "https://www.instagram.com/",
    timestamp: "2026-05-18T15:30:00Z"
  },
  {
    id: "insta_3",
    caption: "Designing a glassmorphic dashboard interface. UI/UX matters just as much as backend performance! 🎨✨ #uiux #design #css #tailwindcss #figma",
    media_type: "IMAGE",
    media_url: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=800&h=800&q=80",
    permalink: "https://www.instagram.com/",
    timestamp: "2026-05-15T09:45:00Z"
  },
  {
    id: "insta_4",
    caption: "Capturing the beauty of minimal architecture. Geometry and light are everything. 🏙️📸 #photography #minimalism #architecture #creative",
    media_type: "IMAGE",
    media_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&h=800&q=80",
    permalink: "https://www.instagram.com/",
    timestamp: "2026-05-10T18:20:00Z"
  },
  {
    id: "insta_5",
    caption: "Fueling the day with some fresh coffee and system design brainstorming. ☕️📊 #coffee #coding #systemdesign #softwareengineering #developerlife",
    media_type: "IMAGE",
    media_url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&h=800&q=80",
    permalink: "https://www.instagram.com/",
    timestamp: "2026-05-08T08:00:00Z"
  },
  {
    id: "insta_6",
    caption: "Brainstorming and solving complex algorithms with the team. Collaborative environments always spark the best ideas! 🚀💡 #teamwork #collaboration #agile #hackathon",
    media_type: "IMAGE",
    media_url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&h=800&q=80",
    permalink: "https://www.instagram.com/",
    timestamp: "2026-05-05T14:10:00Z"
  }
];

export async function GET() {
  try {
    const response = await getInstagramMedia();
    if (!response || !response.data || response.data.length === 0) {
      return NextResponse.json({ success: true, data: MOCK_INSTAGRAM_POSTS });
    }
    return NextResponse.json({ success: true, data: response.data });
  } catch (error) {
    console.warn("Instagram API fetch failed, falling back to mock posts.");
    return NextResponse.json({ success: true, data: MOCK_INSTAGRAM_POSTS });
  }
}
