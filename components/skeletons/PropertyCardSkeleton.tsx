import Skeleton from "../Skeleton";

// Mirrors the collapsed (list-mode) PropertyCard: rounded-2xl card, px-4 py-3.5 header,
// badge row + location/control row — same padding, gap, and height as the real element.
export default function PropertyCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#22354F] bg-[#132238]">
      <div className="px-4 py-3.5 sm:px-5">
        {/* Row 1 — type badge pills */}
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-5 w-14 rounded-md" />
          <Skeleton className="h-5 w-16 rounded-md" />
        </div>

        {/* Row 2 — location text (left) + heart / ID / chevron (right) */}
        <div className="mt-2.5 flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-1.5">
            <Skeleton className="h-[14px] w-3/5 rounded-md" />
            <Skeleton className="h-3 w-2/5 rounded-md" />
          </div>

          <div className="flex shrink-0 items-center gap-1">
            {/* heart */}
            <Skeleton className="h-7 w-7 rounded-full" />
            {/* ID badge */}
            <Skeleton className="h-[22px] w-12 rounded-md" />
            {/* chevron */}
            <Skeleton className="h-7 w-7 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
