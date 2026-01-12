'use client';

import { Button } from '@/components/ui/button';
import { Loader2, Plus } from 'lucide-react';
import { BoardList } from './BoardList';
import { Modal } from '@/components/Modal';
import { CreateBoardForm } from './CreateBoardForm';
import { useGetWorkspace } from '@/features/workspaces/api/useGetWorkspace';

export const ProjectsGrid = () => {
  const { data, isLoading, error } = useGetWorkspace();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-y-2">
        <h2 className="text-lg font-semibold text-destructive">
          Error loading workspace
        </h2>
        <p className="text-muted-foreground">
          {error?.message || 'Workspace not found'}
        </p>
      </div>
    );
  }

  const workspace = data?.data;
  const projects = workspace?.projects || [];

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Workspace Projects</h2>
        {workspace.isAdmin && (
          <div className="flex items-center gap-x-2">
            <Modal
              trigger={
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </Button>
              }
            >
              <CreateBoardForm workspaceId={workspace.id} />
            </Modal>
          </div>
        )}
      </div>

      <BoardList boards={projects} workspaceId={workspace.id} />
    </div>
  );
};
