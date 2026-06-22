import Skeleton from "../Skeleton";
import PropertyCardSkeleton from "./PropertyCardSkeleton";

// Full-page skeleton that matches the real page layout exactly:
//   • Toolbar row  (view-mode segmented control + favorites button)
//   • Search bar   (h-14 rounded-full)
//   • 6 property card skeletons
// Renders inside the same container the real page uses so there is zero layout shift.
export default function PageSkeleton() {
  return (
    <div className="relative mx-auto mt-4 max-w-7xl px-3 pb-8 sm:mt-8 sm:px-6 lg:px-8">

      {/* Toolbar row */}
      <div className="mb-3 flex items-center justify-between gap-3">
        {/* Segmented control pill */}
        <Skeleton className="h-9 w-36 rounded-full" />
        {/* Favorites filter button */}
        <Skeleton className="h-9 w-28 rounded-full" />
      </div>

      {/* Search bar */}
      <Skeleton className="h-14 w-full rounded-full sm:h-16" />

      {/* "Search Across" label row */}
      <div className="mb-4 mt-5 flex items-center justify-between gap-4">
        <Skeleton className="h-3 w-28 rounded-md" />
        <Skeleton className="h-3 w-20 rounded-md" />
      </div>

      {/* Property card list */}
      <div className="flex flex-col gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <PropertyCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
