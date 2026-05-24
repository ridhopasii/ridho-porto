import axios from "axios";

export interface InstagramMediaItem {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  permalink: string;
  thumbnail_url?: string;
  timestamp: string;
}

export async function getInstagramMedia(): Promise<{ data: InstagramMediaItem[] }> {
  const token = process.env.INSTAGRAM_TOKEN;
  
  if (!token) {
    throw new Error("Instagram access token is not configured.");
  }

  try {
    const response = await axios.get(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${token}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Instagram API Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.error?.message || error.message);
  }
}
