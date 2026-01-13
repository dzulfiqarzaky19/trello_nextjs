import { useModal } from '@/components/providers/ModalProvider';
import { useDeleteProject } from '../api/useDeleteProject';

export const useDeleteProjectModal = ({ projectId }: { projectId: string }) => {
  const { openModal, closeWithBack } = useModal('delete-project');
  const { mutate: deleteProject, isPending: isDeleting } = useDeleteProject();

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    openModal({
      title: 'Delete Project',
      description:
        'Are you sure you want to delete this project? This action cannot be undone.',
      children: null,
      config: {
        showFooter: true,
        confirmLabel: 'Delete',
        confirmVariant: 'destructive',
        isConfirming: isDeleting,
        onConfirm: () => {
          deleteProject(
            { param: { projectId } },
            {
              onSuccess: () => {
                closeWithBack();
              },
            }
          );
        },
      },
    });
  };

  return handleDelete;
};
