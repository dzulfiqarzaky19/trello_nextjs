import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { toast } from 'sonner';
import { useWorkspaceSlug } from '@/features/workspaces/hooks/useWorkspaceSlug';

interface RemoveMemberParams {
  workspaceId: string;
  userId: string;
}

export const useRemoveMember = () => {
  const queryClient = useQueryClient();
  const workspaceSlug = useWorkspaceSlug();

  return useMutation({
    mutationFn: async ({ workspaceId, userId }: RemoveMemberParams) => {
      const response = await client.api.members[':userId'].$delete({
        param: { userId },
        json: { workspaceId },
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
      queryClient.invalidateQueries({ queryKey: ['members', workspaceSlug] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
