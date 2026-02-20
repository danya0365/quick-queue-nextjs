
/**
 * QueueSkeleton
 * Loading placeholder for the Queue View
 */
export function QueueSkeleton() {
  return (
    <div className="h-full flex flex-col p-3 sm:p-6 gap-4 sm:gap-6 overflow-y-auto">
      {/* Skeleton Hero */}
      <div className="animate-pulse bg-surface/60 rounded-xl sm:rounded-2xl h-36" />
      
      {/* Skeleton Tabs */}
      <div className="flex gap-2 justify-between max-w-2xl mx-auto w-full">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex-1 animate-pulse bg-surface/60 h-10 rounded-full" />
        ))}
      </div>

      {/* Skeleton Box Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse bg-surface/40 h-28 sm:h-32 rounded-2xl border border-white/5" />
        ))}
      </div>
    </div>
  );
}
