'use client';

import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, FolderKanban, Loader2, Users } from 'lucide-react';
import { useMemo } from 'react';
import { useGetWorkspace } from '../../api/useGetWorkspace';

export const OverviewStats = () => {
  const { data } = useGetWorkspace();

  const stats = useMemo(() => {
    if (!data?.data) return [];

    const workspace = data.data;
    const projects = workspace.projects || [];

    const { completedProjects, totalProjects } = projects.reduce(
      (acc, project) => {
        if (project.status === 'COMPLETED') {
          acc.completedProjects += 1;
        }
        if (project.status !== 'ARCHIVED') {
          acc.totalProjects += 1;
        }
        return acc;
      },
      { completedProjects: 0, totalProjects: 0 }
    );

    const taskCompletion = totalProjects === 0 ? 0 : `${completedProjects}/${totalProjects}`;
    const totalMembers = workspace.members.length;

    return [
      {
        label: 'Active Projects',
        value: totalProjects,
        icon: FolderKanban,
        iconClass: 'text-violet-600 bg-violet-100 p-3 rounded-xl',
      },
      {
        label: 'Team Members',
        value: totalMembers,
        icon: Users,
        iconClass: 'text-blue-600 bg-blue-100 p-3 rounded-xl',
      },
      {
        label: 'Task Completion',
        value: taskCompletion,
        icon: CheckCircle2,
        iconClass: 'text-emerald-600 bg-emerald-100 p-3 rounded-xl',
      },
    ];
  }, [data]);

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6 w-full">
      {stats.map((stat, index) => (
        <Card
          className="border-none shadow-sm hover:shadow-md transition-shadow"
          key={index}
        >
          <CardContent className="flex items-start gap-4">
            <div className={stat.iconClass}>
              <stat.icon className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
              <p className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
