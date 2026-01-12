import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

type ResponseType = InferResponseType<
  (typeof client.api.tasks)[':taskId']['$patch'],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.tasks)[':taskId']['$patch']
>;

export const useUpdateTask = ({ projectId }: { projectId: string }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
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
    onSuccess: () => {
      // Optimistic update logic usually happens in onMutate,
      // but for simplicity we invalidate.
      // For drag and drop, smooth UI depends on local state surviving the re-fetch or proper optimistic updates.
      // We will implement local state driving the UI in ProjectsMain.
      toast.success('Task updated');
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  return mutation;
};
