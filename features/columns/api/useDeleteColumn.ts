import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';
import { useProjectId } from '@/features/projects/hooks/useProjectId';

type ResponseType = InferResponseType<
  (typeof client.api.columns)[':columnId']['$delete'],
  200
>;

export const useDeleteColumn = () => {
  const queryClient = useQueryClient();
  const projectId = useProjectId();

  const mutation = useMutation<
    ResponseType,
    Error,
    { param: { columnId: string } }
  >({
    mutationFn: async ({ param }) => {
      const response = await client.api.columns[':columnId'].$delete({
        param,
      });

      if (!response.ok) {
        const errorData = (await response.json()) as { error?: string };
        throw new Error(errorData.error || 'Failed to delete column');
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success('Column deleted');
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  return mutation;
};
