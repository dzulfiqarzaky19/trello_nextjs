import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';
import { useProjectId } from '@/features/projects/hooks/useProjectId';

type ResponseType = InferResponseType<
  (typeof client.api.columns)[':columnId']['$patch'],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.columns)[':columnId']['$patch']
>;

export const useUpdateColumn = () => {
  const queryClient = useQueryClient();
  const projectId = useProjectId();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType,
    { previousColumns: any } // Type context here
  >({
    mutationFn: async ({ param, json }) => {
      const response = await client.api.columns[':columnId'].$patch({
        param,
        json,
      });

      if (!response.ok) {
        const errorData = (await response.json()) as { error?: string };
        throw new Error(errorData.error || 'Failed to update column');
      }

      return await response.json();
    },
    onMutate: async ({ param, json }) => {
      await queryClient.cancelQueries({ queryKey: ['columns', projectId] });

      const previousColumns = queryClient.getQueryData(['columns', projectId]);

      queryClient.setQueryData(['columns', projectId], (old: any) => {
        if (!old) return old;

        const newColumns = JSON.parse(JSON.stringify(old));
        const { columnId } = param;
        const { position, title } = json;

        if (position) {
          const columnIndex = newColumns.findIndex(
            (c: any) => c.id === columnId
          );
          if (columnIndex !== -1) {
            const [movedColumn] = newColumns.splice(columnIndex, 1);
            // position is 1-indexed, so -1
            const insertIndex = Math.min(
              Math.max(0, position - 1),
              newColumns.length
            );
            newColumns.splice(insertIndex, 0, movedColumn);

            // Important: Update position properties for ALL columns to reflect new order
            // because useProjectBoard sorts by position!
            newColumns.forEach((col: any, index: number) => {
              col.position = index + 1;
            });
          }
        }

        if (title) {
          const column = newColumns.find((c: any) => c.id === columnId);
          if (column) {
            column.name = title;
          }
        }

        return newColumns;
      });

      return { previousColumns };
    },
    onError: (err, newCol, context) => {
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
