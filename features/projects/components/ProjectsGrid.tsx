'use client';

import { ProjectCreate } from './dashboard/ProjectCreate';
import { ProjectCard } from './dashboard/ProjectCard';
import { ProjectsGridSkeleton } from './ProjectsGridSkeleton';
import { Project } from '../types';
import { useGetProjects } from '@/features/projects/api/useGetProjects';

export const ProjectsGrid = () => {
  const {
    data,
    isLoading: isLoadingProjects,
    error: projectsError,
  } = useGetProjects();

  const projects = data?.projects || [];
  const isAdmin = data?.isAdmin || false;
  const workspaceId = data?.workspaceId;

  if (isLoadingProjects) {
    return <ProjectsGridSkeleton />;
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

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Workspace Projects</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {projects.map((project: Project) => (
          <ProjectCard key={project.id} project={project} />
        ))}

        {isAdmin && workspaceId && <ProjectCreate />}
      </div>

      {projects.length === 0 && !isAdmin && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            No projects found in this workspace.
          </p>
        </div>
      )}
    </div>
  );
};
