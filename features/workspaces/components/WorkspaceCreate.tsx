'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { useModal } from '@/components/providers/ModalProvider';
import { WorkspaceCreateForm } from './forms/WorkspaceCreateForm';

export const WorkspaceCreate = () => {
  const { openModal, closeWithReplace } = useModal('create-workspace');

  const handleClick = () => {
    openModal({
      title: 'Create New Board',
      description: 'Start organizing your tasks in a new project board.',
      children: <WorkspaceCreateForm closeModal={closeWithReplace} />,
      config: {
        showFooter: false,
      },
    });
  };

  return (
    <Card
      onClick={handleClick}
      className="group hover:shadow-lg transition-shadow cursor-pointer h-full min-h-[250px] flex items-center justify-center bg-transparent hover:bg-muted border-dashed border-2"
    >
      <CardContent className="flex flex-col items-center gap-2 p-6 text-center">
        <div className="h-10 w-10 rounded-full bg-muted group-hover:bg-white flex items-center justify-center transition-colors">
          <Plus className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
        <span className="text-lg font-medium text-foreground">
          Create New Workspace
        </span>
        <span className="text-sm text-muted-foreground max-w-[200px]">
          Set up a new space for your team to collaborate.
        </span>
      </CardContent>
    </Card>
  );
};
