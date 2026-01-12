import { Skeleton } from '@/components/ui/skeleton';

export const HeaderSkeleton = () => (
  <div className="space-y-2">
    <Skeleton className="h-6 w-60" />

    <Skeleton className="h-6 w-100" />
  </div>
);
