"use server";
import { prisma } from "@/src/prisma";
import { revalidatePath } from "next/cache";

export async function GetLatestPost(userID: string) {
  const lastAddedEntry = await prisma.summarizedData.findFirst({
    where: {
      userId: userID,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return lastAddedEntry;
}

export async function GetLast10Summary() {
  const last10Summary = await prisma.summarizedData.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  return last10Summary;
}

export async function findByID(id: number) {
  return await prisma.summarizedData.findFirst({
    where: {
      id,
    },
  });
}
