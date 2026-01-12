import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';
import { useProjectId } from '@/features/projects/hooks/useProjectId';

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
    { previousColumns: any }
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

      const previousColumns = queryClient.getQueryData(['columns', projectId]);

      queryClient.setQueryData(['columns', projectId], (old: any) => {
        if (!old) return old;

        const newColumns = JSON.parse(JSON.stringify(old));
        const { taskId } = param;
        const { columnId, position, description, title } = json;

        // Verify if this is a move operation
        if (columnId && position) {
          let sourceColumn: any;
          let sourceTaskIndex = -1;
          let movedTask: any;

          // Find source column and task
          for (const col of newColumns) {
            const taskIndex = col.tasks?.findIndex((t: any) => t.id === taskId);
            if (taskIndex !== -1 && taskIndex !== undefined) {
              sourceColumn = col;
              sourceTaskIndex = taskIndex;
              movedTask = col.tasks[taskIndex];
              break;
            }
          }

          if (sourceColumn && movedTask) {
            // Remove from source
            sourceColumn.tasks.splice(sourceTaskIndex, 1);

            // Add to destination
            const destColumn = newColumns.find((c: any) => c.id === columnId);
            if (destColumn) {
              if (!destColumn.tasks) destColumn.tasks = [];
              // position is 1-indexed from backend/dnd logic usually, so subtract 1
              // Ensure we don't go out of bounds if position is huge (though dnd handles this)
              const insertIndex = Math.min(
                Math.max(0, position - 1),
                destColumn.tasks.length
              );
              destColumn.tasks.splice(insertIndex, 0, movedTask);
            }
          }
        }

        // Handle direct property updates (title, description)
        if (title || description) {
          for (const col of newColumns) {
            const task = col.tasks?.find((t: any) => t.id === taskId);
            if (task) {
              if (title) task.title = title;
              if (description) task.description = description;
              break;
            }
          }
        }

        return newColumns;
      });

      return { previousColumns };
    },
    onError: (err, newTodo, context) => {
      toast.error(err.message);
      queryClient.setQueryData(
        ['columns', projectId],
        context?.previousColumns
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['columns', projectId] });
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
    },
  });

  return mutation;
};
