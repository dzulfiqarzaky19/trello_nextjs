'use client';
import { useGetDashboard } from '@/features/dashboard/api/useGetDashboard';
import { Clock, File, Folder, List, Loader2 } from 'lucide-react';
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
      label: 'Workspaces',
      value: data.stats.workspaces.toString(),
      icon: Folder,
      color: 'bg-blue-50 text-blue-600',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Total Tasks',
      value: data.stats.tasks.toString(),
      icon: File,
      color: 'bg-green-50 text-green-600',
      iconColor: 'text-green-600',
    },
    {
      label: 'Assigned to Me',
      value: data.stats.assignedTasks.toString(),
      icon: Clock,
      color: 'bg-orange-50 text-orange-600',
      iconColor: 'text-orange-600',
    },
    {
      label: 'Total Projects',
      value: data.stats.projects.toString(),
      icon: List,
      color: 'bg-red-50 text-red-600',
      iconColor: 'text-red-600',
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
