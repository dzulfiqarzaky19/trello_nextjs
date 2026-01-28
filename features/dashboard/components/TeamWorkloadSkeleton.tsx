import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const TeamWorkloadSkeleton = () => (
  <Card className="border-none shadow-sm h-full">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <Skeleton className="h-6 w-32" />
    </CardHeader>
    <CardContent className="space-y-6">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="w-16 h-4" />
          <div className="flex-1">
            <Skeleton className="h-3 w-full rounded-full" />
          </div>
          <Skeleton className="w-8 h-4" />
        </div>
      ))}
    </CardContent>
  </Card>
);
