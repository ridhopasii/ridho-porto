export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { checkAdminAuth } from "@/common/libs/adminAuth";
import { checkPrivateDashboardAuth } from "@/common/libs/privateDashboardAuth";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
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
