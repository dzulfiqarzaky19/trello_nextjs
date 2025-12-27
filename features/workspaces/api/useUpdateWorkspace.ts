import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { client } from '@/lib/rpc';
import { toast } from 'sonner';

type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[':workspaceId']['$patch']
>;
type RequestType = InferRequestType<
  (typeof client.api.workspaces)[':workspaceId']['$patch']
>;

export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, form }) => {
      const response = await client.api.workspaces[':workspaceId'].$patch({
        param,
        form,
      });
      return response.json();
    },
    onSuccess: (data) => {
      if ('error' in data) {
        toast.error(data.error);
        return;
      }
      toast.success('Workspace updated!');
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      queryClient.invalidateQueries({
        queryKey: ['workspace', data.data.id],
      });
    },
    onError: () => {
      toast.error('Failed to update workspace');
    },
  });

  return mutation;
};
