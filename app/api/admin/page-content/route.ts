export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { checkAdminAuth } from "@/common/libs/adminAuth";
import { revalidatePath } from "next/cache";

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

    let result;

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
      result = updated[0];
    } else {
      const { error, data: inserted } = await supabase
        .from("PageContent")
        .insert([data])
        .select();
      if (error) throw error;
      result = inserted[0];
    }

    // Revalidate paths to reflect changes in realtime
    revalidatePath("/", "layout");

    return NextResponse.json(result);
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
    
    // Revalidate paths to reflect changes in realtime
    revalidatePath("/", "layout");

    return NextResponse.json(updated[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  if (!(await checkAdminAuth()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page");
    if (!page) return NextResponse.json({ error: "Page is required" }, { status: 400 });

    const { data, error } = await supabase
      .from("PageContent")
      .select("*")
      .eq("page", page)
      .order("locale", { ascending: true })
      .order("key", { ascending: true });
      
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
