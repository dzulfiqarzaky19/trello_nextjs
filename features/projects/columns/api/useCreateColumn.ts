import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';
import { useProjectId } from '@/features/projects/hooks/useProjectId';

type ResponseType = InferResponseType<
  (typeof client.api.columns)['$post'],
  200
>;
type RequestType = InferRequestType<(typeof client.api.columns)['$post']>;

export const useCreateColumn = () => {
  const queryClient = useQueryClient();
  const projectId = useProjectId();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.columns.$post({
        json,
      });

      if (!response.ok) {
        throw new Error('Failed to create column');
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success('Column created');
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
    },
    onError: () => {
      toast.error('Failed to create column');
    },
  });

  return mutation;
};
