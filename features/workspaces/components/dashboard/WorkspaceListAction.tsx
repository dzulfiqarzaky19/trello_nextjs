'use client';

import { ActionDropdown } from '@/components/ActionDropdown';
import { workspaceSchema } from '../../schema';
import { z } from 'zod';
import { useEditWorkspaceModal } from '../../hooks/useEditWorkspaceModal';
import { useDeleteWorkspaceModal } from '../../hooks/useDeleteWorkspaceModal';
import { useMe } from '@/features/auth/api/useMe';
interface IWorkspaceListActionProps {
  workspace: z.infer<typeof workspaceSchema>;
}

export const WorkspaceListAction = ({
  workspace,
}: IWorkspaceListActionProps) => {
  const { data } = useMe();
  const isAdmin =
    data && 'user' in data ? data.user.id === workspace.user_id : false;

  const openEditWorkspaceModal = useEditWorkspaceModal();
  const { openDeleteWorkspaceModal, isDeleting } = useDeleteWorkspaceModal();

  if (!isAdmin) return null;

  const handleEdit = () => {
    openEditWorkspaceModal(workspace);
  };

  const handleDelete = () => {
    openDeleteWorkspaceModal(workspace);
  };

  return (
    <ActionDropdown
      onEdit={handleEdit}
      onDelete={handleDelete}
      disabled={isDeleting}
    />
  );
};
