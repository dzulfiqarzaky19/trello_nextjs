import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export const DashboardStatsSkeleton = () => (
  <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
    {[...Array(4)].map((_, i) => (
      <Card key={i} className="border-none shadow-sm h-[140px]">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <Skeleton className="h-12 w-12 rounded-xl" />
          </div>
          <div className="mt-4 space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-10" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);
