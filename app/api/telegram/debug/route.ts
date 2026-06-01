export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// SEMENTARA — endpoint diagnostik env + supabase. HAPUS setelah selesai debug.
export async function GET() {
  const chat = process.env.TELEGRAM_ALLOWED_CHAT_ID;
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const gem = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

  let walletCount = -1;
  let supaErr: string | null = null;
  try {
    const supa = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    );
    const { data, error } = await supa.from("Wallets").select("id");
    walletCount = data?.length ?? -1;
    if (error) supaErr = error.message;
  } catch (e: any) {
    supaErr = e?.message || "unknown";
  }

  return NextResponse.json({
    chatId_present: chat != null,
    chatId_len: (chat || "").length,
    chatId_matches_expected: chat === "1674540875",
    chatId_masked: chat ? `${chat.slice(0, 2)}…${chat.slice(-2)}` : null,
    token_len: (token || "").length,
    gemini_present: Boolean(gem),
    gemini_len: (gem || "").length,
    gemini_masked: gem ? `${gem.slice(0, 4)}…${gem.slice(-4)}` : null,
    supabase_url_set: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    walletCount,
    supaErr,
  });
}
