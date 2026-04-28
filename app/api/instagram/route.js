import { NextResponse } from 'next/server';

export async function GET() {
  const token = process.env.INSTAGRAM_TOKEN;

  if (!token) {
    console.error('[Instagram API] Token missing in process.env');
    return NextResponse.json({ error: 'INSTAGRAM_TOKEN not configured in .env' }, { status: 400 });
  }

  try {
    console.log('[Instagram API] Fetching media...');
    // Fetch user media from Instagram Basic Display API
    const response = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${token}`
    );

    console.log('[Instagram API] Status:', response.status);
    const data = await response.json();

    if (data.error || !response.ok) {
      const errMsg = data.error?.message || 'Instagram API Error';
      console.error('[Instagram API] Error:', errMsg);
      throw new Error(errMsg);
    }

    // Filter out videos if you only want images, or use thumbnail_url for videos
    const processedData = data.data.map(item => ({
      ...item,
      media_url: item.media_type === 'VIDEO' ? item.thumbnail_url : item.media_url
    }));

    return NextResponse.json({ data: processedData });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
