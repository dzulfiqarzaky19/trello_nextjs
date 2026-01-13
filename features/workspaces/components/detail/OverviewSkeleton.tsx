import { Skeleton } from '@/components/ui/skeleton';

export const OverviewSkeleton = () => (
  <div className="flex flex-col gap-y-6">
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col gap-y-4">
        <div>
          <Skeleton className="h-7 w-40" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-48" />
          </div>

          <div className="flex flex-col gap-y-2">
            <Skeleton className="h-4 w-24" />
            <div className="flex items-center gap-x-2">
              <Skeleton className="h-7 w-32" />
              <Skeleton className="h-6 w-6" />
            </div>
          </div>

          <div className="flex flex-col gap-y-2">
            <Skeleton className="h-4 w-24" />
            <div className="flex items-center gap-x-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-5 w-32" />
            </div>
          </div>

          <div className="flex flex-col gap-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-32" />
          </div>
        </div>

        <div className="border-b border-gray-200 dark:border-gray-700 my-4" />

        <div className="flex flex-col gap-y-2 mt-2">
          <Skeleton className="h-4 w-24" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6 w-full">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex items-start gap-4"
        >
          <Skeleton className="h-12 w-12 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      ))}
    </div>
  </div>
);
