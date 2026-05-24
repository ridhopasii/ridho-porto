import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/common/libs/supabase-server";
import { checkAdminAuth } from "@/common/libs/adminAuth";

export async function GET(req: NextRequest) {
  const { data, error } = await supabaseServer.from("Article").select("*").order("createdAt", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const authResponse = checkAdminAuth(req);
  if (authResponse) return authResponse;

  const body = await req.json();
  const { error } = await supabaseServer.from("Article").insert(body);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function PUT(req: NextRequest) {
  const authResponse = checkAdminAuth(req);
  if (authResponse) return authResponse;

  const body = await req.json();
  const { id, ...updates } = body;
  updates.updatedAt = new Date().toISOString();
  
  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  const { error } = await supabaseServer.from("Article").update(updates).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const authResponse = checkAdminAuth(req);
  if (authResponse) return authResponse;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  const { error } = await supabaseServer.from("Article").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
