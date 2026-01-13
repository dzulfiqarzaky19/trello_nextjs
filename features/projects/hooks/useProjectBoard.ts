import { useCallback, useMemo } from 'react';
import { DropResult } from '@hello-pangea/dnd';
import { Column } from '../types';
import { useGetProject } from '../api/useGetProject';
import { useGetColumns } from '@/features/columns/api/useGetColumns';
import { useUpdateTask } from '@/features/tasks/api/useUpdateTask';
import { useUpdateColumn } from '@/features/columns/api/useUpdateColumn';

export const useProjectBoard = () => {
  const {
    data: projectMetadata,
    isLoading: isLoadingMetadata,
    error: errorMetadata,
  } = useGetProject();

  const {
    data: rawColumns,
    isLoading: isLoadingColumns,
    error: errorColumns,
  } = useGetColumns();

  const orderedData = useMemo(() => {
    if (!rawColumns) return [];
    const sortedCols = [...rawColumns].sort(
      (a: Column, b: Column) => a.position - b.position
    );

    return sortedCols.map((col: Column) => ({
      ...col,
      tasks: [...(col.tasks || [])].sort((a, b) => a.position - b.position),
    }));
  }, [rawColumns]);

  const { mutate: updateTask } = useUpdateTask();
  const { mutate: updateColumn } = useUpdateColumn();

  const handleColumnDrag = useCallback(
    (result: DropResult, data: Column[]) => {
      const { source, destination } = result;
      if (!destination) return;

      const movedColumn = data[source.index];

      if (!movedColumn) return;

      updateColumn({
        param: { columnId: movedColumn.id },
        json: { position: destination.index + 1 },
      });
    },
    [updateColumn]
  );

  const handleTaskDrag = useCallback(
    (result: DropResult, data: Column[]) => {
      const { source, destination } = result;
      if (!destination) return;

      const startCol = data.find((col) => col.id === source.droppableId);
      const finishCol = data.find((col) => col.id === destination.droppableId);

      if (!startCol || !finishCol) return;

      const movedTask = startCol.tasks?.[source.index];

      if (!movedTask) return;

      if (
        source.droppableId === destination.droppableId &&
        source.index === destination.index
      ) {
        return;
      }

      updateTask({
        param: { taskId: movedTask.id },
        json: {
          columnId: finishCol.id,
          position: destination.index + 1,
        },
      });
    },
    [updateTask]
  );

  const onDragEnd = useCallback(
    (result: DropResult) => {
      const { destination, source, type } = result;

      if (!destination) return;

      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ) {
        return;
      }

      if (type === 'COLUMN') {
        handleColumnDrag(result, orderedData);
        return;
      }

      handleTaskDrag(result, orderedData);
    },
    [orderedData, handleColumnDrag, handleTaskDrag]
  );

  return {
    projectMetadata,
    orderedData,
    isLoading: isLoadingMetadata || isLoadingColumns,
    error: errorMetadata || errorColumns,
    onDragEnd,
  };
};
