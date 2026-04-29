import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

// ==========================================
// TELEGRAM WEBHOOK HANDLER
// ==========================================

export async function POST(req) {
  try {
    const body = await req.json();

    // Pastikan ini adalah pesan dari Telegram
    if (!body.message || !body.message.text) {
      return new NextResponse('OK', { status: 200 }); // Return OK agar Telegram tidak mengirim ulang
    }

    const chatId = body.message.chat.id;
    const text = body.message.text;

    // Command Start
    if (text === '/start') {
      await sendTelegramMessage(chatId, "Halo! 👋 Saya adalah AI Asisten Keuangan Rekafin Anda.\n\nKirimkan pesan seperti:\n💬 _\"Beli kopi kenangan 25rb\"_\n💬 _\"Alhamdulillah gajian 5 juta\"_\n\nSaya akan otomatis mencatatnya ke database Anda!");
      return new NextResponse('OK', { status: 200 });
    }

    // Proses dengan AI
    const aiResult = await processFinanceWithAI(text);
    
    if (aiResult.error) {
      await sendTelegramMessage(chatId, `Maaf, saya tidak mengerti maksud pesan ini: "${text}". Harap masukkan contoh seperti: "Beli kopi 25rb"`);
      return new NextResponse('OK', { status: 200 });
    }

    // Simpan ke Database Supabase
    const saveResult = await saveToDatabase(aiResult);

    if (saveResult.success) {
      const typeIndo = aiResult.type === 'expense' ? '🔴 Pengeluaran' : '🟢 Pemasukan';
      const formattedAmount = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(aiResult.amount);
      
      const replyMessage = `✅ **Berhasil dicatat!**\n\nJenis: ${typeIndo}\nKeterangan: ${aiResult.item}\nNominal: ${formattedAmount}\nKategori: ${aiResult.category}\nSisa Saldo: ${saveResult.newBalance ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(saveResult.newBalance) : 'N/A'}`;
      
      await sendTelegramMessage(chatId, replyMessage);
    } else {
      await sendTelegramMessage(chatId, `❌ Gagal menyimpan transaksi. Pastikan dompet (Wallet) sudah terkonfigurasi di dashboard.`);
    }

    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.error('Telegram Webhook Error:', error);
    // Selalu kembalikan 200 OK ke Telegram agar tidak dianggap timeout dan diulang-ulang
    return new NextResponse('OK', { status: 200 }); 
  }
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

async function processFinanceWithAI(text) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY is not set');

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const prompt = `Kamu adalah asisten pengatur keuangan. Ekstrak data keuangan dari kalimat pengguna berikut: "${text}".
Pahami bahasa gaul (misal: "rb" = ribu, "jt" = juta, "gajian" = income, "jajan" = expense).
Jika kalimat tersebut tidak mengandung unsur keuangan, kembalikan JSON kosong {}.
Kembalikan HANYA format JSON valid tanpa awalan/akhiran markdown (jangan pakai \`\`\`json):
{
  "item": "nama pengeluaran/pemasukan",
  "amount": angka numerik (integer, tanpa titik/koma),
  "type": "expense" (jika pengeluaran) atau "income" (jika pemasukan/gaji/dapat uang),
  "category": "kategori umum"
}`;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text().trim();
    
    // Bersihkan jika ada sisa markdown
    if (responseText.startsWith('```json')) responseText = responseText.replace('```json', '');
    if (responseText.startsWith('```')) responseText = responseText.replace('```', '');
    if (responseText.endsWith('```')) responseText = responseText.slice(0, -3);

    const data = JSON.parse(responseText.trim());

    if (!data.item || !data.amount || !data.type) {
      return { error: true };
    }

    return data;
  } catch (e) {
    console.error('AI Processing Error:', e);
    return { error: true };
  }
}

async function saveToDatabase(data) {
  try {
    // Setup Supabase Client (Runtime)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // 1. Ambil wallet pertama sebagai default wallet
    const { data: wallets, error: walletError } = await supabaseAdmin
      .from('Wallets')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(1);

    if (walletError || !wallets || wallets.length === 0) {
      console.error('No wallet found');
      return { success: false };
    }

    const defaultWallet = wallets[0];

    // 2. Dapatkan tanggal hari ini YYYY-MM-DD
    const dateStr = new Date().toISOString().split('T')[0];

    // 3. Masukkan ke tabel FinancialTransactions
    const { error: insertError } = await supabaseAdmin
      .from('FinancialTransactions')
      .insert([{
        wallet_id: defaultWallet.id,
        type: data.type,
        amount: data.amount,
        description: data.item,
        date: dateStr,
      }]);

    if (insertError) throw insertError;

    // 4. Update saldo Wallet
    const newBalance = data.type === 'income' 
      ? Number(defaultWallet.balance) + Number(data.amount)
      : Number(defaultWallet.balance) - Number(data.amount);

    await supabaseAdmin
      .from('Wallets')
      .update({ balance: newBalance })
      .eq('id', defaultWallet.id);

    return { success: true, newBalance };
  } catch (error) {
    console.error('DB Error:', error);
    return { success: false };
  }
}

async function sendTelegramMessage(chatId, text) {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      console.error('TELEGRAM_BOT_TOKEN is not set');
      return;
    }

    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'Markdown'
      })
    });
  } catch (error) {
    console.error('Failed to send Telegram message:', error);
  }
}
