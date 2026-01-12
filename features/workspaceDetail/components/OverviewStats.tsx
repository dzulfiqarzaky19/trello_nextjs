import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, FolderKanban, Users } from 'lucide-react';
import { IWorkspaceDetail } from '../schema';
import { useMemo } from 'react';

interface OverviewStatsProps {
    workspace: IWorkspaceDetail;
}

export const OverviewStats = ({ workspace }: OverviewStatsProps) => {
    const completedProjects = workspace.projects.filter(
        (project) => project.status === 'COMPLETED'
    ).length;

    const totalProjects = workspace.projects.length;
    const totalMembers = workspace.members.length;

    const workspaceProjects = useMemo(() => [
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
            value: `${completedProjects}/${totalProjects}`,
            icon: CheckCircle2,
            iconClass: 'text-emerald-600 bg-emerald-100 p-3 rounded-xl',
        },
    ], [totalProjects, totalMembers, completedProjects]);


    return (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6 w-full">
            {workspaceProjects.map((project, index) => (
                <Card className="border-none shadow-sm hover:shadow-md transition-shadow" key={index}>
                    <CardContent className="flex items-start gap-4">
                        <div className={project.iconClass}>
                            <project.icon className="w-6 h-6" />
                        </div>

                        <div>
                            <h3 className="text-3xl font-bold mt-1">
                                {project.value}
                            </h3>
                            <p className="text-sm font-medium text-muted-foreground">
                                {project.label}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ))}

        </div>
    );
}