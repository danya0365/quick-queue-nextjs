
/**
 * AdminSkeleton
 * Loading placeholder for the Admin View
 */
export function AdminSkeleton() {
  return (
    <div className="h-full flex flex-col p-3 sm:p-6 gap-3 sm:gap-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-2">
        <div className="animate-pulse bg-surface/60 rounded h-8 w-1/3" />
        <div className="animate-pulse bg-surface/60 rounded-lg h-9 w-24" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse bg-surface/60 rounded-xl h-20 sm:h-24" />
        ))}
      </div>

      <div className="flex gap-2 justify-between max-w-2xl mt-2 w-full">
         {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex-1 animate-pulse bg-surface/60 h-10 rounded-full" />
         ))}
      </div>

      <div className="flex-1 mt-2 space-y-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="animate-pulse bg-surface/40 h-16 sm:h-20 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
