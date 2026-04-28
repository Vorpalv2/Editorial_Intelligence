"use server";
import {
  Prisma,
  SummaryDepthModeEnum,
  type SummarizedData,
} from "@/src/generated/prisma/client";
import { prisma } from "@/src/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

interface SummarySavePayload {
  title: string;
  summarizedText: string;
  source: string;
  summaryDepthMode: SummaryDepthModeEnum;
  commentAnalysis: string[];
  topComments: string[];
  takeAways: string[];
  userId: string; // The flat string from Inngest
}

export default async function InngestSaveToDB(summary: SummarySavePayload) {
  const newEntry = await prisma.summarizedData.create({
    data: {
      title: summary.title,
      summarizedText: summary.summarizedText,
      source: summary.source,
      summaryDepthMode: summary.summaryDepthMode,
      commentAnalysis: summary.commentAnalysis,
      topComments: summary.topComments,
      takeAways: summary.takeAways,
      user: {
        connect: { clerkId: summary.userId },
      },
    },
  });

  revalidatePath("/");
  // revalidatePath("/history");
  return { success: "true", data: newEntry };
}
