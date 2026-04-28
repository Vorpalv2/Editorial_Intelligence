"use server";

import { Suspense } from "react";
import EntriesCounterSkeleton from "./skeleton/EntriesSkeleton";
import EntriesCounter from "./EntriesCounter";
import { GetTotalSummaries } from "@/actions/InfiniteList.action";

export default async function EntriesCounterServerComponent() {
  const totalEntries = await GetTotalSummaries();
  if (totalEntries) return <EntriesCounter totalEntriesCount={totalEntries} />;
}
