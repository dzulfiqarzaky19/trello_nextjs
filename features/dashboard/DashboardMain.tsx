'use client';
import { TaskDistributionChart } from './components/TaskDistributionChart';
import { RecentActivity } from './components/RecentActivity';
import { TeamWorkload } from './components/TeamWorkload';
import { DashboardStatsGrid } from './components/DashboardStatsGrid';

export const DashboardMain = () => {
  return (
    <main className="space-y-8 p-6">
      <DashboardStatsGrid />

      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">
        <TaskDistributionChart />
        <TeamWorkload />
      </div>

      <RecentActivity />
    </main>
  );
};
