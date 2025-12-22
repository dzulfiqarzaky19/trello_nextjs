import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DASHBOARD_STATS } from '@/lib/const/DashboardPage';
import { cn } from '@/lib/utils';
import { MoreHorizontal } from 'lucide-react';
import { DonutPieChart } from './components/DonutPieChart';
import { RecentActivity } from './components/RecentActivity';
import { TeamWorkload } from './components/TeamWorkload';

export const DashboardMain = () => {
  return (
    <main className="space-y-8 p-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
        {DASHBOARD_STATS.map((stat, index) => (
          <Card
            key={index}
            className="border-none shadow-sm hover:shadow-md transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className={cn('p-3 rounded-xl', stat.color)}>
                  <stat.icon className="w-6 h-6" />
                </div>
                {stat.isAlert ? (
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
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">
        {/* Task Distribution */}
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold">
              Task Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DonutPieChart />
          </CardContent>
        </Card>

        {/* Team Workload */}
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold">Team Workload</CardTitle>
            <MoreHorizontal className="text-muted-foreground cursor-pointer w-5 h-5" />
          </CardHeader>
          <CardContent>
            <TeamWorkload />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <RecentActivity />
        </CardContent>
      </Card>
    </main>
  );
};
