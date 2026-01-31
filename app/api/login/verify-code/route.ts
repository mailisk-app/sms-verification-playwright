import { NextResponse } from "next/server";
import { consumeOtp } from "@/lib/otp-store";

export async function POST(request: Request) {
  const { code } = await request.json();

  if (typeof code !== "string" || code.trim().length === 0) {
    return NextResponse.json({ error: "Code required" }, { status: 400 });
  }

  const sanitizedCode = code.trim();
  const isValid = consumeOtp(sanitizedCode);

  if (!isValid) {
    return NextResponse.json(
      { error: "Invalid or expired code" },
      { status: 400 }
    );
  }

  return NextResponse.json({ ok: true });
}
