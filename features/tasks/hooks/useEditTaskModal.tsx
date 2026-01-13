import { useModal } from '@/components/providers/ModalProvider';
import { TaskForm } from '../components/TaskForm';
import { Task } from '@/features/tasks/types';

export const useEditTaskModal = () => {
    const { openModal, closeWithBack } = useModal('view-task');

    const openEditTaskModal = (task: Task, listTitle: string) => {
        openModal({
            title: 'Edit Task',
            children: (
                <TaskForm
                    card={task}
                    listTitle={listTitle}
                    closeModal={closeWithBack}
                />
            ),
        });
    };

    return openEditTaskModal;
};
