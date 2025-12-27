import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { client } from '@/lib/rpc';
import { toast } from 'sonner';

type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[':workspaceId']['$delete']
>;
type RequestType = InferRequestType<
  (typeof client.api.workspaces)[':workspaceId']['$delete']
>;

export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.workspaces[':workspaceId'].$delete({
        param,
      });
      return response.json();
    },
    onSuccess: (data) => {
      if ('error' in data) {
        toast.error(data.error);
        return;
      }
      toast.success('Workspace deleted!');
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    },
    onError: () => {
      toast.error('Failed to delete workspace');
    },
  });

  return mutation;
};
