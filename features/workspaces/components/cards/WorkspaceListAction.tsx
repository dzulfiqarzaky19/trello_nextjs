'use client';

import { ActionDropdown } from '@/components/ActionDropdown';
import { workspaceSchema } from '../../schema';
import { z } from 'zod';
import { useDeleteWorkspace } from '../../api/useDeleteWorkspace';
import { WorkspaceEditForm } from '../forms/WorkspaceEditForm';
import { useMe } from '@/features/auth/api/useMe';
import { useModal } from '@/components/providers/ModalProvider';

interface IWorkspaceListActionProps {
  workspace: z.infer<typeof workspaceSchema>;
}

export const WorkspaceListAction = ({
  workspace,
}: IWorkspaceListActionProps) => {
  const { data } = useMe();
  const isAdmin =
    data && 'user' in data ? data.user.id === workspace.user_id : false;

  const { mutate: deleteWorkspace, isPending: isDeleting } =
    useDeleteWorkspace();

  const { openModal: openEditModal, closeWithReplace: closeEditModal } =
    useModal('edit-workspace');

  const {
    openModal: openDeleteModal,
    closeWithBack: closeDeleteModal,
  } = useModal('delete-workspace');

  if (!isAdmin) return null;

  const handleEdit = () => {
    openEditModal({
      title: 'Edit Workspace',
      description: 'Update your workspace details.',
      children: (
        <WorkspaceEditForm workspace={workspace} closeModal={closeEditModal} />
      ),
      config: {
        showFooter: false,
      },
    });
  };

  const handleDelete = () => {
    openDeleteModal({
      title: 'Delete Workspace',
      description: `Are you sure you want to delete "${workspace.name}"? This action cannot be undone.`,
      children: null,
      config: {
        showFooter: true,
        confirmLabel: 'Delete',
        confirmVariant: 'destructive',
        isConfirming: isDeleting,
        onConfirm: () => {
          deleteWorkspace(
            { param: { workspaceId: workspace.id } },
            {
              onSuccess: () => closeDeleteModal(),
            }
          );
        },
      },
    });
  };

  return (
    <ActionDropdown
      onEdit={handleEdit}
      onDelete={handleDelete}
      disabled={isDeleting}
    />
  );
};
