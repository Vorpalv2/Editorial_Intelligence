"use server";

import { inngest } from "@/app/inngest/client";

export async function SummarizeRedditAction({
  url,
  sortType,
  summaryMode,
  userId,
}: {
  url: string;
  sortType: string;
  summaryMode: "Concise" | "Comprehensive" | "Balanced";
  userId: string;
}) {
  // 1. Tell Inngest to start the background job
  await inngest.send({
    name: "reddit/summarize.requested",
    data: { url, sortType, summaryMode, userId },
  });

  // 2. Return immediately so the UI isn't "stuck"
  return { success: true, message: "Started background process" };
}

export async function RefreshSummarizeAction({
  url,
  sortType,
  summaryMode,
  id,
  userId,
}: {
  url: string;
  sortType: string;
  summaryMode: "Concise" | "Comprehensive" | "Balanced";
  id: number;
  userId: string;
}) {
  await inngest.send({
    name: "reddit/refresh.requested",
    data: { url, sortType, summaryMode, id, userId },
  });

  // return { success: true, message: "Started Refreshing" };
}
