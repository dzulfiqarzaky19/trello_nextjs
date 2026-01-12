import { Draggable } from '@hello-pangea/dnd';
import { Modal } from '@/components/Modal';
import { CardDemo } from '@/components/Card';
import { ModalTaskForm } from './TaskForm';
import { Task } from '@/features/tasks/types';

interface ProjectTaskProps {
  task: Task;
  index: number;
  columnName: string;
}

export const ProjectTask = ({ task, index, columnName }: ProjectTaskProps) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Modal
            trigger={
              <div className="cursor-pointer">
                <CardDemo title={task.title} description={task.description} />
              </div>
            }
            modalClass="sm:max-w-2xl"
          >
            <ModalTaskForm
              card={task as any}
              listTitle={columnName}
              closeModal={() => {
                document.dispatchEvent(
                  new KeyboardEvent('keydown', {
                    key: 'Escape',
                  })
                );
              }}
            />
          </Modal>
        </div>
      )}
    </Draggable>
  );
};
