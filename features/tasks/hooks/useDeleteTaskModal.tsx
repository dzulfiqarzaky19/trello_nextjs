import { useModal } from '@/components/providers/ModalProvider';
import { useDeleteTask } from '../api/useDeleteTask';
import { Task } from '@/features/tasks/types';

export const useDeleteTaskModal = () => {
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask();
  const { openModal, closeWithBack } = useModal('delete-task');

  const openDeleteTaskModal = (task: Task) => {
    openModal({
      title: 'Delete Task',
      description: 'Are you sure you want to delete this task?',
      children: null,
      config: {
        showFooter: true,
        confirmLabel: 'Delete',
        confirmVariant: 'destructive',
        isConfirming: isDeleting,
        onConfirm: () => {
          deleteTask(
            {
              param: { taskId: task.id },
            },
            {
              onSuccess: () => closeWithBack(),
            }
          );
        },
      },
    });
  };

  return { openDeleteTaskModal, isDeleting };
};
