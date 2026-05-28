export const dynamic = 'force-dynamic';
import * as nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { getProfileData } from "@/services/profile";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/common/libs/rate-limit";

export const POST = async (request: Request) => {
  const ip = getClientIp(request);
  const rl = checkRateLimit(`email:${ip}`, RATE_LIMITS.contact);
  if (rl.limited) {
    return NextResponse.json(
      { message: `Terlalu banyak permintaan. Coba lagi dalam ${rl.retryAfter} detik.` },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { message: "Semua field (nama, email, pesan) wajib diisi." },
        { status: 400 },
      );
    }

    const profile = await getProfileData();
    const targetEmail = profile?.email || process.env.NODEMAILER_EMAIL || "";
    const ownerName = profile?.fullName || "";

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PW,
      },
    });

    const htmlTemplate = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 20px; color: #171717;">
        <h2 style="font-size: 24px; font-weight: 600; margin: 0 0 24px 0; border-bottom: 1px solid #e5e5e5; padding-bottom: 16px;">New Contact Message</h2>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <tr>
            <td style="padding: 8px 0; color: #737373; width: 80px; font-size: 14px;">Name:</td>
            <td style="padding: 8px 0; font-weight: 500; font-size: 14px;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #737373; font-size: 14px;">Email:</td>
            <td style="padding: 8px 0; font-weight: 500; font-size: 14px;">${email}</td>
          </tr>
        </table>

        <div style="background-color: #fafafa; border: 1px solid #e5e5e5; border-radius: 8px; padding: 20px; font-size: 15px; line-height: 1.6; color: #404040;">
          ${message}
        </div>

        <footer style="margin-top: 32px; font-size: 12px; color: #a3a3a3; text-align: center;">
          Sent from ${ownerName}'s Portfolio System
        </footer>
      </div>
    `;

    await transporter.sendMail({
      from: `"${name}" <${process.env.NODEMAILER_EMAIL}>`,
      replyTo: email,
      to: targetEmail,
      subject: `🚀 Contact Form: ${name}`,
      text: `${message} | Dikirim oleh: ${email}`,
      html: htmlTemplate,
    });

    return NextResponse.json(
      { message: "Email berhasil dikirim!" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Nodemailer Error:", error);
    return NextResponse.json(
      { message: "Gagal mengirim email", error: error.message },
      { status: 500 },
    );
  }
};
