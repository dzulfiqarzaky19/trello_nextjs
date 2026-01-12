'use client';

import { CardDemo } from '@/components/Card';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Ellipsis, Plus, Loader2, Trash2, Pencil } from 'lucide-react';
import { ModalForm } from './ModalForm';
import { ModalColumnForm } from './ModalColumnForm';
import { useGetProject } from '../../api/useGetProject';
import { useGetColumns } from '@/features/columns/api/useGetColumns';
import { useUpdateTask } from '@/features/tasks/api/useUpdateTask';
import { useUpdateColumn } from '@/features/columns/api/useUpdateColumn';
import { useDeleteColumn } from '@/features/columns/api/useDeleteColumn';
import { Column } from '../../types';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

// ...

export const ProjectDetail = () => {
  const params = useParams();
  const projectId = params.projectId as string;

  const {
    data: projectMetadata,
    isLoading: isLoadingMetadata,
    error: errorMetadata,
  } = useGetProject({ projectId });
  const {
    data: rawColumns,
    isLoading: isLoadingColumns,
    error: errorColumns,
  } = useGetColumns({ projectId });

  const [orderedData, setOrderedData] = useState<Column[]>([]);

  useEffect(() => {
    if (rawColumns) {
      const sortedCols = [...(rawColumns || [])].sort(
        (a: Column, b: Column) => a.position - b.position
      );

      const colsWithSortedTasks = sortedCols.map((col: Column) => ({
        ...col,
        tasks: [...(col.tasks || [])].sort((a, b) => a.position - b.position),
      }));

      setOrderedData(colsWithSortedTasks);
    }
  }, [rawColumns]);

  const { mutate: updateTask } = useUpdateTask({ projectId });
  const { mutate: updateColumn } = useUpdateColumn({ projectId });
  const { mutate: deleteColumn } = useDeleteColumn({ projectId });

  const onDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === 'COLUMN') {
      const newOrderedData = [...orderedData];
      const [removed] = newOrderedData.splice(source.index, 1);
      newOrderedData.splice(destination.index, 0, removed);

      setOrderedData(newOrderedData);

      updateColumn({
        param: { columnId: removed.id },
        json: { position: destination.index + 1 },
      });
      return;
    }

    const startColIndex = orderedData.findIndex(
      (col) => col.id === source.droppableId
    );
    const finishColIndex = orderedData.findIndex(
      (col) => col.id === destination.droppableId
    );

    if (startColIndex === -1 || finishColIndex === -1) return;

    const startCol = orderedData[startColIndex];
    const finishCol = orderedData[finishColIndex];

    if (source.droppableId === destination.droppableId) {
      const newTasks = [...startCol.tasks];
      const [movedTask] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, movedTask);

      const newCol = { ...startCol, tasks: newTasks };
      const newData = [...orderedData];
      newData[startColIndex] = newCol;

      setOrderedData(newData);

      updateTask({
        param: { taskId: movedTask.id },
        json: {
          columnId: startCol.id,
          position: destination.index + 1,
        },
      });
    } else {
      const startTasks = [...startCol.tasks];
      const [movedTask] = startTasks.splice(source.index, 1);

      const finishTasks = [...finishCol.tasks];
      finishTasks.splice(destination.index, 0, movedTask);

      const newStartCol = { ...startCol, tasks: startTasks };
      const newFinishCol = { ...finishCol, tasks: finishTasks };

      const newData = [...orderedData];
      newData[startColIndex] = newStartCol;
      newData[finishColIndex] = newFinishCol;

      setOrderedData(newData);

      updateTask({
        param: { taskId: movedTask.id },
        json: {
          columnId: finishCol.id,
          position: destination.index + 1,
        },
      });
    }
  };

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

  if (isLoadingMetadata || isLoadingColumns) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (errorMetadata || errorColumns) {
    return (
      <div className="p-8 text-center text-red-500">
        Error loading project:{' '}
        {errorMetadata?.message || errorColumns?.message || 'Project not found'}
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="board" type="COLUMN" direction="horizontal">
        {(provided) => (
          <main
            className="flex gap-4 p-8 overflow-x-auto h-full"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {orderedData.map((column, index) => (
              <Draggable key={column.id} draggableId={column.id} index={index}>
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
                              column.tasks?.length
                                ? 'bg-blue-500'
                                : 'bg-gray-500'
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
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Ellipsis className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                handleRenameColumn(column.id, column.name)
                              }
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
                              <Draggable
                                key={task.id}
                                draggableId={task.id}
                                index={index}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <Modal
                                      trigger={
                                        <div className="cursor-pointer">
                                          <CardDemo
                                            title={task.title}
                                            description={task.description}
                                          />
                                        </div>
                                      }
                                      modalClass="sm:max-w-2xl"
                                    >
                                      <ModalForm
                                        card={task as any}
                                        listTitle={column.name}
                                        boardId={projectId}
                                        closeModal={() => {
                                          // Modal close logic handled by Modal component typically,
                                          // but ModalForm expects closeModal.
                                          // We need to ensure Modal component passes it or we wrap it.
                                          // Usually Trigger handles close implicitly if we click outside,
                                          // but for onSubmit we need manual control.
                                          // The current Modal implementation might not expose a close hook easily
                                          // unless we control opanness state.
                                          // For now, assuming Modal handles close on button click or we just rely on invalidation.
                                          document.dispatchEvent(
                                            new KeyboardEvent('keydown', {
                                              key: 'Escape',
                                            })
                                          ); // Hacky close
                                        }}
                                      />
                                    </Modal>
                                  </div>
                                )}
                              </Draggable>
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
                          <ModalForm
                            listTitle={column.name}
                            boardId={projectId}
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
            ))}
            {provided.placeholder}

            <div className="min-w-[300px]">
              <Modal
                trigger={
                  <Button
                    variant="ghost"
                    className="w-full justify-start bg-white/50 hover:bg-white/80 dark:bg-black/20 dark:hover:bg-black/40 h-12"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add List
                  </Button>
                }
              >
                <ModalColumnForm projectId={projectId} />
              </Modal>
            </div>
          </main>
        )}
      </Droppable>
    </DragDropContext>
  );
};
