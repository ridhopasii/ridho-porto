export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";

// SEMENTARA — endpoint diagnostik env var. HAPUS setelah selesai debug.
export async function GET() {
  const chat = process.env.TELEGRAM_ALLOWED_CHAT_ID;
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const gem = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  return NextResponse.json({
    chatId_present: chat != null,
    chatId_len: (chat || "").length,
    chatId_matches_expected: chat === "1674540875",
    chatId_masked: chat ? `${chat.slice(0, 2)}…${chat.slice(-2)}` : null,
    token_len: (token || "").length,
    gemini_present: Boolean(gem),
    gemini_len: (gem || "").length,
  });
}
