'use client'
import { useGetDashboard } from '@/features/dashboard/api/useGetDashboard';
import { DASHBOARD_STATS } from '@/lib/const/DashboardPage';
import { Loader2 } from 'lucide-react';
import { TaskDistributionChart } from './components/TaskDistributionChart';
import { RecentActivity } from './components/RecentActivity';
import { TeamWorkload } from './components/TeamWorkload';
import { DashboardStats } from './components/DashboardStats';

export const DashboardMain = () => {
  const { data, isLoading } = useGetDashboard();

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-full min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const stats = [
    {
      ...DASHBOARD_STATS[0],
      value: data.stats.workspaces.toString(),
    },
    {
      ...DASHBOARD_STATS[1],
      value: data.stats.tasks.toString(),
    },
    {
      ...DASHBOARD_STATS[2],
      value: data.stats.assignedTasks.toString(),
    },
    {
      ...DASHBOARD_STATS[3],
      value: data.stats.projects.toString(),
    },
  ];

  return (
    <main className="space-y-8 p-6">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
        {stats.map((stat, index) => (
          <DashboardStats key={index} stat={stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">
        <TaskDistributionChart data={data.chartData} />

        <TeamWorkload data={data.teamWorkload} />
      </div>

      <RecentActivity activities={data.recentActivity} />
    </main>
  );
};
