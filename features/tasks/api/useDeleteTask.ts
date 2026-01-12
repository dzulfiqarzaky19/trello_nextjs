import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

type ResponseType = InferResponseType<
  (typeof client.api.tasks)[':taskId']['$delete'],
  200
>;

export const useDeleteTask = ({ projectId }: { projectId: string }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    { param: { taskId: string } }
  >({
    mutationFn: async ({ param }) => {
      const response = await client.api.tasks[':taskId'].$delete({
        param,
      });

      if (!response.ok) {
        const errorData = (await response.json()) as { error?: string };
        throw new Error(errorData.error || 'Failed to delete task');
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success('Task deleted');
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  return mutation;
};
