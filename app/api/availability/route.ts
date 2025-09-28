import { NextRequest, NextResponse } from "next/server";

import { fetchAvailability } from "@/lib/availability";
import { availabilityQuerySchema } from "@/lib/validators";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parseResult = availabilityQuerySchema.safeParse({
      start: searchParams.get("start") ?? undefined,
      end: searchParams.get("end") ?? undefined,
    });

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid parameters", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const data = await fetchAvailability(parseResult.data);
    return NextResponse.json({ data, updatedAt: new Date().toISOString() }, { status: 200 });
  } catch (error) {
    console.error("Availability API error", error);
    return NextResponse.json(
      {
        error: "Failed to fetch availability",
      },
      { status: 500 }
    );
  }
}
