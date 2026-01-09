import { ActionDropdown } from '@/components/ActionDropdown';
import { Button } from '@/components/ui/button';
import { workspaceSchema } from '../../schema';
import { z } from 'zod';
import { useDeleteWorkspace } from '../../api/useDeleteWorkspace';
import { Modal } from '@/components/Modal';
import { WorkspaceEditForm } from '../forms/WorkspaceEditForm';
import { useState } from 'react';
import { useMe } from '@/features/auth/api/useMe';

interface IWorkspaceListActionProps {
  workspace: z.infer<typeof workspaceSchema>;
}

export const WorkspaceListAction = ({
  workspace,
}: IWorkspaceListActionProps) => {
  const { data } = useMe();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { mutate: deleteWorkspace, isPending: isDeleting } =
    useDeleteWorkspace();

  const isAdmin =
    data && 'user' in data ? data.user.id === workspace.user_id : false;

  if (!isAdmin) return null;

  const onDelete = () => {
    deleteWorkspace({ param: { workspaceId: workspace.id } });
    setIsDeleteOpen(false);
  };

  return (
    <>
      <ActionDropdown
        onEdit={() => setIsEditOpen(true)}
        onDelete={() => setIsDeleteOpen(true)}
        disabled={isDeleting}
      />

      <Modal open={isEditOpen} onOpenChange={setIsEditOpen} trigger={null}>
        <WorkspaceEditForm
          workspace={workspace}
          onSuccess={() => setIsEditOpen(false)}
        />
      </Modal>

      <Modal open={isDeleteOpen} onOpenChange={setIsDeleteOpen} trigger={null}>
        <div className="p-6 space-y-4">
          <h2 className="text-xl font-bold">Delete Workspace</h2>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete <strong>{workspace.name}</strong>?
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onDelete}
              disabled={isDeleting}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
