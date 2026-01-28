'use client';
import { Clock, File, Folder, List } from 'lucide-react';
import { DashboardStats } from './DashboardStats';
import { useGetDashboardStats } from '../api/useGetDashboardStats';
import { DashboardStatsSkeleton } from './DashboardStatsSkeleton';

export const DashboardStatsGrid = () => {
  const { data: statsData, isLoading } = useGetDashboardStats();

  if (isLoading || !statsData) {
    return <DashboardStatsSkeleton />;
  }

  const stats = [
    {
      label: 'Workspaces',
      value: statsData.workspaces.toString(),
      icon: Folder,
      color: 'bg-blue-50 text-blue-600',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Total Tasks',
      value: statsData.tasks.toString(),
      icon: File,
      color: 'bg-green-50 text-green-600',
      iconColor: 'text-green-600',
    },
    {
      label: 'Assigned to Me',
      value: statsData.assignedTasks.toString(),
      icon: Clock,
      color: 'bg-orange-50 text-orange-600',
      iconColor: 'text-orange-600',
    },
    {
      label: 'Total Projects',
      value: statsData.projects.toString(),
      icon: List,
      color: 'bg-red-50 text-red-600',
      iconColor: 'text-red-600',
    },
  ];

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
      {stats.map((stat, index) => (
        <DashboardStats key={index} stat={stat} />
      ))}
    </div>
  );
};
