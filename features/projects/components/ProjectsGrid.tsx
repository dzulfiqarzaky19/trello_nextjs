'use client';

import { ProjectCreate } from './dashboard/ProjectCreate';
import { ProjectCard } from './dashboard/ProjectCard';
import { useGetWorkspace } from '@/features/workspaces/api/useGetWorkspace';
import { Loader2 } from 'lucide-react';
import { Project } from '@/features/projects/types';

import { useGetProjects } from '@/features/projects/api/useGetProjects';

export const ProjectsGrid = () => {
  const {
    data: workspaceData,
    isLoading: isLoadingWorkspace,
    error: workspaceError,
  } = useGetWorkspace();
  const workspace = workspaceData?.data;

  const {
    data: projects,
    isLoading: isLoadingProjects,
    error: projectsError,
  } = useGetProjects();

  if (isLoadingWorkspace || (workspace?.id && isLoadingProjects)) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (workspaceError || !workspace) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-y-2">
        <h2 className="text-lg font-semibold text-destructive">
          Error loading workspace
        </h2>
        <p className="text-muted-foreground">
          {workspaceError?.message || 'Workspace not found'}
        </p>
      </div>
    );
  }

  if (projectsError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-y-2">
        <h2 className="text-lg font-semibold text-destructive">
          Error loading projects
        </h2>
        <p className="text-muted-foreground">{projectsError.message}</p>
      </div>
    );
  }

  const projectList = projects || [];

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Workspace Projects</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {projectList.map((project: Project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
        {workspace.isAdmin && <ProjectCreate workspaceId={workspace.id} />}
      </div>

      {projectList.length === 0 && !workspace.isAdmin && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            No projects found in this workspace.
          </p>
        </div>
      )}
    </div>
  );
};
