import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DASHBOARD_STATS } from '@/lib/const/DashboardPage';
import { cn } from '@/lib/utils';
import { MoreHorizontal } from 'lucide-react';
import { TaskDistributionChart } from './components/TaskDistributionChart';
import { RecentActivity } from './components/RecentActivity';
import { TeamWorkload } from './components/TeamWorkload';
import { DashboardStats } from './components/DashboardStats';

export const DashboardMain = () => {
  return (
    <main className="space-y-8 p-6">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
        {DASHBOARD_STATS.map((stat, index) => (
          <DashboardStats key={index} stat={stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">
        <TaskDistributionChart />

        <TeamWorkload />
      </div>

      <RecentActivity />
    </main>
  );
};
