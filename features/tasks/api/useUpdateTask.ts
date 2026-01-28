import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';
import { useProjectId } from '@/features/projects/hooks/useProjectId';
import { Column } from '@/features/columns/types';
import { Task } from '../types';

type ResponseType = InferResponseType<
  (typeof client.api.tasks)[':taskId']['$patch'],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.tasks)[':taskId']['$patch']
>;

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  const projectId = useProjectId();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType,
    { previousColumns: Column[] | undefined }
  >({
    mutationFn: async ({ param, json }) => {
      const response = await client.api.tasks[':taskId'].$patch({
        param,
        json,
      });

      if (!response.ok) {
        const errorData = (await response.json()) as { error?: string };
        throw new Error(errorData.error || 'Failed to update task');
      }

      return await response.json();
    },
    onMutate: async ({ param, json }) => {
      await queryClient.cancelQueries({ queryKey: ['columns', projectId] });

      const previousColumns = queryClient.getQueryData<Column[]>([
        'columns',
        projectId,
      ]);

      queryClient.setQueryData(
        ['columns', projectId],
        (old: Column[] | undefined) => {
          if (!old) return old;

          const newColumns: Column[] = JSON.parse(JSON.stringify(old));
          const { taskId } = param;
          const { columnId, position, description, title } = json;

          if (columnId && position) {
            let sourceColumn: Column | undefined;
            let sourceTaskIndex = -1;
            let movedTask: Task | undefined;

            for (const col of newColumns) {
              const taskIndex = col.tasks?.findIndex((t) => t.id === taskId);
              if (taskIndex !== -1 && taskIndex !== undefined) {
                sourceColumn = col;
                sourceTaskIndex = taskIndex;
                movedTask = col.tasks[taskIndex];
                break;
              }
            }

            if (sourceColumn && movedTask) {
              sourceColumn.tasks.splice(sourceTaskIndex, 1);

              const destColumn = newColumns.find((c) => c.id === columnId);
              if (destColumn) {
                if (!destColumn.tasks) destColumn.tasks = [];
                const insertIndex = Math.min(
                  Math.max(0, position - 1),
                  destColumn.tasks.length
                );
                destColumn.tasks.splice(insertIndex, 0, movedTask);

                destColumn.tasks.forEach((t, idx) => {
                  t.position = idx + 1;
                });
                if (sourceColumn && sourceColumn !== destColumn) {
                  sourceColumn.tasks.forEach((t, idx) => {
                    t.position = idx + 1;
                  });
                }
              }
            }
          }

          if (title || description) {
            for (const col of newColumns) {
              const task = col.tasks?.find((t) => t.id === taskId);
              if (task) {
                if (title) task.title = title;
                if (description) task.description = description;
                break;
              }
            }
          }

          return newColumns;
        }
      );

      return { previousColumns };
    },
    onError: (err, _, context) => {
      toast.error(err.message);
      queryClient.setQueryData(
        ['columns', projectId],
        context?.previousColumns
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['columns', projectId] });
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      queryClient.invalidateQueries({ queryKey: ['team', 'stats'] });
    },
  });

  return mutation;
};
