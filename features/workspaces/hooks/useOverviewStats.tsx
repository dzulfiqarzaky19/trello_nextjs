import { useMemo } from 'react';
import { useGetWorkspace } from '../api/useGetWorkspace';
import { CheckCircle2, FolderKanban, Users } from 'lucide-react';

export const useOverviewStats = () => {
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

    const taskCompletion =
      totalProjects === 0 ? 0 : `${completedProjects}/${totalProjects}`;
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
        label: 'Project Completion',
        value: taskCompletion,
        icon: CheckCircle2,
        iconClass: 'text-emerald-600 bg-emerald-100 p-3 rounded-xl',
      },
    ];
  }, [data]);

  return stats;
};
