import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY || "re_sample_key";
const emailFrom = process.env.EMAIL_FROM || "Dicatetin <notifikasi@dicatetin.id>";

const resend = new Resend(apiKey);

export async function sendReminderEmail(toEmail: string, userName: string) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.log(`[Email Mock] Sent reminder email to ${toEmail} for ${userName}`);
      return { success: true };
    }

    return await resend.emails.send({
      from: emailFrom,
      to: toEmail,
      subject: "Hai, belum ada catatan pengeluaran hari ini nih 📝",
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e3ebe6; border-radius: 16px;">
          <h2 style="color: #0F7A4F;">Hai ${userName},</h2>
          <p style="color: #5B6B62; line-height: 1.6;">
            Hari ini kamu belum mencatat transaksi keuangan apa pun nih. Yuk luangkan 10 detik untuk mencatat pengeluaranmu agar keuanganmu tetap rapi!
          </p>
          <div style="margin: 24px 0;">
            <a href="https://dicatetin.id/app" style="background-color: #0F7A4F; color: #ffffff; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: bold; display: inline-block;">
              Buka Dashboard Dicatetin
            </a>
          </div>
          <p style="color: #93a69b; font-size: 12px;">
            Dicatetin &middot; Manajemen Keuangan Pribadi Berbasis AI
          </p>
        </div>
      `,
    });
  } catch (err) {
    console.error("sendReminderEmail error:", err);
    return { success: false, error: err };
  }
}

export async function sendActivationEmail(toEmail: string, userName: string, planName: string) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.log(`[Email Mock] Sent activation email to ${toEmail} for ${userName} (${planName})`);
      return { success: true };
    }

    return await resend.emails.send({
      from: emailFrom,
      to: toEmail,
      subject: "🎉 Selamat! Akun Dicatetin kamu sudah aktif",
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e3ebe6; border-radius: 16px;">
          <h2 style="color: #0F7A4F;">Selamat datang, ${userName}!</h2>
          <p style="color: #5B6B62; line-height: 1.6;">
            Akun Dicatetin paket <strong>${planName}</strong> kamu telah aktif selama 30 hari ke depan. Sekarang kamu bisa mencatat pemasukan dan pengeluaran secara teratur.
          </p>
          <div style="margin: 24px 0;">
            <a href="https://dicatetin.id/app" style="background-color: #0F7A4F; color: #ffffff; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: bold; display: inline-block;">
              Mulai Catat Sekarang
            </a>
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error("sendActivationEmail error:", err);
    return { success: false, error: err };
  }
}
