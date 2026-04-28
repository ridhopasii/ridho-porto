import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { message } = await req.json();

    // Di sini Anda bisa mengintegrasikan OpenAI / Gemini API.
    // Contoh untuk Google Gemini:
    // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    // const result = await model.generateContent(prompt);
    // const responseText = result.response.text();

    // Untuk sementara, kita berikan response dummy cerdas:
    const lowerMsg = message.toLowerCase();
    let reply = "Maaf, saya masih dalam tahap pengembangan. Namun saya bisa membantu menyampaikan pesan Anda ke Ridho secara langsung melalui halaman Kontak!";

    if (lowerMsg.includes('halo') || lowerMsg.includes('hai')) {
      reply = "Halo! Saya adalah Virtual Ridho. Apa yang ingin Anda ketahui tentang proyek atau pengalaman saya?";
    } else if (lowerMsg.includes('pengalaman') || lowerMsg.includes('kerja')) {
      reply = "Ridho memiliki pengalaman luas dalam pengembangan Full-Stack Web menggunakan Next.js, React, Node.js, dan Supabase. Anda bisa melihat detailnya di bagian 'Experience' atau 'Proyek'.";
    } else if (lowerMsg.includes('kontak') || lowerMsg.includes('hubungi')) {
      reply = "Anda dapat menghubungi Ridho melalui form kontak di bagian bawah web ini, atau mengirim email langsung ke alamat yang tertera di sana.";
    }

    // Delay simulasi AI berpikir
    await new Promise(resolve => setTimeout(resolve, 1500));

    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json({ reply: 'Terjadi kesalahan pada server AI.' }, { status: 500 });
  }
}
