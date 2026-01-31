import { NextResponse } from "next/server";
import { MailiskClient } from "mailisk";
import { saveOtp } from "@/lib/otp-store";

const MAILISK_API_KEY = process.env.MAILISK_API_KEY;
const mailiskClient = MAILISK_API_KEY
  ? new MailiskClient({ apiKey: MAILISK_API_KEY })
  : null;

const OTP_LENGTH = 6;

export async function POST(request: Request) {
  const { phone } = await request.json();

  if (typeof phone !== "string" || phone.trim().length === 0) {
    return NextResponse.json(
      { error: "Phone number required" },
      { status: 400 }
    );
  }

  if (!mailiskClient) {
    return NextResponse.json(
      { error: "SMS provider not configured" },
      { status: 500 }
    );
  }

  const sanitizedPhone = phone.trim();
  const code = generateOtpCode();

  try {
    await mailiskClient.sendVirtualSms({
      from_number: "+15557654321",
      to_number: sanitizedPhone,
      body: `Your verification code is ${code}. It expires in 5 minutes.`,
    });
  } catch (error) {
    console.error("Failed to send SMS via Mailisk", error);
    return NextResponse.json({ error: "Unable to send SMS" }, { status: 502 });
  }

  saveOtp(sanitizedPhone, code);

  return NextResponse.json({ ok: true });
}

function generateOtpCode() {
  const min = 10 ** (OTP_LENGTH - 1);
  const max = 10 ** OTP_LENGTH - 1;
  return Math.floor(Math.random() * (max - min + 1) + min).toString();
}
