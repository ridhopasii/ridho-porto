export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  (process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"),
  (process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder"),
);

import { sendWhatsAppMessage } from "@/services/whatsapp";

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CRON_SECRET = process.env.CRON_SECRET;

const sendMessage = async (chatId: string | number, text: string) => {
  if (TELEGRAM_TOKEN) {
    try {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" })
      });
    } catch (e) {
      console.error("Failed to send telegram message", e);
    }
  }

  const waPhone = process.env.WHATSAPP_ALLOWED_PHONE;
  if (waPhone) {
    try {
      await sendWhatsAppMessage(waPhone, text);
    } catch (e) {
      console.error("Failed to send WA message", e);
    }
  }
};

export async function GET(req: Request) {
  try {
    // Proteksi opsional: jika CRON_SECRET diset, wajibkan header Authorization.
    if (CRON_SECRET) {
      const auth = req.headers.get("authorization");
      if (auth !== `Bearer ${CRON_SECRET}`) {
        return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
      }
    }

    const { data } = await supabase
      .from("SiteSettings")
      .select("*")
      .eq("key", "tg_reminders")
      .maybeSingle();

    if (!data || !data.value) {
      return NextResponse.json({ ok: true, triggered: 0, message: "No reminders found." });
    }

    let reminders: any[] = [];
    try {
      reminders = JSON.parse(data.value);
    } catch (e) {
      return NextResponse.json({ ok: false, error: "Failed to parse reminders" });
    }

    const now = new Date();
    let triggeredCount = 0;

    const updatedReminders = await Promise.all(
      reminders.map(async (rem) => {
        if (!rem.completed && new Date(rem.time) <= now) {
          const formattedTime = new Date(rem.time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
          await sendMessage(
            rem.chatId,
            `🔔 **PENGINGAT ASISTEN AI** 🔔\n\nMas Ridho, ini pengingat yang Anda minta:\n📌 *"${rem.text}"*\n\n⏰ Target Waktu: *${formattedTime}*`
          );
          triggeredCount++;
          return { ...rem, completed: true };
        }
        return rem;
      })
    );

    // Save only uncompleted and recently completed reminders (cleanup old ones after 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const cleanedReminders = updatedReminders.filter(
      (rem) => !rem.completed || new Date(rem.time) > sevenDaysAgo
    );

    await supabase
      .from("SiteSettings")
      .update({ value: JSON.stringify(cleanedReminders) })
      .eq("key", "tg_reminders");

    return NextResponse.json({ ok: true, triggered: triggeredCount });
  } catch (error: any) {
    console.error("Reminders Cron Error:", error);
    return NextResponse.json({ ok: false, error: error.message });
  }
}
