export const dynamic = "force-dynamic";
export const maxDuration = 60;

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getHistoricalExpenses, getSubscriptionAuditData, getHabitFrictionData } from "@/services/aiAnalysis";
import { getDayType, getAllTasksForDay, DEFAULT_PRODUCTIVITY_CONFIG } from "@/common/constants/productivityBlocks";

const supabase = createClient(
  (process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"),
  (process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder"),
);

const sendWhatsAppMessage = async (to: string, text: string) => {
  const token = process.env.WHATSAPP_TOKEN;
  if (!token) {
    console.error("WhatsApp token (WHATSAPP_TOKEN) is not defined in environment variables.");
    return;
  }

  // Remove any markdown styling like asterisks since WhatsApp uses its own format (*bold*, _italic_, ~strike~)
  const cleanText = text
    .replace(/\*\*(.*?)\*\*/g, '*$1*')   // NextJS **bold** -> WA *bold*
    .replace(/__(.*?)__/g, '*$1*')
    .replace(/`(.*?)`/g, '_$1_')       // NextJS `code` -> WA _italic_
    .trim();

  try {
    const res = await fetch("https://gate.whapi.cloud/messages/text", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to,
        body: cleanText
      })
    });
    if (!res.ok) {
      const errText = await res.text();
      console.error("Whapi.cloud Send Message API Error details:", errText);
    }
  } catch (e) {
    console.error("Failed to send WhatsApp message through Whapi.cloud Web Gateway API:", e);
  }
};

async function ensureTodayProductivityRecord(supabaseClient: any) {
  const today = new Date().toISOString().split('T')[0];
  const { data: existing } = await supabaseClient
    .from("Productivity")
    .select("*")
    .eq("date", today)
    .maybeSingle();

  if (existing) {
    return existing;
  }

  let config = DEFAULT_PRODUCTIVITY_CONFIG;
  try {
    const { data: settings } = await supabaseClient
      .from("SiteSettings")
      .select("*")
      .eq("key", "productivity_day_types")
      .maybeSingle();
      
    if (settings && settings.value) {
      config = JSON.parse(settings.value);
    }
  } catch (e) {
    console.error("Failed to parse custom day types settings:", e);
  }

  const dayType = getDayType(today, config);
  const allTasks = getAllTasksForDay(dayType, config);
  const initialTasks = allTasks.map(name => ({ name, completed: false }));

  const initialNewItem = {
    date: today,
    dayType: dayType,
    tasks: JSON.stringify(initialTasks),
    pomodoroMinutes: 0,
    mood: "🙂",
    goals: "",
  };

  const { data: inserted, error: insertError } = await supabaseClient
    .from("Productivity")
    .insert([initialNewItem])
    .select()
    .single();

  if (insertError) {
    console.error("Failed to auto-create today record:", insertError);
    throw insertError;
  }

  return inserted;
}

// 1. GET: Whapi.cloud doesn't strictly require handshake validation, but we keep it open for custom gateways
export async function GET() {
  return new Response("WhatsApp Webhook is active and listening for Whapi.cloud events.", { status: 200 });
}

