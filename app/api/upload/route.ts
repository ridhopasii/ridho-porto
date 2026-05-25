import { NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Convert to WebP using sharp
    const webpBuffer = await sharp(buffer)
      .webp({ quality: 80 })
      .toBuffer();

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: "", ...options });
          },
        },
      }
    );

    // Ensure user is authenticated to upload? 
    // The user wants to integrate everything, so we might not want to block uploads if they are doing it locally or if auth is not strictly enforced.
    // For now, let's just upload it.
    
    const fileName = `${uuidv4()}.webp`;
    
    const { data, error } = await supabase.storage
      .from("portofolio")
      .upload(fileName, webpBuffer, {
        contentType: "image/webp",
        upsert: false,
      });

    if (error) {
      console.error("Supabase Storage Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: publicUrlData } = supabase.storage
      .from("portofolio")
      .getPublicUrl(fileName);

    return NextResponse.json({ url: publicUrlData.publicUrl });
  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
