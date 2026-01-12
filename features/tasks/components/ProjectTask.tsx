import { Draggable } from '@hello-pangea/dnd';
import { CardDemo } from '@/components/Card';
import { TaskForm } from './TaskForm';
import { Task } from '@/features/tasks/types';
import { useGlobalModal } from '@/components/providers/ModalProvider';

interface ProjectTaskProps {
  task: Task;
  index: number;
  columnName: string;
}

export const ProjectTask = ({ task, index, columnName }: ProjectTaskProps) => {
  const { openModal, closeWithBack } = useGlobalModal();

  const handleOpenTask = () => {
    openModal('view-task', {
      title: 'Edit Task',
      children: (
        <TaskForm
          card={task}
          listTitle={columnName}
          closeModal={closeWithBack}
        />
      ),
    });
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="cursor-pointer" onClick={handleOpenTask}>
            <CardDemo title={task.title} description={task.description} />
          </div>
        </div>
      )}
    </Draggable>
  );
};
