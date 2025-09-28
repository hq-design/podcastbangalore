import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import { contactSchema } from "@/lib/validators";

export const runtime = "edge";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const rateLimit = new Map<string, { count: number; expires: number }>();

export async function POST(request: NextRequest) {
  try {
    const clientIp = headers().get("x-forwarded-for") ?? request.ip ?? "anonymous";
    if (!allowRequest(clientIp)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const payload = await request.json();
    const parseResult = contactSchema.safeParse(payload);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid contact payload", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, phone, message, preferredDate, preferredSlot, quoteSummary } = parseResult.data;

    console.info("Contact request received", {
      name,
      email,
      phone,
      preferredDate,
      preferredSlot,
      quoteSummary,
    });

    // TODO integrate with Resend/CRM once credentials are provided.

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Contact API error", error);
    return NextResponse.json({ error: "Contact submission failed" }, { status: 500 });
  }
}

function allowRequest(key: string) {
  const entry = rateLimit.get(key);
  const now = Date.now();
  if (!entry || entry.expires < now) {
    rateLimit.set(key, { count: 1, expires: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }
  entry.count += 1;
  rateLimit.set(key, entry);
  return true;
}
