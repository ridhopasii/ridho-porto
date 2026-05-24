import { NextResponse } from "next/server";
import { supabaseServer } from "@/common/libs/supabase-server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Basic validation
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 });
    }

    // Insert as unapproved
    const { error } = await supabaseServer.from("Guestbook").insert([{
      name: data.name,
      email: data.email,
      message: data.message,
      isApproved: false // Always false initially for safety
    }]);

    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
