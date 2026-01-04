'use client';

import { useGetWorkspace } from '../api/useGetWorkspace';
import { WorkspaceLoadingSkeleton } from './WorkspaceLoadingSkeleton';
import { WorkspaceCreate } from './WorkspaceCreate';
import { WorkspaceCard } from './WorkspaceCard';

export const WorkspaceMain = () => {
  const { data: workspaces, isLoading } = useGetWorkspace();

  if (isLoading) return <WorkspaceLoadingSkeleton />;

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {workspaces &&
          workspaces.map((workspace) => (
            <WorkspaceCard key={workspace.id} workspace={workspace} />
          ))}

        <WorkspaceCreate />
      </div>

      {!workspaces ||
        (workspaces.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              You don't have any boards yet. Create one to get started!
            </p>
          </div>
        ))}
    </div>
  );
};
