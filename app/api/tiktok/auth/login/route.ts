import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY;
  if (!CLIENT_KEY) {
    return NextResponse.json({ error: "TIKTOK_CLIENT_KEY is missing in .env" }, { status: 500 });
  }

  // Generate a random state for CSRF protection
  const state = Math.random().toString(36).substring(7);
  
  // Scopes required to fetch profile and videos
  const scopes = "user.info.basic,video.list";
  
  // The redirect URI must exactly match the one configured in TikTok Developer Portal
  // Usually it should be your full domain + /api/tiktok/auth/callback
  const redirectUri = `${process.env.BASE_URL || "http://localhost:3000"}/api/tiktok/auth/callback`;

  const authUrl = new URL("https://www.tiktok.com/v2/auth/authorize/");
  authUrl.searchParams.append("client_key", CLIENT_KEY);
  authUrl.searchParams.append("scope", scopes);
  authUrl.searchParams.append("response_type", "code");
  authUrl.searchParams.append("redirect_uri", redirectUri);
  authUrl.searchParams.append("state", state);

  return NextResponse.redirect(authUrl.toString());
}
