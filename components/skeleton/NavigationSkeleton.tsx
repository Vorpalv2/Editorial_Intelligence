export default function NavigationSkeleton({
  isLoadedProp,
}: {
  isLoadedProp: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      {!isLoadedProp && (
        /* --- SKELETON STATE --- */
        <div className="flex items-center gap-2 animate-pulse">
          {/* Label Skeleton */}
          <div className="hidden md:block h-4 w-36 bg-gray-200 dark:bg-gray-700 rounded-md" />
          {/* Badge Skeleton */}
          <div className="h-6 w-24 bg-gray-300 dark:bg-gray-600 rounded-md" />
          {/* Avatar Skeleton */}
          <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600" />
        </div>
      )}
    </div>
  );
}
