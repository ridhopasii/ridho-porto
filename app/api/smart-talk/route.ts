import { NextResponse } from "next/server";
import { createPublicClient } from "@/common/utils/serverPublic";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/common/libs/rate-limit";

export const dynamic = "force-dynamic";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

async function buildSystemInstructions(): Promise<string> {
  try {
    const supabase = createPublicClient();

    // Fetch profile data dynamically
    const { data: profile } = await supabase
      .from("Profile")
      .select("fullName, title, bio, location, email, whatsappUrl")
      .limit(1)
      .single();

    // Fetch skills dynamically
    const { data: skills } = await supabase
      .from("Skill")
      .select("name, category")
      .limit(50);

    const name = profile?.fullName || "Portfolio Owner";
    const title = profile?.title || "Fullstack Developer";
    const bio = profile?.bio || "";
    const location = profile?.location || "Indonesia";
    const domain = process.env.DOMAIN || "";

    const skillNames = skills?.map((s: any) => s.name).join(", ") || "React, Next.js, TypeScript, TailwindCSS";

    return `
You are 'Smart Talk', an interactive, premium AI Assistant custom-built for ${name}'s developer portfolio website.
Your primary role is to act as an agent representing ${name}.
${name} is an experienced ${title} based in ${location}.
${bio ? `About them: ${bio}` : ""}
${domain ? `Their website/portfolio is ${domain}.` : ""}

Key skills: ${skillNames}

When answering:
1. Be extremely helpful, warm, professional, and friendly.
2. Provide precise and structured information using Markdown (bullet points, bold text, clean formatting).
3. If the user asks about personal details, share their skills, experience, and direct them to the Contact page or Projects section.
4. Keep responses concise but complete and engaging.
5. Respond in the same language the user writes in (Indonesian or English).
`.trim();
  } catch {
    // Fallback to minimal instructions if DB fetch fails
    return `
You are 'Smart Talk', a premium AI Assistant for this developer portfolio website.
Help visitors learn about the portfolio owner's skills, experience, and projects.
Be helpful, warm, and professional. Respond in the user's language.
`.trim();
  }
}

export async function POST(request: Request) {
  // Rate limiting: max 20 AI requests per minute per IP
  const ip = getClientIp(request);
  const rateLimitResult = checkRateLimit(`smart-talk:${ip}`, RATE_LIMITS.ai);
  if (rateLimitResult.limited) {
    return NextResponse.json(
      { error: `Terlalu banyak permintaan. Coba lagi dalam ${rateLimitResult.retryAfter} detik.` },
      { status: 429, headers: { "Retry-After": String(rateLimitResult.retryAfter) } }
    );
  }

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

    const systemInstructions = await buildSystemInstructions();

    // Map messages to Gemini API format (roles: 'user' | 'model')
    const contents = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          systemInstruction: {
            parts: [{ text: systemInstructions }]
          },
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
          }
        }),
      }
    );

    if (!response.ok) {
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
    return NextResponse.json(
      { error: "Terjadi kesalahan internal pada server.", message: error.message },
      { status: 500 }
    );
  }
}
