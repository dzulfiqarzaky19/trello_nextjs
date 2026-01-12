'use client';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { ModalColumnForm } from './ModalColumnForm';
import { ProjectColumn } from './ProjectColumn';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { useProjectBoard } from '../../hooks/useProjectBoard';

export const ProjectDetail = () => {
  const { orderedData, isLoading, error, onDragEnd } = useProjectBoard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        Error loading project: {error.message || 'Project not found'}
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
              <ProjectColumn key={column.id} column={column} index={index} />
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
                <ModalColumnForm />
              </Modal>
            </div>
          </main>
        )}
      </Droppable>
    </DragDropContext>
  );
};
