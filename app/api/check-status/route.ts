import { prisma } from "@/src/prisma";
import { NextResponse } from "next/server";

// app/api/check-status/route.ts

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const url = searchParams.get("url");
  const sentAt = searchParams.get("sentAt");

  let summary;

  if (id) {
    // Standard findUnique because the ID never changes now
    summary = await prisma.summarizedData.findUnique({
      where: { id: Number(id) },
    });
  } else if (url) {
    const cleanUrl = url.split("?")[0].replace(/\/$/, "");
    summary = await prisma.summarizedData.findFirst({
      where: { source: { contains: cleanUrl } },
      orderBy: { updatedAt: "desc" },
    });
  }

  if (!summary) return NextResponse.json({ isDone: false });

  // If no sentAt is provided, we default to false to be safe,
  // or true if you just want to check existence.
  if (!sentAt) return NextResponse.json({ isDone: !!summary });

  const threshold = new Date(sentAt).getTime();
  const lastUpdate = new Date(summary.updatedAt).getTime();

  // done if the DB was touched AFTER the user clicked refresh
  const isDone = lastUpdate > threshold - 1000;

  return NextResponse.json({
    isDone,
    title: summary?.title || "",
  });
}

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const url = searchParams.get("url");
//   const id = searchParams.get("id");

//   let summary;

//   if (url) {
//     const cleanUrl = url.split("?")[0].replace(/\/$/, "");
//     summary = await prisma.summarizedData.findFirst({
//       where: { source: { contains: cleanUrl } },
//       orderBy: { createdAt: "desc" },
//     });
//   } else if (id) {
//     // If we are polling by ID, we are looking for the NEW version of this record.
//     // BUT: In your delete/recreate flow, the ID 121 is DELETED.
//     // Solution: Look for a record that has the same SOURCE as the (now deleted) ID 121.
//     // This is why polling by URL is much safer!
//         summary = await prisma.summarizedData.findFirst({
//           where:{id:Number(id)}
//         })
//   }

//   // Check if record exists and is "Fresh" (created in last 2 mins)
//   const isDone =
//     !!summary && Date.now() - new Date(summary.createdAt).getTime() < 120000;

//   return NextResponse.json({
//     isDone,
//     title: summary?.title || "",
//   });
// }
