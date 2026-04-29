"use client";
import { ArticleMotion } from "@/helpers/Motion";
import RefactorURL from "@/helpers/RefactorURL";
import { cn } from "@/src/lib/utils";
import {
  TrashIcon,
  RefreshCcwIcon,
  CheckCheckIcon,
  CheckIcon,
} from "lucide-react";
import Link from "next/link";
// import React from "react";
import {
  SummaryDepthModeEnum,
  type SummarizedData,
} from "@/src/generated/prisma/client";
import { useAISummaryContext } from "@/context/aiSummaryType.context";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import SingleEntrySkeleton from "./skeleton/SingleEntrySkeleton";
// import { HandleDelete } from "@/actions/InfiniteList.action";

interface SingleEntryType {
  summary: SummarizedData;
  index: number;
  onDeleteProp: (id: number) => void;
  onRefreshProp: (
    id: number,
    source: string,
    summaryMode: SummaryDepthModeEnum,
  ) => void;
}

export default function SingleEntryInInfiniteList({
  summary,
  index,
  onDeleteProp,
  onRefreshProp,
}: SingleEntryType) {
  const { summary: summaryMode } = useAISummaryContext();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  const { data } = useSWR(
    isRefreshing ? `/api/check-status?id=${summary.id}` : null,
    { refreshInterval: 3000 },
  );

  const [entryDate, setEntryDate] = useState<string>("");

  useEffect(() => {
    // This only runs on the client, so the server never sees the formatted string
    setEntryDate(summary.createdAt.toLocaleDateString());
  }, [summary.createdAt]);

  useEffect(() => {
    if (data?.isDone) {
      setIsRefreshing(false);
      router.refresh();
    }
  }, [data]);

  if (isRefreshing) return <SingleEntrySkeleton />;

  return (
    <ArticleMotion
      key={summary.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        "group relative flex flex-col md:flex-row gap-8 pb-2 border-b border-outline-variant/30",
        index === 0 && "md:border-b-0", // First item is "featured" in layout
      )}
    >
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex w-full justify-between">
            <span className="text-primary font-label text-[10px] font-bold uppercase tracking-widest">
              {RefactorURL(summary.source)} • {entryDate}
            </span>

            <div className="flex gap-4 items-center">
              <span
                className={cn(
                  // Base styles
                  "px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-colors",
                  // Conditional styles
                )}
              >
                {!summary.unread && (
                  <CheckIcon size={18} strokeWidth={"6px"} color="green" />
                )}
              </span>
              <span
                className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest text-white ${summary.summaryDepthMode === "Balanced" ? "bg-blue-600" : summary.summaryDepthMode === "Concise" ? "bg-green-600" : summary.summaryDepthMode === "Comprehensive" && "bg-amber-600"}`}
              >
                {summary.summaryDepthMode}
              </span>

              <div className="cursor-pointer">
                <span onClick={() => onDeleteProp(summary.id)}>
                  <TrashIcon size={14} />
                </span>
              </div>
              <div className="cursor-pointer">
                <span
                  onClick={() =>
                    onRefreshProp(summary.id, summary.source, summaryMode)
                  }
                >
                  <RefreshCcwIcon size={14} />
                </span>
              </div>
            </div>
          </div>
        </div>
        <Link href={`/article/${summary.id}`}>
          <h3 className="font-headline font-bold text-2xl text-on-surface mb-4 leading-snug group-hover:text-primary transition-colors">
            {summary.title}
          </h3>
        </Link>
        <p className="text-outline text-[15px] leading-relaxed line-clamp-3 mb-6 font-body">
          {summary.summarizedText}
        </p>
        <div className="flex items-center gap-4">
          <span className="text-primary-dim text-[11px] font-label font-bold flex items-center gap-1.5">
            {/* <Clock size={14} /> {summary.readTime} */}
          </span>
          <span className="text-outline text-[11px] font-label">{}</span>
        </div>
      </div>
      {/* {summary.imageUrl && (
              <div className="md:w-40 flex-shrink-0">
                <div className="w-full aspect-[4/3] md:aspect-square rounded-lg overflow-hidden bg-surface-container-low border border-outline-variant/30">
                  <img
                    src={summary.imageUrl}
                    alt={summary.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            )} */}
    </ArticleMotion>
  );
}
