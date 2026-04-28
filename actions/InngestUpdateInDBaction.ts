// actions/InngestUpdateInDBaction.ts
"use server";
import { prisma } from "@/src/prisma";

export async function InngestUpdateSummaryInDB({
  id,
  data,
}: {
  id: number;
  data: any;
}) {
  try {
    console.log("running update summary action");
    return await prisma.summarizedData.update({
      where: { id: id },
      data: {
        title: data.title,
        summarizedText: data.summarizedText,
        commentAnalysis: data.commentAnalysis,
        topComments: data.topComments,
        takeAways: data.takeAways,
        summaryDepthMode: data.summaryDepthMode,
        // Update the timestamp so your "Watcher" knows it's done!
        updatedAt: new Date(),
        unread: true,
      },
    });
  } catch (error) {
    console.error("Prisma Update Error:", error);
    throw error;
  }
}
