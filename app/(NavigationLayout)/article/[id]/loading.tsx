import React from "react";

export default function Loading() {
  return (
    <div className="px-6 max-w-2xl mx-auto space-y-12 animate-pulse">
      {/* Hero & Title Skeleton */}
      <section className="space-y-6">
        {/* Aspect Ratio Box for Image */}
        <div className="rounded-xl aspect-[16/9] bg-gray-200 dark:bg-zinc-800" />

        <div className="space-y-4">
          {/* Metadata line (Source, Date, Read Time) */}
          <div className="flex items-center gap-3">
            <div className="h-3 w-20 bg-gray-200 dark:bg-zinc-800 rounded" />
            <div className="w-1 h-1 bg-gray-300 dark:bg-zinc-700 rounded-full" />
            <div className="h-3 w-24 bg-gray-200 dark:bg-zinc-800 rounded" />
          </div>

          {/* Title Lines */}
          <div className="space-y-2">
            <div className="h-9 w-full bg-gray-200 dark:bg-zinc-800 rounded-md" />
            <div className="h-9 w-3/4 bg-gray-200 dark:bg-zinc-800 rounded-md" />
          </div>
        </div>
      </section>

      <div className="h-px w-full bg-gray-100 dark:bg-zinc-800" />

      {/* Summary Section Skeleton */}
      <section className="space-y-8">
        <div className="h-6 w-40 bg-gray-200 dark:bg-zinc-800 rounded" />

        <div className="space-y-4">
          <div className="h-4 w-full bg-gray-100 dark:bg-zinc-800/50 rounded" />
          <div className="h-4 w-full bg-gray-100 dark:bg-zinc-800/50 rounded" />
          <div className="h-4 w-5/6 bg-gray-100 dark:bg-zinc-800/50 rounded" />
        </div>

        {/* Takeaway Block */}
        <div className="border-l-2 border-gray-200 dark:border-zinc-800 pl-6 py-2">
          <div className="h-4 w-full bg-gray-100 dark:bg-zinc-800/50 rounded italic" />
        </div>

        {/* Takeaways Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-gray-200 dark:bg-zinc-800 rounded" />
                <div className="h-4 w-24 bg-gray-200 dark:bg-zinc-800 rounded" />
              </div>
              <div className="h-3 w-full bg-gray-100 dark:bg-zinc-800/50 rounded" />
              <div className="h-3 w-full bg-gray-100 dark:bg-zinc-800/50 rounded" />
            </div>
          ))}
        </div>
      </section>

      <div className="h-px w-full bg-gray-100 dark:bg-zinc-800" />

      {/* Analysis Points Skeleton */}
      <section className="space-y-6">
        <div className="h-6 w-32 bg-gray-200 dark:bg-zinc-800 rounded" />
        <ul className="space-y-6">
          {[1, 2].map((i) => (
            <li key={i} className="flex gap-4">
              <div className="mt-2 h-2 w-2 rounded-full bg-gray-300 dark:bg-zinc-700 flex-shrink-0" />
              <div className="space-y-2 w-full">
                <div className="h-4 w-32 bg-gray-200 dark:bg-zinc-800 rounded" />
                <div className="h-3 w-full bg-gray-100 dark:bg-zinc-800/50 rounded" />
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Button Skeleton */}
      <div className="pt-8 pb-12">
        <div className="w-full h-14 bg-gray-200 dark:bg-zinc-800 rounded-lg" />
      </div>
    </div>
  );
}
