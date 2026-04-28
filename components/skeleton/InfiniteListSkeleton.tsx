import { cn } from "@/src/lib/utils";

function ArticleSkeleton({ index }: { index: number }) {
  return (
    <div
      className={cn(
        "group relative flex flex-col md:flex-row gap-8 border-b border-outline-variant/30 animate-pulse",
        index === 0 && "md:border-b-0",
      )}
    >
      <div className="flex-1">
        {/* Source Meta Tag */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-3 w-24 bg-primary/20 rounded" />
        </div>

        {/* Title Lines */}
        <div className="space-y-2 mb-4">
          <div className="h-6 w-[90%] bg-on-surface/10 rounded" />
          <div className="h-6 w-[40%] bg-on-surface/10 rounded" />
        </div>

        {/* Summary Paragraph */}
        <div className="space-y-2 mb-6">
          <div className="h-3 w-full bg-outline/10 rounded" />
          <div className="h-3 w-full bg-outline/10 rounded" />
          <div className="h-3 w-[80%] bg-outline/10 rounded" />
        </div>

        {/* Footer Meta */}
        <div className="flex items-center gap-4">
          <div className="h-3 w-16 bg-primary-dim/20 rounded" />
        </div>
      </div>

      {/* Image Placeholder (matching your commented out logic) */}
      {/* <div className="md:w-40 flex-shrink-0">
        <div className="w-full aspect-[4/3] md:aspect-square rounded-lg bg-surface-container-low border border-outline-variant/30" />
      </div> */}
    </div>
  );
}

export default function InfiniteListSkeleton() {
  return (
    <div className="">
      {[...Array(10)].map((_, i) => (
        <ArticleSkeleton key={i} index={i} />
      ))}
    </div>
  );
}
