import { Skeleton } from '@/components/ui/skeleton';

export const ProjectsGridSkeleton = () => {
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-48" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          // Using a static index key for skeletons is acceptable since the list is static and never reordered
          <div
            key={i}
            className="rounded-xl border bg-card text-card-foreground shadow-sm h-32 relative overflow-hidden"
          >
            <Skeleton className="absolute inset-0" />
          </div>
        ))}
      </div>
    </div>
  );
};
