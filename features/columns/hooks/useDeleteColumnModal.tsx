import { useModal } from '@/components/providers/ModalProvider';
import { useDeleteColumn } from '../api/useDeleteColumn';

export const useDeleteColumnModal = () => {
  const { mutate: deleteColumn, isPending: isDeleting } = useDeleteColumn();
  const { openModal, closeWithBack } = useModal('delete-column');

  const openDeleteColumnModal = (columnId: string) => {
    openModal({
      title: 'Delete List',
      description:
        'Are you sure you want to delete this list? All tasks in it will be deleted.',
      children: null,
      config: {
        showFooter: true,
        confirmLabel: 'Delete',
        confirmVariant: 'destructive',
        isConfirming: isDeleting,
        onConfirm: () => {
          deleteColumn(
            { param: { columnId } },
            {
              onSuccess: () => closeWithBack(),
            }
          );
        },
      },
    });
  };

  return { openDeleteColumnModal, isDeleting };
};
