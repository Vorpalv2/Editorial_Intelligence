"use server";
import { type SummarizedData } from "@/src/generated/prisma/client";
import { prisma } from "@/src/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

type SummaryID = SummarizedData["id"];

export async function GetTotalSummaries() {
  const { userId } = await auth();
  if (!userId) return null;
  return await prisma.summarizedData.count({
    where: {
      userId: userId,
    },
  });
}

export async function GetSummaries({
  query,
  sort,
  take,
  skip,
}: {
  query: string;
  sort: string;
  take: number;
  skip?: number;
}) {
  const { userId } = await auth();

  if (!userId) {
    return { returnedSummaries: [], isAllTaken: true };
  }
  try {
    const summaries = await prisma.summarizedData.findMany({
      where: {
        // Logic for "Contains" search
        // This ensures the record MUST belong to the user AND match the search
        userId: userId,

        OR: [
          {
            title: {
              contains: query,
              mode: "insensitive", // Ignore case (PostgreSQL/MongoDB)
            },
          },
          {
            summarizedText: {
              // Assuming you have a content field
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
      orderBy: {
        // Map "newest" to "desc" and "oldest" to "asc"
        createdAt: sort === "newest" ? "desc" : "asc",
      },
      skip: skip,
      take: take + 1,
    });

    let hasNextPage = summaries.length > take;
    const entries = hasNextPage ? summaries.slice(0, take) : summaries;

    return {
      returnedSummaries: entries,
      isAllTaken: !hasNextPage,
    };
  } catch (error) {
    console.log("fetched summary");
  } finally {
    revalidatePath("/history");
  }
}

export async function HandleDelete(id: SummaryID) {
  try {
    const deleted = await prisma.summarizedData.delete({
      where: {
        id,
      },
    });

    return "Deleted Successfully";
  } catch (error) {
    console.log("error deleting summary", error);
  } finally {
    revalidatePath("/history");
  }
}
