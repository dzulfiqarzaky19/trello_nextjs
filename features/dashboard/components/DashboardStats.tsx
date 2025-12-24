import { Card, CardContent } from '@/components/ui/card';
import { DashboardStatsType } from '@/lib/const/DashboardPage';
import { cn } from '@/lib/utils';

export const DashboardStats = ({ stat }: { stat: DashboardStatsType }) => {
  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="pb-6">
        <div className="flex items-start justify-between">
          <div className={cn('p-3 rounded-xl', stat.color)}>
            <stat.icon className="w-6 h-6" />
          </div>
          {stat?.isAlert ? (
            <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">
              ! {stat.trend.replace('! ', '')}
            </span>
          ) : (
            <span
              className={cn(
                'text-xs font-bold px-2 py-1 rounded-full',
                stat.trendUp
                  ? 'bg-green-100 text-green-600'
                  : 'bg-gray-100 text-gray-600'
              )}
            >
              {stat.trend}
            </span>
          )}
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium text-muted-foreground">
            {stat.label}
          </p>
          <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
        </div>
      </CardContent>
    </Card>
  );
};
