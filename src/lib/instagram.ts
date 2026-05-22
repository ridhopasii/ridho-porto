export interface InstagramPost {
  id: string;
  caption: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
}

export async function fetchInstagramFeed(limit: number = 6): Promise<InstagramPost[]> {
  try {
    const token = import.meta.env.VITE_INSTAGRAM_TOKEN;
    if (!token) {
      console.warn("Instagram token is missing in .env");
      return [];
    }

    const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&access_token=${token}&limit=${limit}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Instagram API Error:", errorData);
      return [];
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Failed to fetch Instagram feed:", error);
    return [];
  }
}
