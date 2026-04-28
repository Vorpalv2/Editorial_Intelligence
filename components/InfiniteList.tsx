"use client";

import { type SummarizedData } from "../src/generated/prisma/client";

import React, { useEffect, useState } from "react";

import { GetSummaries, HandleDelete } from "@/actions/InfiniteList.action";
import { toast } from "react-toastify";
import { useInView } from "react-intersection-observer";
import InfiniteListSkeleton from "./skeleton/InfiniteListSkeleton";
import { useCountContext } from "@/context/summaryCount.context";
import SingleEntryInInfiniteList from "./SingleEntryInInfiniteList";
import SingleEntrySkeleton from "./skeleton/SingleEntrySkeleton";
import { RefreshSummary } from "@/app/inngest/SecondWorkflow";
import { RefreshSummarizeAction } from "@/app/inngest/triggerInngest.action";
import { useAISummaryContext } from "@/context/aiSummaryType.context";
import { type SummaryDepthModeEnum } from "@/src/generated/prisma/client";
import { useRefreshContext } from "@/context/refreshingURL.context";
import { useSummaryContext } from "@/context/url.context";
import { useUser } from "@clerk/nextjs";

export default function InfiniteList({
  summaries,
  query,
  filter,
}: {
  summaries: SummarizedData[];
  query: string;
  filter: string;
}) {
  const [AllSummaries, setAllSummaries] = useState<SummarizedData[]>(summaries);
  const [loading, setLoading] = useState(false);
  // const [refreshingIDs, setRefreshingIDs] = useState<number[]>([]);
  const [isLastPage, setIsLastPage] = useState(false);
  const { summary } = useAISummaryContext();
  const { setPendingUrl } = useSummaryContext();
  const { refreshingID, setRefreshingID } = useRefreshContext();
  const { user } = useUser();
  const {
    totalEntries,
    currentPageEntries,
    setCurrentPageEntries,
    setTotalEntries,
  } = useCountContext();
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "250px",
  });

  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  async function onRefreshButtonClick(
    id: number,
    source: string,
    mode: SummaryDepthModeEnum,
  ) {
    setRefreshingID((prev) => [...prev, id]);

    setPendingUrl(source);

    try {
      // 1. Trigger the background job
      // This action returns { success: true }, NOT the summary data
      if (user) {
        await RefreshSummarizeAction({
          id,
          url: source,
          sortType: "top",
          summaryMode: mode,
          userId: user?.id,
        });
      }

      toast.info("Updating summary in the background...");

      // NOTE: Do NOT call setAllSummaries here with the 'result'.
      // The background job will update the Database.
      // Your "Watcher" or a page refresh will get the new data.
    } catch (error) {
      toast.error("Failed to start refresh");
      // Remove skeleton if it fails to start
      setRefreshingID((prev) => prev.filter((rid) => rid !== id));
      setPendingUrl(null);
    }
  }

  async function onDeleteButtonClick(id: number) {
    const deleting = await HandleDelete(id);
    const filteredSummaries = AllSummaries.filter(
      (summaries) => summaries.id != id,
    );
    if (deleting != undefined) {
      setAllSummaries(filteredSummaries);
      setCurrentPageEntries(filteredSummaries.length);
      toast("Deleted successfully");
    }
  }

  useEffect(() => {
    setCurrentPageEntries(AllSummaries.length);
  }, [AllSummaries.length, setCurrentPageEntries]);

  useEffect(() => {
    async function RunSummaryAction() {
      if (loading) return;
      if (inView) {
        setLoading(true);
        const newLoadedSummaries = await GetSummaries({
          query: query,
          sort: filter,
          skip: AllSummaries?.length,
          take: 5,
        });

        if (newLoadedSummaries != undefined) {
          const { isAllTaken, returnedSummaries } = newLoadedSummaries;
          setIsLastPage(isAllTaken ? true : false);
          setAllSummaries((prevSummaries) => {
            return [...prevSummaries, ...returnedSummaries];
          });
          setCurrentPageEntries(AllSummaries.length + returnedSummaries.length);
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
    if (!isLastPage) {
      RunSummaryAction();
    }
  }, [inView, query, filter]);

  // return (
  //   <>
  //     <div className="space-y-3">

  //       {AllSummaries.map((summary, index) => (
  //         // <ArticleMotion
  //         //   key={summary.id}
  //         //   initial={{ opacity: 0, x: -20 }}
  //         //   animate={{ opacity: 1, x: 0 }}
  //         //   transition={{ delay: index * 0.1 }}
  //         //   className={cn(
  //         //     "group relative flex flex-col md:flex-row gap-8 pb-2 border-b border-outline-variant/30",
  //         //     index === 0 && "md:border-b-0", // First item is "featured" in layout
  //         //   )}
  //         // >
  //         //   <div className="flex-1">
  //         //     <div className="flex items-center gap-3 mb-4">
  //         //       <div className="flex w-full justify-between">
  //         //         <span className="text-primary font-label text-[10px] font-bold uppercase tracking-widest">
  //         //           {RefactorURL(summary.source)} • {}
  //         //         </span>
  //         //         <div className="flex gap-4 items-center">
  //         //           <span
  //         //             className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest text-white ${summary.summaryDepthMode === "Balanced" ? "bg-blue-600" : summary.summaryDepthMode === "Concise" ? "bg-green-600" : summary.summaryDepthMode === "Comprehensive" && "bg-amber-600"}`}
  //         //           >
  //         //             {summary.summaryDepthMode}
  //         //           </span>
  //         //           <div className="cursor-pointer">
  //         //             <span onClick={() => onDeleteButtonClick(summary.id)}>
  //         //               <TrashIcon size={14} />
  //         //             </span>
  //         //           </div>
  //         //           <div className="cursor-pointer">
  //         //             <span onClick={() => console.log("count")}></span>
  //         //             <RefreshCcwIcon size={14} />
  //         //           </div>
  //         //         </div>
  //         //       </div>
  //         //     </div>
  //         //     <Link href={`/article/${summary.id}`}>
  //         //       <h3 className="font-headline font-bold text-2xl text-on-surface mb-4 leading-snug group-hover:text-primary transition-colors">
  //         //         {summary.title}
  //         //       </h3>
  //         //     </Link>
  //         //     <p className="text-outline text-[15px] leading-relaxed line-clamp-3 mb-6 font-body">
  //         //       {summary.summarizedText}
  //         //     </p>
  //         //     <div className="flex items-center gap-4">
  //         //       <span className="text-primary-dim text-[11px] font-label font-bold flex items-center gap-1.5">
  //         //         {/* <Clock size={14} /> {summary.readTime} */}
  //         //       </span>
  //         //       <span className="text-outline text-[11px] font-label">{}</span>
  //         //     </div>
  //         //   </div>
  //         //   {/* {summary.imageUrl && (
  //         //     <div className="md:w-40 flex-shrink-0">
  //         //       <div className="w-full aspect-[4/3] md:aspect-square rounded-lg overflow-hidden bg-surface-container-low border border-outline-variant/30">
  //         //         <img
  //         //           src={summary.imageUrl}
  //         //           alt={summary.title}
  //         //           className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
  //         //           referrerPolicy="no-referrer"
  //         //         />
  //         //       </div>
  //         //     </div>
  //         //   )} */}
  //         // </ArticleMotion>
  //         <SingleEntryInInfiniteList
  //           key={summary.id}
  //           summary={summary}
  //           index={index}
  //           onDeleteProp={onDeleteButtonClick}
  //           onRefreshProp={onRefreshButtonClick}
  //         />
  //       ))}
  //       <div style={{ height: "20px" }}>
  //         {loading && <InfiniteListSkeleton />}
  //         {isLastPage && (
  //           <p className="text-black text-xs italic">
  //             You've reached the end of your archive.
  //           </p>
  //         )}
  //       </div>
  //       {!isLastPage && <div ref={ref} className="h-10 w-full" />}
  //     </div>
  //   </>
  // );

  // if (AllSummaries.length === 0) return <div>Database is Empty</div>;
  return (
    <div className="space-y-3">
      {AllSummaries.map((summary, index) => {
        // CHECK INDIVIDUAL REFRESH STATE HERE
        const isRefreshing = refreshingID.includes(summary.id);

        if (isRefreshing) {
          return (
            <SingleEntrySkeleton key={`loading-${summary.id}`} index={index} />
          );
        }

        return (
          <SingleEntryInInfiniteList
            key={summary.id}
            summary={summary}
            index={index}
            onDeleteProp={onDeleteButtonClick}
            onRefreshProp={onRefreshButtonClick}
          />
        );
      })}

      <div style={{ minHeight: "20px" }}>
        {loading && <InfiniteListSkeleton />}
        {isLastPage && (
          <p className="text-black text-xs italic">
            You've reached the end of your archive.
          </p>
        )}
      </div>
      {!isLastPage && <div ref={ref} className="h-10 w-full" />}
    </div>
  );
}
