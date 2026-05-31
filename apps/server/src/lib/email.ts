import { Resend } from "resend";
import { env } from "@zimdesigns/env/server";

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;
const FROM = env.FROM_EMAIL ?? "ZimDesigns <noreply@zimdesigns.com>";

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(payload: EmailPayload): Promise<void> {
  if (!resend) {
    console.log(`[EMAIL – dev mode] To: ${payload.to}\nSubject: ${payload.subject}\n${payload.html.replace(/<[^>]+>/g, "")}`);
    return;
  }
  await resend.emails.send({ from: FROM, ...payload });
}

export function passwordResetEmail(name: string, resetUrl: string): EmailPayload {
  return {
    subject: "Reset your ZimDesigns password",
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:32px 16px">
        <h1 style="font-size:24px;font-weight:900;color:#1a1a1a;margin-bottom:8px">Reset your password</h1>
        <p style="color:#555;margin-bottom:24px">Hi ${name}, click the button below to reset your password. This link expires in <strong>1 hour</strong>.</p>
        <a href="${resetUrl}" style="display:inline-block;background:#E8A900;color:#fff;font-weight:700;text-decoration:none;padding:12px 28px;border-radius:12px;font-size:15px">Reset password</a>
        <p style="color:#999;font-size:12px;margin-top:24px">If you didn't request this, you can safely ignore this email. The link will expire on its own.</p>
      </div>
    `,
    to: "",
  };
}

export function verificationEmail(name: string, verifyUrl: string): EmailPayload {
  return {
    subject: "Verify your ZimDesigns email",
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:32px 16px">
        <h1 style="font-size:24px;font-weight:900;color:#1a1a1a;margin-bottom:8px">Verify your email</h1>
        <p style="color:#555;margin-bottom:24px">Hi ${name}, click the button below to verify your email address and activate your ZimDesigns account.</p>
        <a href="${verifyUrl}" style="display:inline-block;background:#E8A900;color:#fff;font-weight:700;text-decoration:none;padding:12px 28px;border-radius:12px;font-size:15px">Verify email</a>
        <p style="color:#999;font-size:12px;margin-top:24px">This link expires in 24 hours. If you didn't create an account, you can ignore this email.</p>
      </div>
    `,
    to: "",
  };
}
