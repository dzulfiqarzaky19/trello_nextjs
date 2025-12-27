'use client';

import { useGetWorkspace } from '../api/useGetWorkspace';
import { WorkspaceList } from './WorkspaceList';
import { WorkspaceLoadingSkeleton } from './WorkspaceLoadingSkeleton';

export const WorkspaceMain = () => {
  const { data, isLoading } = useGetWorkspace();

  if (isLoading) return <WorkspaceLoadingSkeleton />;

  return (
    <div className="p-8">
      <WorkspaceList workspaces={data} />

      {!data ||
        (data.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              You don't have any boards yet. Create one to get started!
            </p>
          </div>
        ))}
    </div>
  );
};
