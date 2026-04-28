import EntriesCounterServerComponent from "@/components/EntriesCounterServerComp";
import HistoryClientComponentWrapper from "@/components/HistoryClientComp";
import HistoryServerComponent from "@/components/HistoryServerComp";
import { prisma } from "@/src/prisma";

export default async function History({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string; filter?: "newest" | "oldest" }>;
}) {
  const params = await searchParams;
  const query = params?.query || "";
  const sort = params?.filter || "newest";

  // const totalEntries = await prisma.summarizedData.count();
  return (
    <div className="px-6 max-w-4xl mx-auto">
      <HistoryClientComponentWrapper>
        <EntriesCounterServerComponent />
        <HistoryServerComponent
          key={`${query}-${sort}`}
          query={query}
          sort={sort}
        />
      </HistoryClientComponentWrapper>
    </div>
  );
}
