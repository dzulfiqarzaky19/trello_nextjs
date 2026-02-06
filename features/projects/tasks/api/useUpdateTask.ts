import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';
import { useProjectId } from '@/features/projects/hooks/useProjectId';
import { Column } from '@/features/projects/columns/types';
import { optimisticTask } from '@/lib/utils/optimisticTask';

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
        (old: Column[] | undefined) => optimisticTask({ old, param, json })
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