// 2. POST: Message Processor (Gemini + Supabase integration)
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const messageObj = body.messages?.[0];
    if (!messageObj) {
      return NextResponse.json({ ok: true });
    }

    // Strictly ignore messages sent by the bot/owner's own account to prevent loop triggers
    if (messageObj.from_me) {
      return NextResponse.json({ ok: true });
    }

    const chatId = messageObj.chat_id; // e.g. "62895429126232@s.whatsapp.net"
    if (!chatId) {
      return NextResponse.json({ ok: true });
    }

    // Extract raw digits of phone number
    const from = chatId.split("@")[0];
    const allowedPhone = process.env.WHATSAPP_ALLOWED_PHONE;

    // Strict Security Guard: Only process messages from the owner's allowed phone number
    if (!allowedPhone || from !== allowedPhone) {
      console.warn(`WhatsApp Web Gateway message ignored. Sender "${from}" is not allowed.`);
      return NextResponse.json({ ok: true });
    }

    // Support only Text messages for now
    if (messageObj.type !== "text") {
      await sendWhatsAppMessage(chatId, "⚠️ Maaf Bos Ridho, saat ini saya baru bisa memproses perintah berupa teks melalui WhatsApp.");
      return NextResponse.json({ ok: true });
    }

    const text = messageObj.text?.body?.trim() || "";
    if (!text) {
      return NextResponse.json({ ok: true });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      await sendWhatsAppMessage(chatId, "⚠️ Gagal memproses: GEMINI_API_KEY belum terkonfigurasi pada environment server.");
      return NextResponse.json({ ok: true });
    }

    // Command: Help/Intro
    if (text.toLowerCase() === "ping" || text.toLowerCase() === "halo" || text.toLowerCase() === "help") {
      await sendWhatsAppMessage(
        chatId,
        "👋 Halo Bos Ridho!\n\nAsisten AI Anda siap menerima perintah langsung dari WhatsApp. Kirim perintah senatural mungkin!\n\nContoh Perintah Teks:\n- `Tadi makan sate habis 30rb pake Gopay`\n- `Ubah mood jadi 🤩`\n- `Tambah tugas Belajar React`\n- `Audit langgananku`\n- `Analisis habitku`"
      );
      return NextResponse.json({ ok: true });
    }

    const todayStr = new Date().toISOString().split("T")[0];

    // Fetch context data in parallel
    const [wallets, averages, subAudit, habitFriction, todayProd, todayHabitTrack, habitsConfig] = await Promise.all([
      supabase.from("Wallets").select("*").then(res => res.data || []),
      getHistoricalExpenses(),
      getSubscriptionAuditData(),
      getHabitFrictionData(),
      supabase.from("Productivity").select("*").eq("date", todayStr).maybeSingle().then(res => res.data),
      supabase.from("MonthlyTracker").select("*").eq("date", todayStr).maybeSingle().then(res => res.data),
      supabase.from("HabitConfig").select("*").then(res => res.data || []),
    ]);

    if (!wallets || wallets.length === 0) {
      await sendWhatsAppMessage(chatId, "⚠️ Error: Tidak ada Wallet yang ditemukan di Database. Buat dompet dulu di Private Hub.");
      return NextResponse.json({ ok: true });
    }

    // Prepare status strings to inject into Gemini prompt
    let todayStatusContext = "Belum ada data produktivitas atau tugas untuk hari ini.";
    if (todayProd) {
      let tasksList = [];
      try { tasksList = JSON.parse(todayProd.tasks || "[]"); } catch(e){}
      
      const completedTasks = tasksList.filter((t: any) => t.completed).map((t: any) => t.name);
      const pendingTasks = tasksList.filter((t: any) => !t.completed).map((t: any) => t.name);
      
      todayStatusContext = `Tipe Hari: ${todayProd.dayType || "Work"}
Sesi Pomodoro Hari Ini: ${Math.floor((todayProd.pomodoroMinutes || 0) / 25)} sesi (Total: ${todayProd.pomodoroMinutes || 0} menit)
Mood Hari Ini: ${todayProd.mood || "🙂"}
Sasaran/Ringkasan Jurnal Hari Ini: ${todayProd.goals || "Belum diisi"}

Tugas yang SUDAH Selesai Hari Ini:
${completedTasks.length > 0 ? completedTasks.map((t: any) => `- ${t}`).join('\n') : "(Belum ada tugas selesai)"}

Tugas yang BELUM Selesai Hari Ini:
${pendingTasks.length > 0 ? pendingTasks.map((t: any) => `- ${t}`).join('\n') : "(Semua tugas hari ini selesai!)"}`;
    }

    let todayHabitsContext = "Belum ada data habits untuk hari ini.";
    if (habitsConfig && habitsConfig.length > 0) {
      const chk = todayHabitTrack?.checklist || {};
      const completedHabits = habitsConfig.filter((h: any) => chk[h.id]).map((h: any) => `${h.icon} ${h.name}`);
      const pendingHabits = habitsConfig.filter((h: any) => !chk[h.id]).map((h: any) => `${h.icon} ${h.name}`);
      
      todayHabitsContext = `Habits yang SUDAH Selesai Hari Ini:
${completedHabits.length > 0 ? completedHabits.map(h => `- ${h}`).join('\n') : "(Belum ada habits selesai)"}

Habits yang BELUM Selesai Hari Ini:
${pendingHabits.length > 0 ? pendingHabits.map(h => `- ${h}`).join('\n') : "(Semua habits hari ini selesai!)"}`;
    }

    const nowLocal = new Date();
    const currentLocalTimeContext = `Waktu Sekarang (Local Time Asia/Jakarta): ${nowLocal.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}\nISO String: ${nowLocal.toISOString()}`;

    // Prompt Gemini
    const prompt = `Anda adalah Asisten Pribadi Cerdas (Conversational AI) untuk Ridho. Tugas Anda adalah diajak mengobrol, mencatat transaksi keuangan, memperbarui jurnal/tugas, dan menganalisis produktivitas & finansial secara realtime.

Waktu Sekarang:
${currentLocalTimeContext}

Daftar Wallet (Dompet) yang tersedia (ID, Nama, Saldo):
${wallets.map(w => `- ID: ${w.id}, Nama: ${w.name}, Saldo: Rp ${w.balance || 0}`).join('\n')}

Kategori pengeluaran yang diizinkan (Pilih salah satu): Makan, Transport, Belanja, Hiburan, Tagihan, Lainnya

Konteks Finansial Historis (Rata-rata pengeluaran bulanan per kategori):
${JSON.stringify(averages, null, 2)}

Konteks Audit Langganan (Tagihan aktif & aktivitas 45 hari terakhir):
${JSON.stringify(subAudit, null, 2)}

Konteks Hambatan Kebiasaan/Habit Friction (Korelasi beban tugas & kegagalan habit):
${JSON.stringify(habitFriction, null, 2)}

Konteks Produktivitas Hari Ini (${todayStr}):
${todayStatusContext}

Konteks Habits Tracker Hari Ini:
${todayHabitsContext}

Aturan Gaya Bahasa (Karakter & Penulisan):
1. **SANGAT PENTING**: Jangan bersikap seperti robot/AI yang terlalu ceria, kaku, atau ramah secara palsu (fake cheerfulness).
2. Batasi respons maksimal 3-4 kalimat santai untuk obrolan biasa (kecuali jika harus memberikan list laporan/analisis panjang).
3. Gunakan bahasa kasual sehari-hari yang luwes, seolah-olah Anda adalah teman atau asisten manusia asli. Anda boleh memiliki opini.
4. JANGAN gunakan kalimat dengan struktur baku yang terlalu sempurna. Buat struktur kalimat terasa natural, spontan, dan apa adanya.
5. HINDARI KOSAKATA KLISE AI: Jangan pernah menggunakan metafora dramatis (contoh: "mari kita menyelami", "mengungkap", "luar biasa"), jangan gunakan gaya bahasa promosi, dan hindari kalimat pasif (passive voice) yang kaku. Buang semua pola tulisan khas AI.

Aturan Output:
1. Kembalikan data MURNI berupa JSON Object (tanpa markdown).
2. JSON harus memiliki 3 properti utama:
   - "type": Tipe interaksi, pilih salah satu:
     * "TRANSACTION": Jika pengguna ingin mencatat transaksi (pemasukan/pengeluaran).
     * "JOURNAL": Jika pengguna sedang menceritakan jurnal harian, curhat keseharian, standup harian, atau mencentang tugas/habits.
     * "DATABASE_COMMAND": Jika pengguna ingin memanipulasi database secara langsung (tambah/hapus tugas, ganti mood, ubah sasaran).
     * "ANALYSIS": Jika pengguna secara eksplisit meminta analisis atau saran keuangan/habit, ATAU meminta laporan produktivitas & kegiatan hari ini (misal: "apa saja kegiatanku hari ini", "audit langgananku", "cek kebocoran dana", "analisis habitku").
   - "reply": Balasan Anda untuk user. WAJIB ikuti "Aturan Gaya Bahasa" di atas! Buat sealami mungkin.
     * Jika pengguna menanyakan tentang produktivitas, kegiatan, tugas, atau habits hari ini, gunakan informasi dari Konteks Produktivitas & Habits Hari Ini di atas untuk membuat rangkuman ringkas yang kasual.
     * Khusus "TRANSACTION": Jika nominal pengeluaran di Kategori yang dipilih terdeteksi >3x dari rata-rata pengeluaran historis kategori tersebut (atau jika nominal mencurigakan typo), sertakan peringatan anomali yang ramah di bagian reply.
   - "data": Objek data spesifik untuk penanganan database, dengan struktur:
     * Jika "type" adalah "TRANSACTION":
       {
         "transactions": Array berisi daftar transaksi. Setiap transaksi memiliki:
           - "type": "expense" (pengeluaran) atau "income" (pemasukan).
           - "amount": nominal angka
           - "wallet_id": ID dompet yang sesuai (jika tidak disebut, gunakan ID pertama: ${wallets[0].id})
           - "description": format "Kategori - Detail" (contoh: "Makan - Nasi Padang"). Jika pemasukan, cukup deskripsi detail (contoh: "Gaji Freelance").
         "is_anomaly": boolean (true jika nominal pengeluaran di atas batas wajar >3x dari rata-rata kategori yang ada di Konteks Finansial Historis).
       }
     * Jika "type" adalah "JOURNAL":
       {
         "mood": mood harian yang terdeteksi (😢, 😐, 🙂, 😊, 🤩)
         "summary": ringkasan jurnal harian yang indah
         "completed_tasks": Array string nama-nama tugas harian yang diselesaikan (disebutkan eksplisit selesai)
         "completed_habits": Array string nama-nama kebiasaan/habits yang diselesaikan
       }
     * Jika "type" adalah "DATABASE_COMMAND":
       {
         "command_action": "add_task" | "delete_task" | "complete_task" | "update_mood" | "update_goals" | "create_wallet" | "delete_wallet" | "add_reminder"
         "params": {
           "task_name": nama tugas (untuk add_task / delete_task / complete_task)
           "mood": mood (untuk update_mood)
           "goals": ringkasan sasaran (untuk update_goals)
           "wallet_name": nama dompet/bank (untuk create_wallet atau delete_wallet, misal "Bank BSI", "Gopay")
           "icon": satu ikon emoji kustom (untuk create_wallet, pilih emoji yang relevan misal "🕌" untuk BSI, "💳" untuk bank, "📱" untuk e-wallet, default "💳")
           "balance": saldo awal angka (untuk create_wallet, default 0)
           "reminder_text": isi pengingat (untuk add_reminder, misal "Beli susu di Indomaret", "Meeting dengan dosen")
           "reminder_time": waktu pengingat dalam string format ISO-8601 (untuk add_reminder, hitung secara akurat berdasarkan Waktu Sekarang dan keinginan pengguna, misal "5 menit lagi", "jam 8 malam nanti", "besok pagi jam 9")
         }
       }
     * Jika "type" adalah "ANALYSIS":
       {
         "analysis_type": "subscription_audit" | "habit_friction" | "productivity_report" | "other"
       }

Pesan/Media dari user: "${text}"`;

    const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { response_mime_type: "application/json" }
      })
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      console.error("Gemini API Error from WhatsApp Webhook:", errText);
      throw new Error(`Gemini API returned status ${aiRes.status}`);
    }

    const aiData = await aiRes.json();
    const responseText = aiData.candidates[0].content.parts[0].text;
    const cleanJsonStr = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const aiResponse = JSON.parse(cleanJsonStr);

    const aiResponses = Array.isArray(aiResponse) ? aiResponse : [aiResponse];
    let finalReportMsg = "";

    for (const resp of aiResponses) {
      const { type, reply, data } = resp;
      let reportMsg = reply ? reply + "\n" : "";

      // 1. HANDLER: TRANSACTION
      if (type === "TRANSACTION" && data?.transactions && Array.isArray(data.transactions) && data.transactions.length > 0) {
        reportMsg += "\n📝 *Catatan Transaksi:*\n";
        for (const tx of data.transactions) {
          const { type: txType, amount, wallet_id, description } = tx;
          const targetWallet = wallets.find(w => w.id === wallet_id) || wallets[0];

          const newTx = {
            wallet_id: targetWallet.id,
            type: txType,
            amount: Number(amount),
            description,
            date: new Date().toISOString().split('T')[0]
          };

          await supabase.from("FinancialTransactions").insert([newTx]);

          const balanceChange = txType === 'income' ? Number(amount) : -Number(amount);
          const newBalance = Number(targetWallet.balance || 0) + balanceChange;
          await supabase.from("Wallets").update({ balance: newBalance }).eq("id", targetWallet.id);
          
          targetWallet.balance = newBalance;

          const icon = txType === 'income' ? '🟢' : '🔴';
          reportMsg += `${icon} ${description}\n💰 Rp ${Number(amount).toLocaleString('id-ID')}\n💳 [${targetWallet.name}]: Sisa Rp ${newBalance.toLocaleString('id-ID')}\n\n`;
        }
        if (data.is_anomaly) {
          reportMsg += `\n⚠️ *PERINGATAN ANOMALI:* Nominal pengeluaran di atas terdeteksi jauh lebih tinggi dari kebiasaan Anda. Harap dipastikan tidak ada salah ketik!`;
        }
      }

      // 2. HANDLER: JOURNAL
      else if (type === "JOURNAL" && data) {
        const todayItem = await ensureTodayProductivityRecord(supabase);
        let currentTasks: any[] = [];
        try { currentTasks = JSON.parse(todayItem.tasks || "[]"); } catch(e){}

        let tasksUpdatedCount = 0;
        if (Array.isArray(data.completed_tasks)) {
          data.completed_tasks.forEach((tName: string) => {
            currentTasks = currentTasks.map((t: any) => {
              if (t.name.toLowerCase().includes(tName.toLowerCase()) || tName.toLowerCase().includes(t.name.toLowerCase())) {
                if (!t.completed) tasksUpdatedCount++;
                return { ...t, completed: true };
              }
              return t;
            });
          });
        }

        await supabase.from("Productivity").update({
          tasks: JSON.stringify(currentTasks),
          mood: data.mood || todayItem.mood || "🙂",
          goals: data.summary || todayItem.goals || ""
        }).eq("id", todayItem.id);

        const habitsList = await supabase.from("HabitConfig").select("*").then(res => res.data || []);
        const todayStrLocal = new Date().toISOString().split("T")[0];
        const existingTracker = await supabase.from("MonthlyTracker").select("*").eq("date", todayStrLocal).maybeSingle().then(res => res.data);
        
        let checklist = existingTracker?.checklist || {};
        let habitsUpdatedCount = 0;

        if (Array.isArray(data.completed_habits) && Array.isArray(habitsList)) {
          data.completed_habits.forEach((hName: string) => {
            const matched = habitsList.find(h => h.name.toLowerCase().includes(hName.toLowerCase()) || hName.toLowerCase().includes(h.name.toLowerCase()));
            if (matched) {
              if (!checklist[matched.id]) habitsUpdatedCount++;
              checklist[matched.id] = true;
            }
          });
        }

        if (existingTracker) {
          await supabase.from("MonthlyTracker").update({ checklist }).eq("id", existingTracker.id);
        } else {
          await supabase.from("MonthlyTracker").insert([{ date: todayStrLocal, checklist }]);
        }

        reportMsg += `\n\n📌 *Sinkronisasi Jurnal:*\n`;
        reportMsg += `🤩 Mood Hari Ini: ${data.mood || "🙂"}\n`;
        if (tasksUpdatedCount > 0) reportMsg += `✅ ${tasksUpdatedCount} Tugas Harian dicentang selesai!\n`;
        if (habitsUpdatedCount > 0) reportMsg += `🔥 ${habitsUpdatedCount} Habits dicentang selesai!\n`;
      }

      // 3. HANDLER: DATABASE_COMMAND
      else if (type === "DATABASE_COMMAND" && data) {
        const commands = Array.isArray(data) ? data : [data];
        for (const cmd of commands) {
          const { command_action, params } = cmd;
          const todayItem = await ensureTodayProductivityRecord(supabase);
          let currentTasks: any[] = [];
          try { currentTasks = JSON.parse(todayItem.tasks || "[]"); } catch(e){}

          if (command_action === "add_task" && params?.task_name) {
            currentTasks.push({ name: params.task_name, completed: false });
            await supabase.from("Productivity").update({ tasks: JSON.stringify(currentTasks) }).eq("id", todayItem.id);
            reportMsg += `\n\n➕ *Aksi Database:* Tugas "${params.task_name}" ditambahkan ke hari ini.`;
          }
          else if (command_action === "delete_task" && params?.task_name) {
            const filteredTasks = currentTasks.filter((t: any) => !t.name.toLowerCase().includes(params.task_name.toLowerCase()));
            const deletedCount = currentTasks.length - filteredTasks.length;
            await supabase.from("Productivity").update({ tasks: JSON.stringify(filteredTasks) }).eq("id", todayItem.id);
            reportMsg += `\n\n🗑 *Aksi Database:* Berhasil menghapus ${deletedCount} tugas matching "${params.task_name}".`;
          }
          else if (command_action === "complete_task" && params?.task_name) {
            let updated = 0;
            currentTasks = currentTasks.map((t: any) => {
              if (t.name.toLowerCase().includes(params.task_name.toLowerCase())) {
                updated++;
                return { ...t, completed: true };
              }
              return t;
            });
            await supabase.from("Productivity").update({ tasks: JSON.stringify(currentTasks) }).eq("id", todayItem.id);
            reportMsg += `\n\n✅ *Aksi Database:* Berhasil mencentang selesai ${updated} tugas matching "${params.task_name}".`;
          }
          else if (command_action === "update_mood" && params?.mood) {
            await supabase.from("Productivity").update({ mood: params.mood }).eq("id", todayItem.id);
            reportMsg += `\n\n🤩 *Aksi Database:* Mood diperbarui menjadi "${params.mood}".`;
          }
          else if (command_action === "update_goals" && params?.goals) {
            await supabase.from("Productivity").update({ goals: params.goals }).eq("id", todayItem.id);
            reportMsg += `\n\n🎯 *Aksi Database:* Sasaran/Goals hari ini diperbarui.`;
          }
          else if (command_action === "create_wallet" && params?.wallet_name) {
            const walletIcon = params.icon || "💳";
            const walletBalance = Number(params.balance) || 0;
            
            const { error: wErr } = await supabase.from("Wallets").insert([{
              name: params.wallet_name,
              balance: walletBalance,
              icon: walletIcon
            }]);
            
            if (wErr) throw wErr;
            reportMsg += `\n\n💳 *Aksi Database:* Dompet baru "${walletIcon} ${params.wallet_name}" berhasil dibuat dengan saldo awal Rp ${walletBalance.toLocaleString('id-ID')}!`;
          }
          else if (command_action === "delete_wallet" && params?.wallet_name) {
            const matchedWallet = wallets.find((w: any) => w.name.toLowerCase().includes(params.wallet_name.toLowerCase()));
            if (matchedWallet) {
              const { error: dErr } = await supabase.from("Wallets").delete().eq("id", matchedWallet.id);
              if (dErr) throw dErr;
              reportMsg += `\n\n🗑 *Aksi Database:* Dompet "${matchedWallet.name}" berhasil dihapus.`;
            } else {
              reportMsg += `\n\n⚠️ *Aksi Database Gagal:* Dompet dengan nama "${params.wallet_name}" tidak ditemukan.`;
            }
          }
        }
      }

      finalReportMsg += reportMsg + "\n";
    }

    // Send final synthesized reply back to user via WhatsApp Web Gateway API
    await sendWhatsAppMessage(chatId, finalReportMsg.trim());

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("WhatsApp Webhook POST Error details:", error);
    return NextResponse.json({ ok: true }); // Always return 200 to prevent WhatsApp from endlessly retrying failing payloads
  }
}
