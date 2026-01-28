import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const TaskDistributionChartSkeleton = () => (
  <Card className="border-none shadow-sm h-full">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <Skeleton className="h-6 w-32" />
    </CardHeader>
    <CardContent className="flex flex-col items-center">
      <Skeleton className="h-[250px] w-full rounded-full" />
      <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-4 w-full px-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="w-3 h-3 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);
