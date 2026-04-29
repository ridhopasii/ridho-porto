import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

// Setup Supabase Client dengan Service Role Key untuk bypass RLS (karena ini webhook dari server)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 1. Meta Webhook Verification (GET)
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('Webhook verified successfully!');
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse('Forbidden', { status: 403 });
}

// 2. Terima Pesan dari WhatsApp (POST)
export async function POST(req) {
  try {
    const body = await req.json();

    // Pastikan ini adalah pesan WhatsApp
    if (body.object !== 'whatsapp_business_account') {
      return new NextResponse('Not a WhatsApp Webhook', { status: 404 });
    }

    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const messages = value?.messages;

    if (!messages || messages.length === 0) {
      // Bukan pesan teks/media (mungkin status update)
      return new NextResponse('OK', { status: 200 });
    }

    const message = messages[0];
    const senderPhone = message.from;
    const msgId = message.id;

    // Untuk saat ini kita handle teks. Jika ada gambar (struk), bisa ditambah logika OCR.
    if (message.type === 'text') {
      const text = message.text.body;

      // Proses dengan AI
      const aiResult = await processFinanceWithAI(text);
      
      if (aiResult.error) {
        await sendWhatsAppMessage(senderPhone, `Maaf, saya tidak mengerti maksud pesan ini: "${text}". Harap masukkan contoh seperti: "Beli kopi 25rb"`);
        return new NextResponse('OK', { status: 200 });
      }

      // Simpan ke Database
      const saveResult = await saveToDatabase(aiResult);

      if (saveResult.success) {
        const typeIndo = aiResult.type === 'expense' ? 'Pengeluaran' : 'Pemasukan';
        const formattedAmount = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(aiResult.amount);
        
        await sendWhatsAppMessage(
          senderPhone, 
          `✅ Berhasil dicatat!\n\nJenis: ${typeIndo}\nKeterangan: ${aiResult.item}\nNominal: ${formattedAmount}\nKategori: ${aiResult.category}\nSisa Saldo: ${saveResult.newBalance ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(saveResult.newBalance) : 'N/A'}`
        );
      } else {
        await sendWhatsAppMessage(senderPhone, `❌ Gagal menyimpan transaksi. Pastikan dompet (Wallet) sudah terkonfigurasi di dashboard.`);
      }
    } else {
      // Handler untuk tipe media (image, etc.)
      await sendWhatsAppMessage(senderPhone, "Saat ini saya baru bisa membaca pesan teks. Fitur baca foto struk segera hadir!");
    }

    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.error('Webhook POST Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
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
    // 1. Ambil wallet pertama sebagai default wallet (Bisa di-improve dengan matching nama dompet)
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

async function sendWhatsAppMessage(to, text) {
  try {
    const token = process.env.WHATSAPP_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_ID;

    if (!token || !phoneId) {
      console.log(`[MOCK WA SEND] To: ${to} | Text: ${text}`);
      return;
    }

    const response = await fetch(`https://graph.facebook.com/v18.0/${phoneId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: to,
        type: 'text',
        text: { body: text }
      })
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('WhatsApp API Error:', data);
    }
  } catch (error) {
    console.error('Failed to send WhatsApp message:', error);
  }
}
