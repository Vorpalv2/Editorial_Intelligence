"use client";
import { useCountContext } from "@/context/summaryCount.context";
import { Counter, HeaderMotion } from "@/helpers/Motion";
import PageRefresher from "./PageRefresher";

export default function EntriesCounter({
  totalEntriesCount,
}: {
  totalEntriesCount: number;
}) {
  const { currentPageEntries } = useCountContext();

  return (
    <HeaderMotion className="text-outline mb-24 font-extrabold text-xl uppercase tracking-[0.25em] sticky top-65 z-50">
      •(
      <Counter value={currentPageEntries} />
      /
      <Counter value={totalEntriesCount} />) Entries
      {/* <div className="">
        <PageRefresher />
      </div> */}
    </HeaderMotion>
  );
}
