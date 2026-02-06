import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

type RequestType = InferRequestType<
  (typeof client.api.members)[':userId']['$delete']
>;
type ResponseType = InferResponseType<
  (typeof client.api.members)[':userId']['$delete']
>;

export const useRemoveMember = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const response = await client.api.members[':userId'].$delete({
        param,
        json,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          'error' in error ? error.error : 'Failed to remove member'
        );
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success('Member removed from workspace');
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['team', 'stats'] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
