import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

const SYSTEM_INSTRUCTIONS = `
You are 'Smart Talk', an interactive, premium AI Assistant custom-built for Ridho Robbi Pasi's developer portfolio website.
Your primary role is to act as an agent representing Ridho Robbi Pasi.
Ridho Robbi Pasi is an experienced Fullstack / Frontend Developer based in Indonesia.
He specializes in building high-quality, modern, premium, and beautiful web applications using React, Next.js, TypeScript, TailwindCSS, and Supabase.
His website/portfolio is ridhorobbipasi.my.id.

Key details about Ridho:
- Skills: React, Next.js, TypeScript, JavaScript, TailwindCSS, Supabase, PostgreSQL, Node.js, Prisma, REST APIs, Git.
- Personality: Professional, warm, logical, highly detailed, growth-oriented, and focused on result-oriented execution.
- Work philosophy: Writing clean, secure, and performant code with rich visual aesthetics.
- Languages: Indonesian (Bahasa Indonesia) and English. Respond in the language that the user queries in.

When answering:
1. Be extremely helpful, warm, professional, and friendly.
2. Provide precise and structured information using Markdown (such as bullet points, bold text, and clean formatting).
3. If the user asks about Ridho's details, tell them about his skills, experience, and direct them to the Contact page or projects tab!
4. Keep your responses relatively concise but complete and engaging.
`;

export async function POST(request: Request) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "Gemini API key is not configured in the environment." },
      { status: 500 }
    );
  }

  try {
    const { messages } = await request.json();
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Format request tidak valid. 'messages' diperlukan." },
        { status: 400 }
      );
    }

    // Format messages into Gemini API contents structure
    // Gemini expects an array of contents like: { role: "user" | "model", parts: [{ text: "..." }] }
    // Note: Gemini roles are 'user' and 'model' (not 'assistant' like OpenAI). We must map them!
    const contents = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    // Inject the system instruction as the system instruction parameter in Gemini API v1beta
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents,
          systemInstruction: {
            parts: [{ text: SYSTEM_INSTRUCTIONS }]
          },
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
          }
        }),
      }
    );

    if (!response.ok) {
      // Jika Gemini API gagal, kirimkan respons fallback yang ramah pengguna
      console.error("Gemini API Error (fallback):", await response.text());
      return NextResponse.json(
        {
          success: false,
          reply: "Maaf, AI tidak tersedia saat ini. Silakan coba lagi nanti.",
        },
        { status: 200 }
      );
    }

    const resJson = await response.json();
    const replyText = resJson.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!replyText) {
      throw new Error("Tanggapan kosong diterima dari Gemini AI.");
    }

    return NextResponse.json({ success: true, reply: replyText });
  } catch (error: any) {
    console.error("Smart Talk Chat Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal pada server.", message: error.message },
      { status: 500 }
    );
  }
}
