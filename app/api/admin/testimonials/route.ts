export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/common/libs/supabase-server";
import { checkAdminAuth } from "@/common/libs/adminAuth";

export async function GET(req: NextRequest) {
  const { data, error } = await supabaseServer.from("Testimonial").select("*").order("id", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  if (!checkAdminAuth()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { error } = await supabaseServer.from("Testimonial").insert(body);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function PUT(req: NextRequest) {
  if (!checkAdminAuth()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, ...updates } = body;
  
  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  const { error } = await supabaseServer.from("Testimonial").update(updates).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  if (!checkAdminAuth()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  const { error } = await supabaseServer.from("Testimonial").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

