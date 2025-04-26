import nodemailer from "nodemailer";

export async function POST(req) {
  const body = await req.json();
  const { name, email, message, service, privacy, honey, token } = body;

  if (honey) {
    return new Response(JSON.stringify({ error: "BOT detected" }), { status: 400 });
  }

  // reCAPTCHA v3 の検証
  const verifyRes = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
  });

  const json = await verifyRes.json();

  if (!json.success || json.score < 0.5) {
    return new Response(JSON.stringify({ error: "reCAPTCHA failed" }), { status: 400 });
  }

  // メール送信
  const transporter = nodemailer.createTransport({
    host: "smtp.example.com", // 例: smtp.gmail.com, smtp.sakura.ne.jp
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"お問い合わせフォーム" <${process.env.SMTP_USER}>`,
    to: process.env.SEND_TO,
    subject: "新しいお問い合わせが届きました",
    text: `
【お名前】 ${name}
【メールアドレス】 ${email}
【サービス】 ${service}
【内容】
${message}
    `,
  });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
