export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { checkAdminAuth } from "@/common/libs/adminAuth";
import { checkPrivateDashboardAuth } from "@/common/libs/privateDashboardAuth";

const supabase = createClient(
  (process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"),
  (process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder"),
);

export async function GET() {
  const isAdmin = await checkAdminAuth();
  const isPrivate = await checkPrivateDashboardAuth();
  if (!isAdmin && !isPrivate) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { data: habits, error: hError } = await supabase.from("HabitConfig").select("*").order("sortOrder");
    if (hError) throw hError;

    const { data: trackers, error: tError } = await supabase.from("MonthlyTracker").select("*").order("date", { ascending: false }).limit(30);
    if (tError) throw tError;

    return NextResponse.json({ habits: habits || [], trackers: trackers || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const isAdmin = await checkAdminAuth();
  const isPrivate = await checkPrivateDashboardAuth();
  if (!isAdmin && !isPrivate) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { action, payload } = await req.json();

    if (action === "create_habit") {
      const { data, error } = await supabase.from("HabitConfig").insert([payload]).select();
      if (error) throw error;
      return NextResponse.json(data[0]);
    }
    
    if (action === "update_tracker") {
      const { date, checklist, notes } = payload;
      const { data: existing } = await supabase.from("MonthlyTracker").select("id").eq("date", date).maybeSingle();
      let res;
      if (existing) {
        res = await supabase.from("MonthlyTracker").update({ checklist, notes }).eq("id", existing.id).select();
      } else {
        res = await supabase.from("MonthlyTracker").insert([{ date, checklist, notes }]).select();
      }
      if (res.error) throw res.error;
      return NextResponse.json(res.data[0]);
    }

    throw new Error("Invalid action");
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const isAdmin = await checkAdminAuth();
  const isPrivate = await checkPrivateDashboardAuth();
  if (!isAdmin && !isPrivate) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { action, payload } = await req.json();

    if (action === "update_habit") {
      const { id, ...data } = payload;
      const { data: res, error } = await supabase.from("HabitConfig").update(data).eq("id", id).select();
      if (error) throw error;
      return NextResponse.json(res[0]);
    }

    throw new Error("Invalid action");
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const isAdmin = await checkAdminAuth();
  const isPrivate = await checkPrivateDashboardAuth();
  if (!isAdmin && !isPrivate) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");
    const id = searchParams.get("id");
    
    if (!id || !action) throw new Error("Missing id or action");

    if (action === "delete_habit") {
      const { error } = await supabase.from("HabitConfig").delete().eq("id", id);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    if (action === "delete_tracker") {
      const { error } = await supabase.from("MonthlyTracker").delete().eq("id", id);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    throw new Error("Invalid action");
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
