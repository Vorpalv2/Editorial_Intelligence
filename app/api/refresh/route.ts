import { inngest } from "@/app/inngest/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { url, sortType, summaryMode, id, userId } = await req.json();

    // Trigger Inngest
    await inngest.send({
      name: "app/refresh.requested",
      data: { url, sortType, summaryMode, id, userId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to trigger" }, { status: 500 });
  }
}
