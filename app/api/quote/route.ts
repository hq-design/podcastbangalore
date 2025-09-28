import { NextRequest, NextResponse } from "next/server";

import { calculateQuote, formatCurrency } from "@/lib/pricing";
import { quoteSchema } from "@/lib/validators";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const parseResult = quoteSchema.safeParse(payload);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid quote payload", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }
    const breakdown = calculateQuote(parseResult.data);
    return NextResponse.json(
      {
        breakdown,
        formatted: {
          subtotal: formatCurrency(breakdown.subtotal),
          taxes: formatCurrency(breakdown.taxes),
          total: formatCurrency(breakdown.total),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Quote API error", error);
    return NextResponse.json(
      { error: "Quote calculation failed" },
      { status: 500 }
    );
  }
}
