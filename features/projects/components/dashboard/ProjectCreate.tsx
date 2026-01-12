'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { useModal } from '@/components/providers/ModalProvider';
import { ProjectCreateForm } from '../forms/ProjectCreateForm';

interface ProjectCreateProps {
  workspaceId: string;
}

export const ProjectCreate = ({ workspaceId }: ProjectCreateProps) => {
  const { openModal, closeWithReplace: closeModal } =
    useModal('create-project');

  const handleClick = () => {
    openModal({
      title: 'Create New Project',
      description: 'Start organizing your tasks in a new project board.',
      children: (
        <ProjectCreateForm workspaceId={workspaceId} closeModal={closeModal} />
      ),
      config: {
        showFooter: false,
      },
    });
  };

  return (
    <Card
      onClick={handleClick}
      className="hover:shadow-lg transition-shadow cursor-pointer h-32 flex items-center justify-center bg-muted/50 hover:bg-muted border-dashed"
    >
      <CardContent className="flex flex-col items-center gap-2 p-6">
        <Plus className="w-8 h-8 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">
          Create New Project
        </span>
      </CardContent>
    </Card>
  );
};
