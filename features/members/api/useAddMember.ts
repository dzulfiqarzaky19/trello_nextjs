import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { toast } from 'sonner';
import { useWorkspaceSlug } from '@/features/workspaces/hooks/useWorkspaceSlug';

interface AddMemberParams {
  workspaceId: string;
  userId: string;
  role?: 'ADMIN' | 'MEMBER';
}

export const useAddMember = () => {
  const queryClient = useQueryClient();
  const workspaceSlug = useWorkspaceSlug();

  return useMutation({
    mutationFn: async ({
      workspaceId,
      userId,
      role = 'MEMBER',
    }: AddMemberParams) => {
      const response = await client.api.members.$post({
        json: { workspaceId, userId, role },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          'error' in error ? error.error : 'Failed to add member'
        );
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success('Member added successfully');
      queryClient.invalidateQueries({ queryKey: ['members', workspaceSlug] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
