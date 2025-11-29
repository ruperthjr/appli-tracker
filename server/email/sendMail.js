import nodemailer from "nodemailer";

export async function sendMailServices(to, subject, text) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.ADMIN_EMAIL,
      pass: process.env.ADMIN_EMAIL_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: process.env.ADMIN_EMAIL,
    to,
    subject,
    text,
  });

  return info;
}