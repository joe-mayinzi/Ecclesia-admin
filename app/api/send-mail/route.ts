import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { to, subject, message } = await req.json();

    const transporter = nodemailer.createTransport({
      host: "mail.linked-solution.com",
      port: 587,
      secure: false, // 587 utilise STARTTLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false, // pour éviter les erreurs si certificat self-signed
      },
    });

    // Teste la connexion avant d'envoyer
    await transporter.verify();

    await transporter.sendMail({
      from: `Linked Solution <${process.env.SMTP_USER}>`,
      to,
      subject,
      text: message,
      html: `<p>${message}</p>`,
    });

    const info = await transporter.sendMail({
      from: `Linked Solution <${process.env.SMTP_USER}>`,
      to,
      subject,
      text: message,
      html: `<p>${message}</p>`,
    });

    // 🔥 Log complet pour voir la réponse du serveur SMTP
    console.log("✅ MAIL INFO:", info);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur Nodemailer:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
