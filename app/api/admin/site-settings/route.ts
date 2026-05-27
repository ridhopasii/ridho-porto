export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { checkAdminAuth } from "@/common/libs/adminAuth";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET() {
  try {
    const { data, error } = await supabase.from("SiteSettings").select("*");
    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await checkAdminAuth()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { key, value } = await req.json();
    
    const { data: existing, error: lookupError } = await supabase
      .from("SiteSettings")
      .select("key")
      .eq("key", key)
      .maybeSingle();

    if (lookupError) throw lookupError;

    let result;
    if (existing) {
      result = await supabase.from("SiteSettings").update({ value, updatedAt: new Date().toISOString() }).eq("key", key).select();
    } else {
      result = await supabase.from("SiteSettings").insert([{ key, value }]).select();
    }
    
    if (result.error) throw result.error;
    return NextResponse.json(result.data[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await checkAdminAuth()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");
    if (!key) throw new Error("Key is required");

    const { error } = await supabase.from("SiteSettings").delete().eq("key", key);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
