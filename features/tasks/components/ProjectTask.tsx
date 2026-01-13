import { Draggable } from '@hello-pangea/dnd';
import { CardDemo } from '@/components/Card';
import { Task } from '@/features/tasks/types';
import { useEditTaskModal } from '@/features/tasks/hooks/useEditTaskModal';

interface ProjectTaskProps {
  task: Task;
  index: number;
  columnName: string;
}

export const ProjectTask = ({ task, index, columnName }: ProjectTaskProps) => {
  const openEditTaskModal = useEditTaskModal();

  const handleOpenTask = () => {
    openEditTaskModal(task, columnName);
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
