"use server";
import { prisma } from "@/src/prisma";
import InfiniteList from "./InfiniteList";
import { auth } from "@clerk/nextjs/server"; // Import auth

export default async function HistoryServerComponent({
  query,
  sort,
}: {
  query: string;
  sort: string;
}) {
  // 1. Get the current user's Clerk ID
  const { userId } = await auth();

  // 2. Security check: If no user is logged in, return nothing or handle accordingly
  if (!userId) {
    return (
      <div className="text-center p-10 text-outline">
        Please sign in to view your history.
      </div>
    );
  }

  const summaries = await prisma.summarizedData.findMany({
    where: {
      // 3. Filter by this specific user
      userId: userId,

      // 4. Combine with your existing search logic
      OR: [
        {
          title: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          summarizedText: {
            contains: query,
            mode: "insensitive",
          },
        },
      ],
    },
    orderBy: {
      createdAt: sort === "newest" ? "desc" : "asc",
    },
    take: 5,
  });

  return (
    <InfiniteList
      key={`${sort}-${query}`}
      filter={sort}
      query={query}
      summaries={summaries}
    />
  );
}

// "use server";
// import { prisma } from "@/src/prisma";
// import InfiniteList from "./InfiniteList";

// export default async function HistoryServerComponent({
//   query,
//   sort,
// }: {
//   query: string;
//   sort: string;
// }) {
//   const summaries = await prisma.summarizedData.findMany({
//     where: {
//       // Logic for "Contains" search
//       OR: [
//         {
//           title: {
//             contains: query,
//             mode: "insensitive", // Ignore case (PostgreSQL/MongoDB)
//           },
//         },
//         {
//           summarizedText: {
//             // Assuming you have a content field
//             contains: query,
//             mode: "insensitive",
//           },
//         },
//       ],
//     },
//     orderBy: {
//       // Map "newest" to "desc" and "oldest" to "asc"
//       createdAt: sort === "newest" ? "desc" : "asc",
//     },
//     take: 5,
//   });

//   return (
//     <InfiniteList
//       key={`${sort}-${query}`}
//       filter={sort}
//       query={query}
//       summaries={summaries}
//     />
//   );
// }
