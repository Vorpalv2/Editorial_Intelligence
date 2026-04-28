"use server";

import { SummarizedData } from "@/src/generated/prisma/client";
import { prisma } from "@/src/prisma";
import { revalidatePath } from "next/cache";

export async function UpdateUnread(summaryID: number) {
  await prisma.summarizedData.update({
    where: { id: summaryID },
    data: { unread: false },
  });

  revalidatePath("/");
  console.log("update action");

  return { success: true, message: "post read updated" };
}
