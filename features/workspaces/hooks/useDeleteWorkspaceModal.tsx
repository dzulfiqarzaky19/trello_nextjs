import { useModal } from '@/components/providers/ModalProvider';
import { workspaceSchema } from '../schema';
import { z } from 'zod';
import { useDeleteWorkspace } from '../api/useDeleteWorkspace';

export const useDeleteWorkspaceModal = () => {
  const { mutate: deleteWorkspace, isPending: isDeleting } =
    useDeleteWorkspace();

  const { openModal, closeWithBack: closeDeleteModal } =
    useModal('delete-workspace');

  const openDeleteWorkspaceModal = (
    workspace: z.infer<typeof workspaceSchema>
  ) => {
    openModal({
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

  return { openDeleteWorkspaceModal, isDeleting };
};
