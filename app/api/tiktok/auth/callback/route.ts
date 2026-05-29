import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { saveTikTokTokens } from "@/services/tiktok";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const error_description = searchParams.get("error_description");

  if (error) {
    return NextResponse.json(
      { error, description: error_description },
      { status: 400 }
    );
  }

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  const CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY;
  const CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET;
  const REDIRECT_URI = `${process.env.BASE_URL || "http://localhost:3000"}/api/tiktok/auth/callback`;

  if (!CLIENT_KEY || !CLIENT_SECRET) {
    return NextResponse.json({ error: "Missing TikTok API credentials" }, { status: 500 });
  }

  try {
    const params = new URLSearchParams({
      client_key: CLIENT_KEY,
      client_secret: CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
      redirect_uri: REDIRECT_URI,
    });

    const tokenResponse = await axios.post(
      "https://open.tiktokapis.com/v2/oauth/token/",
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Cache-Control": "no-cache",
        },
      }
    );

    const tokenData = tokenResponse.data;

    if (!tokenData || !tokenData.access_token) {
      console.error("Token response error:", tokenData);
      return NextResponse.json({ error: "Failed to get token", data: tokenData }, { status: 400 });
    }

    // Save tokens to Supabase
    await saveTikTokTokens(tokenData);

    // Redirect to the social media page after successful login
    return NextResponse.redirect(`${process.env.BASE_URL || "http://localhost:3000"}/social-media?tiktok_auth=success`);
  } catch (error: any) {
    console.error("TikTok Auth Callback Error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: "Authentication failed", details: error.response?.data || error.message },
      { status: 500 }
    );
  }
}
