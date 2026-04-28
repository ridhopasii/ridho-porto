import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req) {
  try {
    const { message } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      const prompt = `Kamu adalah Virtual Asisten cerdas untuk portofolio milik Ridho Robbi Pasi (seorang Full Stack Web Developer & UI/UX). Jawab dengan singkat, sopan, dan dalam bahasa Indonesia. User bertanya: ${message}`;
      
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      return NextResponse.json({ reply: responseText });
    }

    // Jika API Key belum diset, gunakan logika fallback:
    const lowerMsg = message.toLowerCase();
    let reply = "Maaf, sistem AI masih dalam tahap integrasi. Namun saya bisa membantu menyampaikan pesan Anda ke Ridho secara langsung melalui halaman Kontak!";

    if (lowerMsg.includes('halo') || lowerMsg.includes('hai')) {
      reply = "Halo! Saya adalah Virtual Ridho. Apa yang ingin Anda ketahui tentang proyek atau pengalaman saya?";
    } else if (lowerMsg.includes('pengalaman') || lowerMsg.includes('kerja')) {
      reply = "Ridho memiliki pengalaman luas dalam pengembangan Full-Stack Web menggunakan Next.js, React, Node.js, dan Supabase. Anda bisa melihat detailnya di bagian 'Experience' atau 'Proyek'.";
    } else if (lowerMsg.includes('kontak') || lowerMsg.includes('hubungi')) {
      reply = "Anda dapat menghubungi Ridho melalui form kontak di bagian bawah web ini.";
    }

    await new Promise(resolve => setTimeout(resolve, 1500));
    return NextResponse.json({ reply });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ reply: 'Terjadi kesalahan pada server AI.' }, { status: 500 });
  }
}
