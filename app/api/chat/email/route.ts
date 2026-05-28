export const dynamic = 'force-dynamic';
import * as nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PW,
      },
    });

    if (body.type === "REPLY_NOTIFICATION") {
      const { targetEmail, senderName, message } = body;

      const htmlReply = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 20px; color: #171717;">
          <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 24px 0;">New Reply on Guestbook</h2>
          <p style="font-size: 15px; line-height: 1.6; margin-bottom: 24px; color: #404040;">
            <strong>${senderName}</strong> replied to your message on the Guestbook:
          </p>
          <div style="background-color: #fafafa; border-left: 3px solid #171717; padding: 16px 20px; font-size: 15px; line-height: 1.6; color: #404040; margin-bottom: 24px;">
            ${message}
          </div>
          <a href="https://ridhorobbipasi.my.id/guestbook" style="display: inline-block; background-color: #171717; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 14px; font-weight: 500;">View Guestbook</a>
        </div>
      `;

      await transporter.sendMail({
        from: `"Ridho Robbi Pasi" <${process.env.NODEMAILER_EMAIL}>`,
        to: targetEmail,
        subject: `Re: Pesan kamu dibalas oleh ${senderName}`,
        html: htmlReply,
      });
    } else {
      const { name, email, message } = body;

      const htmlNewChat = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 20px; color: #171717;">
          <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 24px 0;">New Guestbook Message</h2>
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
          <div style="background-color: #fafafa; border-left: 3px solid #171717; padding: 16px 20px; font-size: 15px; line-height: 1.6; color: #404040; margin-bottom: 24px;">
            ${message}
          </div>
          <a href="https://ridhorobbipasi.my.id/guestbook" style="display: inline-block; background-color: #171717; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 14px; font-weight: 500;">Reply in Guestbook</a>
        </div>
      `;

      await transporter.sendMail({
        from: `"Guestbook System" <${process.env.NODEMAILER_EMAIL}>`,
        to: "ridhorobbipasi@gmail.com",
        subject: `New Guestbook Message from ${name} 💬`,
        html: htmlNewChat,
      });
    }

    return NextResponse.json({ message: "Sent" });
  } catch (error: any) {
    console.error("Email Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
