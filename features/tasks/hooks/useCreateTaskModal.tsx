import { useModal } from '@/components/providers/ModalProvider';
import { TaskForm } from '../components/TaskForm';

export const useCreateTaskModal = () => {
    const { openModal, closeWithBack } = useModal('add-task');

    const openCreateTaskModal = (columnId: string, listTitle: string) => {
        openModal({
            title: 'Create Task',
            children: (
                <TaskForm
                    listTitle={listTitle}
                    columnId={columnId}
                    closeModal={closeWithBack}
                />
            ),
        });
    };

    return openCreateTaskModal;
};
