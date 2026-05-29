export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  (process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"),
  (process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder"),
);

export async function GET(req: NextRequest) {
  try {
    const { data } = await supabase
      .from("SiteSettings")
      .select("value")
      .eq("key", "site_logo")
      .maybeSingle();

    if (data?.value) {
      // Direct redirect to the logo image URL stored in Supabase storage
      return NextResponse.redirect(new URL(data.value));
    }
  } catch (error) {
    console.error("Error fetching site_logo from SiteSettings:", error);
  }

  // Fallback to the generated high-quality static favicon
  const requestUrl = new URL(req.url);
  const fallbackUrl = `${requestUrl.protocol}//${requestUrl.host}/favicon.ico`;
  return NextResponse.redirect(new URL(fallbackUrl));
}
