export default function EntriesCounterSkeleton() {
  return (
    <div className="mb-12 mt-10 flex gap-4">
      {/* The Bullet Point */}
      <span
        //   className="text-outline h-[14px] w-2 rounded bg-gray-600 animate-pulse font-label text-[10px]"
        className="text-outline mb-12 mt-10 font-extrabold text-xl uppercase tracking-[0.25em]"
      >
        •
      </span>

      {/* The Shimmering Bar */}
      <div
        className="h-7.5 w-108 mt-8 animate-pulse rounded bg-outline/10"
        aria-hidden="true"
      />

      {/* Optional "Entries" text if you want it static */}
      {/* <span className="text-outline font-label text-[10px] uppercase tracking-[0.25em]">
        Entries
      </span> */}
    </div>
  );
}
