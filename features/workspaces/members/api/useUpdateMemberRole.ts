import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

type RequestType = InferRequestType<
  (typeof client.api.members)[':userId']['$patch']
>;
type ResponseType = InferResponseType<
  (typeof client.api.members)[':userId']['$patch']
>;

export const useUpdateMemberRole = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const response = await client.api.members[':userId'].$patch({
        param,
        json,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          'error' in error ? error.error : 'Failed to update role'
        );
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      toast.success(
        `Member ${
          variables.json.role === 'ADMIN'
            ? 'promoted to admin'
            : 'demoted to member'
        }`
      );
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['team', 'stats'] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
