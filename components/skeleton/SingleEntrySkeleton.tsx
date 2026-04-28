import { cn } from "@/src/lib/utils";

export default function SingleEntrySkeleton({ index }: { index?: number }) {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row gap-8 pb-2 mb-2 mt-2 border-b border-outline-variant/30 animate-pulse",
        index === 0 && "md:border-b-0",
      )}
    >
      <div className="flex-1 py-2">
        {/* Top bar */}
        <div className="flex justify-between mb-4">
          <div className="h-2 w-24 bg-gray-200 rounded" />
          <div className="flex gap-4">
            <div className="h-6 w-16 bg-gray-200 rounded" />
            <div className="h-4 w-4 bg-gray-200 rounded" />
            <div className="h-4 w-4 bg-gray-200 rounded" />
          </div>
        </div>
        {/* Title */}
        <div className="h-7 w-3/4 bg-gray-300 rounded mb-4" />
        <div className="h-7 w-1/4 bg-gray-300 rounded mb-4" />
        {/* Text lines */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-100 rounded" />
          <div className="h-4 w-full bg-gray-100 rounded" />
          <div className="h-4 w-[90%] bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  );
}
