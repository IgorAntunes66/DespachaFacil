import nodemailer from "nodemailer";

function createTransport() {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_SMTP_HOST,
    port: Number(process.env.EMAIL_SMTP_PORT),
    secure: process.env.EMAIL_SMTP_SECURE === "true",
    requireTLS: process.env.NODE_ENV === "production",
    auth: process.env.EMAIL_SMTP_USER
      ? {
          user: process.env.EMAIL_SMTP_USER,
          pass: process.env.EMAIL_SMTP_PASSWORD,
        }
      : undefined,
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 10000,
  });

  return transport;
}

async function send({ to, subject, text, html }) {
  const transport = createTransport();

  return transport.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text,
    html,
  });
}

async function verifyConnection() {
  const transport = createTransport();
  return transport.verify();
}

const email = { send, verifyConnection };

export default email;
