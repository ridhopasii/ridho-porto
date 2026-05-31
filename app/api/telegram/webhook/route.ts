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

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ALLOWED_CHAT_ID = process.env.TELEGRAM_ALLOWED_CHAT_ID;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

const sendMessage = async (chatId: string | number, text: string) => {
  if (!TELEGRAM_TOKEN) return;
  try {
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text })
    });
    if (!res.ok) {
      const errorData = await res.text();
      console.error("Telegram API Error Response:", errorData);
    }
  } catch (e) {
    console.error("Failed to send telegram message", e);
  }
};

async function getTelegramFileBase64(fileId: string): Promise<{ mimeType: string, data: string } | null> {
  if (!TELEGRAM_TOKEN) return null;
  try {
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/getFile?file_id=${fileId}`);
    const data = await res.json();
    if (!data.ok) return null;
    
    const filePath = data.result.file_path;
    const fileRes = await fetch(`https://api.file.telegram.org/file/bot${TELEGRAM_TOKEN}/${filePath}`);
    const arrayBuffer = await fileRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const mimeType = (filePath.endsWith('.oga') || filePath.endsWith('.ogg')) ? 'audio/ogg' : 'image/jpeg';
    return { mimeType, data: buffer.toString('base64') };
  } catch(e) {
    console.error("Failed to fetch telegram media", e);
    return null;
  }
}

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

