import { inngest } from "@/app/inngest/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { url, sortType, summaryMode, userId } = await req.json();

    // Trigger Inngest
    await inngest.send({
      name: "reddit/summarize.requested",
      data: { url, sortType, summaryMode, userId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to trigger" }, { status: 500 });
  }
}
