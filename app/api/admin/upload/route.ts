import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/common/libs/supabase-server";
import { checkAdminAuth } from "@/common/libs/adminAuth";

export async function POST(req: NextRequest) {
  // Verifikasi otentikasi admin
  const authResponse = checkAdminAuth(req);
  if (authResponse) return authResponse;

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

    // Upload ke bucket "portofolio"
    const fileName = `${path}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-]/g, '_')}`;

    const { data, error } = await supabaseServer.storage
      .from("portofolio")
      .upload(fileName, buffer, {
        contentType: file.type,
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
