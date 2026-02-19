import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { name, email, subject, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  // TODO: connect to your email service (e.g. Resend, Nodemailer, SendGrid)
  // Example with Resend:
  //
  // import { Resend } from "resend";
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({
  //   from: "contact@b2alpha.io",
  //   to: "team@b2alpha.io",
  //   subject: subject || `Contact form: ${name}`,
  //   text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
  // });

  console.log("[contact form]", { name, email, subject, message });

  return NextResponse.json({ ok: true });
}
