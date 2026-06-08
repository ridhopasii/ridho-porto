export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getWeeklySummary, getHistoricalExpenses } from "@/services/aiAnalysis";

import { sendWhatsAppMessage } from "@/services/whatsapp";

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ALLOWED_CHAT_ID = process.env.TELEGRAM_ALLOWED_CHAT_ID;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
const CRON_SECRET = process.env.CRON_SECRET;

const sendMessage = async (chatId: string | number, text: string) => {
  if (TELEGRAM_TOKEN) {
    try {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" }),
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

// Susun laporan ringkas tanpa AI (fallback bila Gemini tidak tersedia/gagal).
const buildPlainReport = (summary: any) => {
  const rupiah = (n: number) => `Rp ${Number(n || 0).toLocaleString("id-ID")}`;
  const f = summary.finance;
  const p = summary.productivity;

  const topCats = (f.topCategories || [])
    .slice(0, 3)
    .map((c: any) => `   • ${c.category}: ${rupiah(c.total)}`)
    .join("\n");

  const habitLines = (summary.habits || [])
    .map((h: any) => `   • ${h.name}: ${h.hit}/${h.outOf} hari`)
    .join("\n");

  return [
    `📊 *LAPORAN MINGGUAN*`,
    `🗓️ ${summary.periodStart} → ${summary.periodEnd}`,
    ``,
    `💰 *Keuangan*`,
    `   Pemasukan: ${rupiah(f.totalIncome)}`,
    `   Pengeluaran: ${rupiah(f.totalExpense)}`,
    `   Selisih: ${rupiah(f.net)}`,
    topCats ? `   Kategori teratas:\n${topCats}` : `   (Belum ada pengeluaran tercatat)`,
    ``,
    `🎯 *Produktivitas*`,
    `   Fokus: ${p.totalPomodoroSessions} sesi (${p.totalPomodoroMinutes} menit)`,
    `   Tugas selesai: ${p.completedTasks}/${p.totalTasks} (${p.completionRate}%)`,
    `   Hari tercatat: ${p.daysLogged}/7`,
    ``,
    `🔥 *Habit*`,
    habitLines || `   (Belum ada habit)`,
  ].join("\n");
};

const generateAiReport = async (summary: any, averages: any): Promise<string | null> => {
  if (!GEMINI_API_KEY) return null;
  try {
    const prompt = `Anda adalah Asisten Pribadi Cerdas untuk Ridho. Buatkan LAPORAN MINGGUAN yang hangat, memotivasi, dan to-the-point dalam Bahasa Indonesia.

Gunakan data agregat 7 hari terakhir berikut:
RINGKASAN MINGGU INI:
${JSON.stringify(summary, null, 2)}

RATA-RATA PENGELUARAN HISTORIS PER KATEGORI (untuk pembanding):
${JSON.stringify(averages, null, 2)}

Instruksi penulisan:
1. Awali dengan judul "📊 *Laporan Mingguanmu*" dan rentang tanggalnya.
2. Bagian Keuangan: sebut total pemasukan, pengeluaran, dan selisih. Bandingkan kategori pengeluaran terbesar dengan rata-rata historis; jika ada yang jauh lebih boros dari biasanya, beri sorotan ramah. Jika selisih positif, beri pujian; jika negatif, beri dorongan lembut.
3. Bagian Produktivitas: apresiasi sesi fokus & tingkat penyelesaian tugas.
4. Bagian Habit: sebut habit terkuat (paling konsisten) dan satu yang perlu diperhatikan.
5. Tutup dengan satu kalimat motivasi personal untuk minggu depan.
6. Gunakan format Markdown Telegram (*tebal*, emoji). Maksimal ~1500 karakter. Jangan kembalikan JSON, langsung teks laporannya.`;

    const aiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );
    const aiData = await aiRes.json();
    const textOut = aiData?.candidates?.[0]?.content?.parts?.[0]?.text;
    return textOut ? textOut.trim() : null;
  } catch (e) {
    console.error("Failed to generate AI weekly report:", e);
    return null;
  }
};

async function handle(req: Request) {
  try {
    // Proteksi opsional: jika CRON_SECRET diset, wajibkan header Authorization.
    if (CRON_SECRET) {
      const auth = req.headers.get("authorization");
      if (auth !== `Bearer ${CRON_SECRET}`) {
        return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
      }
    }

    if (!ALLOWED_CHAT_ID) {
      return NextResponse.json({ ok: false, error: "TELEGRAM_ALLOWED_CHAT_ID belum diset." });
    }

    const summary = await getWeeklySummary();
    if (!summary) {
      return NextResponse.json({ ok: false, error: "Gagal mengambil ringkasan mingguan." });
    }

    const averages = await getHistoricalExpenses();
    const aiReport = await generateAiReport(summary, averages);
    const message = aiReport || buildPlainReport(summary);

    await sendMessage(ALLOWED_CHAT_ID, message);
    return NextResponse.json({ ok: true, aiGenerated: Boolean(aiReport) });
  } catch (error: any) {
    console.error("Weekly Report Error:", error);
    return NextResponse.json({ ok: false, error: error.message });
  }
}

// Vercel Cron memakai GET; sediakan juga POST untuk pemicu manual.
export const GET = handle;
export const POST = handle;
