export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { checkAdminAuth } from "@/common/libs/adminAuth";

const supabase = createClient(
  (process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"),
  (process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder"),
);

export async function POST(req: Request) {
  if (!(await checkAdminAuth()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const data = await req.json();
    const { page, locale, key, value } = data;

    const { data: existing, error: lookupError } = await supabase
      .from("PageContent")
      .select("id")
      .eq("page", page)
      .eq("locale", locale)
      .eq("key", key)
      .maybeSingle();

    if (lookupError) throw lookupError;

    if (existing?.id) {
      const { error, data: updated } = await supabase
        .from("PageContent")
        .update({ value })
        .eq("id", existing.id)
        .select();
      if (error) throw error;
      return NextResponse.json(updated[0]);
    }

    const { error, data: inserted } = await supabase
      .from("PageContent")
      .insert([data])
      .select();
    if (error) throw error;
    return NextResponse.json(inserted[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!(await checkAdminAuth()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id, ...data } = await req.json();
    const { error, data: updated } = await supabase
      .from("PageContent")
      .update(data)
      .eq("id", id)
      .select();
    if (error) throw error;
    return NextResponse.json(updated[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