export async function POST(req: Request) {
  const urlObj = new URL(req.url);
  const isDebug = urlObj.searchParams.get("debug") === "true";
  const debugLogs: string[] = [];
  try {
    debugLogs.push("POST started");
    debugLogs.push(`TELEGRAM_BOT_TOKEN defined: ${!!TELEGRAM_TOKEN} (length: ${TELEGRAM_TOKEN?.length || 0})`);
    debugLogs.push(`ALLOWED_CHAT_ID: "${ALLOWED_CHAT_ID}"`);
    debugLogs.push(`GEMINI_API_KEY defined: ${!!GEMINI_API_KEY} (length: ${GEMINI_API_KEY?.length || 0})`);
    debugLogs.push(`SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`);
    debugLogs.push(`SUPABASE_SERVICE_ROLE_KEY defined: ${!!process.env.SUPABASE_SERVICE_ROLE_KEY} (length: ${process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0})`);

    const body = await req.json();
    const message = body.message;
    
    if (!message) {
      debugLogs.push("No message in body");
      return NextResponse.json(isDebug ? { ok: true, debug: true, logs: debugLogs } : { ok: true });
    }

    if (!message.text && !message.photo && !message.voice) {
      debugLogs.push("Message has no text, photo, or voice");
      return NextResponse.json(isDebug ? { ok: true, debug: true, logs: debugLogs } : { ok: true });
    }

    const chatId = message.chat.id.toString();
    debugLogs.push(`Received chatId: "${chatId}"`);
    if (chatId !== ALLOWED_CHAT_ID) {
      debugLogs.push("chatId mismatch with ALLOWED_CHAT_ID");
      return NextResponse.json(isDebug ? { ok: true, debug: true, logs: debugLogs, chat_id_mismatch: true } : { ok: true });
    }

    let text = message.text || message.caption || "";
    text = text.trim();
    
    if (text === "/start" || text === "/help") {
      debugLogs.push("Sending help/start message");
      await sendMessage(chatId, "👋 Halo Bos!\n\nAsisten AI sudah aktif. Kirim pesan senatural mungkin!\n\nContoh Teks:\n`Tadi beli ayam 25rb pake Gopay`\n\nContoh Foto:\nKirim struk belanja minimarket\n\nContoh Suara:\nKirim voice note tagihan.\n\n✨ **Fitur Baru (V3):**\n1. **Deteksi Anomali & Typo**: Peringatan jika nominal tidak wajar.\n2. **Audit Langganan**: Ketik `Audit langgananku`.\n3. **Analisis Habit**: Ketik `Analisis habitku`.\n4. **Jurnal Suara**: Kirim Voice Note cerita harian malam hari.\n5. **Perintah Suara**: Ketik `Hapus tugas [Nama]`.\n6. **Kegiatan & Produktivitas Harian**: Ketik `Gimana produktivitasku hari ini?` atau `Apa aja kegiatanku hari ini?`.");
      debugLogs.push("Help/start message sent");
      return NextResponse.json(isDebug ? { ok: true, debug: true, logs: debugLogs } : { ok: true });
    }

    let inlineData = null;
    if (message.photo && message.photo.length > 0) {
      debugLogs.push("Retrieving Telegram photo...");
      const photo = message.photo[message.photo.length - 1];
      inlineData = await getTelegramFileBase64(photo.file_id);
      debugLogs.push(`Photo base64 fetched: ${!!inlineData}`);
    } else if (message.voice) {
      debugLogs.push("Retrieving Telegram voice...");
      inlineData = await getTelegramFileBase64(message.voice.file_id);
      debugLogs.push(`Voice base64 fetched: ${!!inlineData}`);
    }

    const todayStr = new Date().toISOString().split("T")[0];

    debugLogs.push("Fetching Supabase dependencies in parallel...");
    // Fetch context data in parallel (including today's specific productivity & habits config)
    const [wallets, averages, subAudit, habitFriction, todayProd, todayHabitTrack, habitsConfig] = await Promise.all([
      supabase.from("Wallets").select("*").then(res => res.data || []),
      getHistoricalExpenses(),
      getSubscriptionAuditData(),
      getHabitFrictionData(),
      supabase.from("Productivity").select("*").eq("date", todayStr).maybeSingle().then(res => res.data),
      supabase.from("MonthlyTracker").select("*").eq("date", todayStr).maybeSingle().then(res => res.data),
      supabase.from("HabitConfig").select("*").then(res => res.data || []),
    ]);

    debugLogs.push(`Supabase queries completed. Wallets count: ${wallets?.length || 0}`);

    if (!wallets || wallets.length === 0) {
      debugLogs.push("No wallets found in Supabase");
      await sendMessage(chatId, "⚠️ Error: Tidak ada Wallet yang ditemukan di Database. Buat dompet dulu di Private Hub.");
      return NextResponse.json(isDebug ? { ok: true, debug: true, logs: debugLogs, error: "No wallets" } : { ok: true });
    }

    // Prepare rich today status strings to inject into Gemini prompt
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

Aturan Output:
1. Kembalikan data MURNI berupa JSON Object (tanpa markdown).
2. JSON harus memiliki 3 properti utama:
   - "type": Tipe interaksi, pilih salah satu:
     * "TRANSACTION": Jika pengguna ingin mencatat transaksi (pemasukan/pengeluaran).
     * "JOURNAL": Jika pengguna sedang menceritakan jurnal harian, curhat keseharian, standup harian, atau mencentang tugas/habits.
     * "DATABASE_COMMAND": Jika pengguna ingin memanipulasi database secara langsung (tambah/hapus tugas, ganti mood, ubah sasaran).
     * "ANALYSIS": Jika pengguna secara eksplisit meminta analisis atau saran keuangan/habit, ATAU meminta laporan produktivitas & kegiatan hari ini (misal: "apa saja kegiatanku hari ini", "audit langgananku", "cek kebocoran dana", "analisis habitku").
   - "reply": Balasan Anda untuk user menggunakan gaya bahasa asisten yang cerdas, santai, dan penuh empati.
     * Jika pengguna menanyakan tentang produktivitas, kegiatan, tugas, atau habits hari ini, gunakan informasi dari Konteks Produktivitas & Habits Hari Ini di atas untuk membuat rangkuman visual yang cantik, ceria, dan memotivasi.
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
         "command_action": "add_task" | "delete_task" | "complete_task" | "update_mood" | "update_goals" | "create_wallet" | "add_reminder"
         "params": {
           "task_name": nama tugas (untuk add_task / delete_task / complete_task)
           "mood": mood (untuk update_mood)
           "goals": ringkasan sasaran (untuk update_goals)
           "wallet_name": nama dompet/bank baru (untuk create_wallet, misal "Bank BSI", "Gopay Kedua")
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

    const contentsParts: any[] = [{ text: prompt }];
    if (inlineData) {
      contentsParts.push({ inlineData });
    }

    debugLogs.push("Calling Gemini API...");
    const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ parts: contentsParts }],
            generationConfig: { response_mime_type: "application/json" }
        })
    });

    if (!aiRes.ok) {
      const aiErrText = await aiRes.text();
      debugLogs.push(`Gemini API Error: Status ${aiRes.status} - ${aiErrText}`);
      throw new Error(`Gemini API returned status ${aiRes.status}`);
    }

    const aiData = await aiRes.json();
    debugLogs.push("Gemini API returned response successfully");
    
    let aiResponse: any = { type: "ANALYSIS", reply: "Maaf, sistem AI sedang bingung.", data: {} };
    
    try {
      const responseText = aiData.candidates[0].content.parts[0].text;
      const cleanJsonStr = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      aiResponse = JSON.parse(cleanJsonStr);
    } catch (e: any) {
      debugLogs.push(`Failed to parse Gemini response: ${e.message}`);
      await sendMessage(chatId, "⚠️ Gagal memproses obrolan dengan AI. Format respons tidak valid.");
      return NextResponse.json(isDebug ? { ok: true, debug: true, logs: debugLogs, error: "AI response parsing failed" } : { ok: true });
    }

    const { type, reply, data } = aiResponse;
    debugLogs.push(`Gemini interaction type: ${type}`);
    let reportMsg = reply + "\n";

    // 1. HANDLER: TRANSACTION
    if (type === "TRANSACTION" && data?.transactions && Array.isArray(data.transactions) && data.transactions.length > 0) {
      debugLogs.push("Handling TRANSACTION request...");
      reportMsg += "\n📝 **Catatan Transaksi:**\n";
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
        reportMsg += `\n⚠️ **PERINGATAN ANOMALI:** Nominal pengeluaran di atas terdeteksi jauh lebih tinggi dari kebiasaan Anda. Harap dipastikan tidak ada salah ketik!`;
      }
      debugLogs.push("Transactions processed successfully");
    }

    // 2. HANDLER: JOURNAL
    else if (type === "JOURNAL" && data) {
      debugLogs.push("Handling JOURNAL request...");
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

      reportMsg += `\n\n📌 **Sinkronisasi Jurnal:**\n`;
      reportMsg += `🤩 Mood Hari Ini: ${data.mood || "🙂"}\n`;
      if (tasksUpdatedCount > 0) reportMsg += `✅ ${tasksUpdatedCount} Tugas Harian dicentang selesai!\n`;
      if (habitsUpdatedCount > 0) reportMsg += `🔥 ${habitsUpdatedCount} Habits dicentang selesai!\n`;
      debugLogs.push("Journal processed successfully");
    }

    // 3. HANDLER: DATABASE_COMMAND
    else if (type === "DATABASE_COMMAND" && data) {
      debugLogs.push(`Handling DATABASE_COMMAND: ${data.command_action}...`);
      const { command_action, params } = data;
      const todayItem = await ensureTodayProductivityRecord(supabase);
      let currentTasks: any[] = [];
      try { currentTasks = JSON.parse(todayItem.tasks || "[]"); } catch(e){}

      if (command_action === "add_task" && params?.task_name) {
        currentTasks.push({ name: params.task_name, completed: false });
        await supabase.from("Productivity").update({ tasks: JSON.stringify(currentTasks) }).eq("id", todayItem.id);
        reportMsg += `\n\n➕ **Aksi Database:** Tugas "${params.task_name}" ditambahkan ke hari ini.`;
      }
      else if (command_action === "delete_task" && params?.task_name) {
        const filteredTasks = currentTasks.filter((t: any) => !t.name.toLowerCase().includes(params.task_name.toLowerCase()));
        const deletedCount = currentTasks.length - filteredTasks.length;
        await supabase.from("Productivity").update({ tasks: JSON.stringify(filteredTasks) }).eq("id", todayItem.id);
        reportMsg += `\n\n🗑️ **Aksi Database:** Berhasil menghapus ${deletedCount} tugas matching "${params.task_name}".`;
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
        reportMsg += `\n\n✅ **Aksi Database:** Berhasil mencentang selesai ${updated} tugas matching "${params.task_name}".`;
      }
      else if (command_action === "update_mood" && params?.mood) {
        await supabase.from("Productivity").update({ mood: params.mood }).eq("id", todayItem.id);
        reportMsg += `\n\n🤩 **Aksi Database:** Mood diperbarui menjadi "${params.mood}".`;
      }
      else if (command_action === "update_goals" && params?.goals) {
        await supabase.from("Productivity").update({ goals: params.goals }).eq("id", todayItem.id);
        reportMsg += `\n\n🎯 **Aksi Database:** Sasaran/Goals hari ini diperbarui.`;
      }
      else if (command_action === "create_wallet" && params?.wallet_name) {
        const walletIcon = params.icon || "💳";
        const walletBalance = Number(params.balance) || 0;
        
        const { data: newW, error: wErr } = await supabase.from("Wallets").insert([{
          name: params.wallet_name,
          balance: walletBalance,
          icon: walletIcon
        }]).select().single();
        
        if (wErr) throw wErr;
        reportMsg += `\n\n💳 **Aksi Database:** Dompet baru "${walletIcon} ${params.wallet_name}" berhasil dibuat dengan saldo awal Rp ${walletBalance.toLocaleString('id-ID')}!`;
      }
      else if (command_action === "add_reminder" && params?.reminder_text && params?.reminder_time) {
        const { data: exist } = await supabase
          .from("SiteSettings")
          .select("*")
          .eq("key", "tg_reminders")
          .maybeSingle();

        let list = [];
        if (exist && exist.value) {
          try { list = JSON.parse(exist.value); } catch(e){}
        }

        const newReminder = {
          id: Date.now(),
          text: params.reminder_text,
          time: params.reminder_time,
          chatId: chatId,
          completed: false
        };

        list.push(newReminder);

        if (exist) {
          await supabase
            .from("SiteSettings")
            .update({ value: JSON.stringify(list) })
            .eq("key", "tg_reminders");
        } else {
          await supabase
            .from("SiteSettings")
            .insert([{ key: "tg_reminders", value: JSON.stringify(list) }]);
        }

        const formattedTime = new Date(params.reminder_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        const formattedDate = new Date(params.reminder_time).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' });
        
        reportMsg += `\n\n⏰ **Pengingat AI Dijadwalkan:**\n📌 *"${params.reminder_text}"*\n⏰ Waktu: *${formattedDate} pukul ${formattedTime}*`;
      }
      debugLogs.push("Database command processed successfully");
    }

    debugLogs.push("Sending final message response to Telegram...");
    await sendMessage(chatId, reportMsg.trim());
    debugLogs.push("Final message sent successfully");
    
    return NextResponse.json(isDebug ? { ok: true, debug: true, logs: debugLogs } : { ok: true });
  } catch (error: any) {
    console.error("Telegram Webhook Error:", error);
    if (isDebug) {
      return NextResponse.json({ ok: false, error: error.message, stack: error.stack, logs: debugLogs });
    }
    return NextResponse.json({ ok: true });
  }
}
