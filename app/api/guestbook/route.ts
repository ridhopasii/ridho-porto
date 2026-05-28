import { NextResponse } from "next/server";
import { supabaseServer } from "@/common/libs/supabase-server";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/common/libs/rate-limit";

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rl = checkRateLimit(`guestbook:${ip}`, RATE_LIMITS.guestbook);
  if (rl.limited) {
    return NextResponse.json(
      { error: `Terlalu banyak permintaan. Coba lagi dalam ${rl.retryAfter} detik.` },
      { status: 429 }
    );
  }

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
      isApproved: true // Instantly visible by default, admin can still moderate or delete it
    }]);

    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
