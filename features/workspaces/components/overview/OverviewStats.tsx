'use client';

import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, FolderKanban, Loader2, Users } from 'lucide-react';
import { useMemo } from 'react';
import { useGetWorkspace } from '../../api/useGetWorkspace';

export const OverviewStats = () => {
    const { data, isLoading } = useGetWorkspace();

    const stats = useMemo(() => {
        if (!data?.data) return [];

        const workspace = data.data;
        const projects = workspace.projects || [];
        const completedProjects = projects.filter(
            (project) => project.status === 'COMPLETED'
        ).length;
        const totalProjects = projects.length;
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
                value: `${completedProjects}/${totalProjects}`,
                icon: CheckCircle2,
                iconClass: 'text-emerald-600 bg-emerald-100 p-3 rounded-xl',
            },
        ];
    }, [data]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[100px]">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6 w-full">
            {stats.map((stat, index) => (
                <Card className="border-none shadow-sm hover:shadow-md transition-shadow" key={index}>
                    <CardContent className="flex items-start gap-4">
                        <div className={stat.iconClass}>
                            <stat.icon className="w-6 h-6" />
                        </div>

                        <div>
                            <h3 className="text-3xl font-bold mt-1">
                                {stat.value}
                            </h3>
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
