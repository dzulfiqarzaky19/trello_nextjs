import { useModal } from '@/components/providers/ModalProvider';
import { TaskForm } from '../components/TaskForm';
import { Task } from '@/features/projects/tasks/types';

export const useEditTaskModal = () => {
  const { openModal, closeWithBack } = useModal('view-task');

  const openEditTaskModal = (task: Task, listTitle: string) => {
    openModal({
      title: '', // Handled inside TaskForm
      children: (
        <TaskForm
          card={task}
          listTitle={listTitle}
          closeModal={closeWithBack}
        />
      ),
      config: {
        className: 'sm:max-w-6xl',
        contentClassName: 'p-0 space-y-0',
        showFooter: false,
      },
    });
  };

  return openEditTaskModal;
};
