export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";

import { supabaseServer } from "@/common/libs/supabase-server";
import { checkAdminAuth } from "@/common/libs/adminAuth";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const normalizeImages = (images: unknown): string[] => {
  if (!Array.isArray(images)) return [];

  return images.filter(
    (url): url is string => typeof url === "string" && !!url,
  );
};

export async function POST(req: NextRequest) {
  if (!(await checkAdminAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = {
      ...body,
      slug: body.slug?.trim() || slugify(body.name || ""),
      order: Number(body.order) || 0,
      images: normalizeImages(body.images),
      showOnHome: body.showOnHome ?? true,
    };

    const { error, data: inserted } = await supabaseServer
      .from("Organization")
      .insert(data)
      .select();

    if (error) throw error;
    return NextResponse.json(inserted[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!(await checkAdminAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, ...body } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const updates = {
      ...body,
      slug: body.slug?.trim() || slugify(body.name || ""),
      order: Number(body.order) || 0,
      images: normalizeImages(body.images),
      showOnHome: body.showOnHome ?? true,
      updatedAt: new Date().toISOString(),
    };

    const { error, data: updated } = await supabaseServer
      .from("Organization")
      .update(updates)
      .eq("id", id)
      .select();

    if (error) throw error;
    return NextResponse.json(updated[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await checkAdminAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const { error } = await supabaseServer
      .from("Organization")
      .delete()
      .eq("id", id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
