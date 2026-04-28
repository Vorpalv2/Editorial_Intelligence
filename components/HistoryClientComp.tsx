"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { Search, Clock, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { MOCK_SUMMARIES } from "@/src/types";
import { cn } from "@/src/lib/utils";
import { ArticleMotion, HeaderMotion } from "@/helpers/Motion";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import EntriesCounter from "./EntriesCounter";
import EntriesCounterSkeleton from "./skeleton/EntriesSkeleton";
import InfiniteListSkeleton from "./skeleton/InfiniteListSkeleton";
import {
  CountContextProvider,
  useCountContext,
} from "@/context/summaryCount.context";
import { useInView } from "react-intersection-observer";
import EntriesCounterServerComponent from "./EntriesCounterServerComp";
// import { useRouter } from "next/router";

export default function HistoryClientComponentWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CountContextProvider>
      <HistoryClientComponent>{children}</HistoryClientComponent>
    </CountContextProvider>
  );
}

function HistoryClientComponent({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const { replace } = useRouter();
  const currentFilterParam = searchParams.get("filter");
  function handleFilter(filter: "newest" | "oldest") {
    const params = new URLSearchParams(searchParams);
    if (filter == "newest") {
      params.set("filter", filter);
    } else if (filter == "oldest") {
      params.set("filter", filter);
    } else {
      params.delete("filter");
    }
    replace(`${pathName}?${params.toString()}`);
  }

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);

    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }

    replace(`${pathName}?${params.toString()}`);
  }
  return (
    <>
      {/* <div className="px-6 max-w-4xl mx-auto"> */}
      {/* Search Bar */}
      <HeaderMotion className="sticky top-32 z-50">
        {/* <div className=" sticky top-32 z-50"> */}
        <div className="">
          <div className="w-full relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors"
              size={20}
            />
            <input
              type="text"
              onChange={(e) => handleSearch(e.target.value)}
              // onChange={(e) => setSearch(e.target.value)}
              defaultValue={searchParams.get("query")?.toString()}
              placeholder="Search your archive..."
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl py-4 pl-12 pr-4 focus:ring-1 focus:ring-primary focus:border-primary focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline font-medium text-sm"
            />
          </div>
        </div>

        {/* Header */}
        <section className=" p-0.5 flex items-end justify-between">
          <div className="flex flex-col">
            <h2 className="font-headline font-bold text-3xl tracking-tight text-on-surface ">
              History
            </h2>
            <div className="h-1 w-12 bg-primary rounded-full mb-1" />
          </div>
          <div className="flex items-center bg-surface-container-low p-1 rounded-lg border border-outline-variant/30 m-1.5">
            <button
              onClick={() => handleFilter("newest")}
              className={cn(
                "px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all",
                currentFilterParam === "newest" || currentFilterParam === null
                  ? "bg-surface-container-lowest text-primary shadow-sm"
                  : "text-outline hover:text-on-surface",
              )}
            >
              Newest
            </button>
            <button
              onClick={() => handleFilter("oldest")}
              className={cn(
                "px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all",
                currentFilterParam === "oldest"
                  ? "bg-surface-container-lowest text-primary shadow-sm"
                  : "text-outline hover:text-on-surface",
              )}
            >
              Oldest
            </button>
          </div>
        </section>
        {/* </div> */}
      </HeaderMotion>
      <Suspense
        fallback={
          <>
            <EntriesCounterSkeleton />
            <InfiniteListSkeleton />
          </>
        }
      >
        {children}
      </Suspense>
      {/* Load More */}
      {/* <div className="mt-20 mb-12 flex justify-center">
        <button className="bg-primary text-on-primary px-10 py-3.5 rounded-lg font-label text-[11px] font-bold tracking-[0.15em] uppercase hover:bg-primary-dim transition-all active:scale-95 shadow-lg shadow-primary/10">
          Archive Retrieval (Next 10)
        </button>
      </div> */}

      {/* </div> */}
    </>
  );
}
