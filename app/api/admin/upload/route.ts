export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/common/libs/supabase-server";
import { checkAdminAuth } from "@/common/libs/adminAuth";
import sharp from "sharp";

export async function POST(req: NextRequest) {
  // Verifikasi otentikasi admin
  if (!(await checkAdminAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const path = formData.get("path") as string || "uploads";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Ubah File menjadi Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Convert to WebP using sharp
    const webpBuffer = await sharp(buffer)
      .webp({ quality: 80 })
      .toBuffer();

    // Upload ke bucket "portofolio"
    // Use .webp extension regardless of original extension
    const baseName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9.\-]/g, '_');
    const fileName = `${path}/${Date.now()}-${baseName}.webp`;

    const { data, error } = await supabaseServer.storage
      .from("portofolio")
      .upload(fileName, webpBuffer, {
        contentType: "image/webp",
        upsert: false,
      });

    if (error) {
      console.error("Supabase storage error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Ambil URL public
    const { data: publicUrlData } = supabaseServer.storage
      .from("portofolio")
      .getPublicUrl(fileName);

    return NextResponse.json({
      url: publicUrlData.publicUrl,
      path: data.path,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

