import { Draggable, Droppable } from '@hello-pangea/dnd';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Ellipsis, Plus } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { TaskForm } from '../../tasks/components/TaskForm';
import { ProjectTask } from '../../tasks/components/ProjectTask';
import { Column } from '../../projects/types';
import { useDeleteColumn } from '@/features/columns/api/useDeleteColumn';
import { useUpdateColumn } from '@/features/columns/api/useUpdateColumn';

interface ProjectColumnProps {
  column: Column;
  index: number;
}

export const ProjectColumn = ({ column, index }: ProjectColumnProps) => {
  const { mutate: deleteColumn } = useDeleteColumn();
  const { mutate: updateColumn } = useUpdateColumn();

  const handleDeleteColumn = (columnId: string) => {
    if (
      confirm(
        'Are you sure you want to delete this list? All tasks in it will be deleted.'
      )
    ) {
      deleteColumn({ param: { columnId } });
    }
  };

  const handleRenameColumn = (columnId: string, currentName: string) => {
    const newName = prompt('Enter new list name:', currentName);
    if (newName && newName !== currentName) {
      updateColumn({
        param: { columnId },
        json: { title: newName },
      });
    }
  };

  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="h-full"
        >
          <Card className="border-none shadow-none rounded-none bg-transparent min-w-[300px] flex flex-col max-h-full">
            <CardHeader
              className="flex items-center justify-between p-2"
              {...provided.dragHandleProps}
            >
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    'size-2 rounded-full',
                    column.tasks?.length ? 'bg-blue-500' : 'bg-gray-500'
                  )}
                />
                <CardTitle className="text-sm font-semibold">
                  {column.name}
                </CardTitle>
                <div className="size-5 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                  {column.tasks?.length || 0}
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Ellipsis className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => handleRenameColumn(column.id, column.name)}
                  >
                    Rename List
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDeleteColumn(column.id)}
                    className="text-red-600 focus:text-red-600"
                  >
                    Delete List
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>

            <Droppable droppableId={column.id} type="TASK">
              {(provided) => (
                <CardContent
                  className="space-y-4 p-2 overflow-y-auto min-h-0 flex-1"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {column.tasks?.map((task, index) => (
                    <ProjectTask
                      key={task.id}
                      task={task}
                      index={index}
                      columnName={column.name}
                    />
                  ))}
                  {provided.placeholder}
                </CardContent>
              )}
            </Droppable>

            <CardFooter className="p-2">
              <Modal
                trigger={
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-muted-foreground hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Task
                  </Button>
                }
                modalClass="sm:max-w-2xl"
              >
                <TaskForm
                  listTitle={column.name}
                  columnId={column.id}
                  closeModal={() => {
                    document.dispatchEvent(
                      new KeyboardEvent('keydown', { key: 'Escape' })
                    );
                  }}
                />
              </Modal>
            </CardFooter>
          </Card>
        </div>
      )}
    </Draggable>
  );
};
