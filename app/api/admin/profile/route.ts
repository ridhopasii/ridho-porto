export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { checkAdminAuth } from "@/common/libs/adminAuth";

const supabase = createClient(
  (process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"),
  (process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder"),
);

export async function GET() {
  try {
    const { data, error } = await supabase.from("Profile").select("*").limit(1).maybeSingle();
    if (error) throw error;
    return NextResponse.json(data || {});
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await checkAdminAuth()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const data = await req.json();
    const { id, ...updateData } = data;
    
    // Extract only the fields that exist in the Profile table
    const validUpdateData = {
      fullName: updateData.fullName,
      username: updateData.username,
      title: updateData.title,
      bio: updateData.bio,
      location: updateData.location,
      email: updateData.email,
      avatarUrl: updateData.avatarUrl,
      heroImage: updateData.heroImage,
      cvLink: updateData.cvLink,
      whatsappUrl: updateData.whatsappUrl,
    };
    
    // Remove undefined
    Object.keys(validUpdateData).forEach(key => (validUpdateData as any)[key] === undefined && delete (validUpdateData as any)[key]);

    let result;
    if (id) {
      result = await supabase.from("Profile").update(validUpdateData).eq("id", id).select();
    } else {
      result = await supabase.from("Profile").insert([validUpdateData]).select();
    }
    
    if (result.error) throw result.error;
    return NextResponse.json(result.data[0]);
  } catch (error: any) {
    console.error("Profile Save Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
