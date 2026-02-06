import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

type ResponseType = InferResponseType<
  (typeof client.api.comments)[':commentId']['$delete']
>;

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    { commentId: string; taskId: string }
  >({
    mutationFn: async ({ commentId }) => {
      const response = await client.api.comments[':commentId'].$delete({
        param: { commentId },
      });
      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }
      return await response.json();
    },
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ['comments', taskId] });
      toast.success('Comment deleted');
    },
    onError: () => {
      toast.error('Failed to delete comment');
    },
  });

  return mutation;
};
