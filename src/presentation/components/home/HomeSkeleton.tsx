
/**
 * HomeSkeleton
 * Loading placeholder for the Home View
 */
export function HomeSkeleton() {
  return (
    <div className="h-full flex flex-col p-3 sm:p-6 gap-3 sm:gap-5 overflow-y-auto" id="home-skeleton">
      {/* Skeleton Hero */}
      <div className="animate-pulse bg-surface/60 rounded-xl sm:rounded-2xl h-40 sm:h-56" />

      {/* Skeleton Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="animate-pulse bg-surface/60 rounded-xl h-20 sm:h-24" />
        ))}
      </div>

      {/* Skeleton List */}
      <div className="flex-1 min-h-0 bg-surface/40 rounded-xl sm:rounded-2xl border border-white/5 flex flex-col p-4 gap-4">
        <div className="h-6 bg-surface/60 animate-pulse rounded w-1/3 mb-2" />
        <div className="space-y-3 overflow-y-auto">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-14 sm:h-16 bg-surface/60 animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
