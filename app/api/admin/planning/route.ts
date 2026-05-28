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
    const { data: plans, error: pError } = await supabase.from("YearlyPlan").select("*").order("sortOrder");
    if (pError) throw pError;

    const { data: tabungan, error: tError } = await supabase.from("TabunganUmroh").select("*").order("createdAt", { ascending: false });
    if (tError) throw tError;

    return NextResponse.json({ plans: plans || [], tabungan: tabungan || [] });
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

    if (action === "create_plan") {
      const { data, error } = await supabase.from("YearlyPlan").insert([payload]).select();
      if (error) throw error;
      return NextResponse.json(data[0]);
    }
    
    if (action === "create_tabungan") {
      const { data, error } = await supabase.from("TabunganUmroh").insert([payload]).select();
      if (error) throw error;
      return NextResponse.json(data[0]);
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

    if (action === "update_plan") {
      const { id, ...data } = payload;
      const { data: res, error } = await supabase.from("YearlyPlan").update(data).eq("id", id).select();
      if (error) throw error;
      return NextResponse.json(res[0]);
    }

    if (action === "update_tabungan") {
      const { id, ...data } = payload;
      const { data: res, error } = await supabase.from("TabunganUmroh").update(data).eq("id", id).select();
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

    if (action === "delete_plan") {
      const { error } = await supabase.from("YearlyPlan").delete().eq("id", id);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    if (action === "delete_tabungan") {
      const { error } = await supabase.from("TabunganUmroh").delete().eq("id", id);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    throw new Error("Invalid action");
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
