'use client';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { ProjectColumn } from '../../../columns/components/ProjectColumn';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { useProjectBoard } from '../../hooks/useProjectBoard';
import { useProjectRealtime } from '../../hooks/useProjectRealtime';
import { useProjectId } from '../../hooks/useProjectId';
import { ColumnForm } from '@/features/columns/components/ColumnForm';
import { useGlobalModal } from '@/components/providers/ModalProvider';

export const ProjectDetail = () => {
  const { orderedData, isLoading, error, onDragEnd } = useProjectBoard();
  const { openModal, closeWithBack } = useGlobalModal();
  const projectId = useProjectId();
  useProjectRealtime(projectId);

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
              <Button
                variant="ghost"
                className="w-full justify-start bg-white/50 hover:bg-white/80 dark:bg-black/20 dark:hover:bg-black/40 h-12"
                onClick={() =>
                  openModal('create-column', {
                    title: 'Create New Column',
                    children: <ColumnForm closeModal={closeWithBack} />,
                  })
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                Add List
              </Button>
            </div>
          </main>
        )}
      </Droppable>
    </DragDropContext>
  );
};
