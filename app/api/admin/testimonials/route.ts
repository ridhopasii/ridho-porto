export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/common/libs/supabase-server";
import { checkAdminAuth } from "@/common/libs/adminAuth";

// Kolom rating bertipe int (default 5); input form berupa string → amankan ke 1..5.
const clampRating = (value: unknown): number => {
  const n = Math.round(Number(value));
  if (Number.isNaN(n)) return 5;
  return Math.min(5, Math.max(1, n));
};

export async function GET(req: NextRequest) {
  const { data, error } = await supabaseServer.from("Testimonial").select("*").order("id", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  if (!(await checkAdminAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { rating, ...rest } = body;
  const { error } = await supabaseServer
    .from("Testimonial")
    .insert({ ...rest, rating: clampRating(rating) });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function PUT(req: NextRequest) {
  if (!(await checkAdminAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, rating, ...updates } = body;

  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  // Hanya ubah rating bila dikirim (mis. toggle showOnHome tak boleh reset rating).
  const patch: Record<string, unknown> = { ...updates };
  if (rating !== undefined) patch.rating = clampRating(rating);

  const { error } = await supabaseServer
    .from("Testimonial")
    .update(patch)
    .eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  if (!(await checkAdminAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  const { error } = await supabaseServer.from("Testimonial").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

