import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { toast } from 'sonner';
import { useWorkspaceSlug } from '@/features/workspaces/hooks/useWorkspaceSlug';

interface UpdateMemberRoleParams {
    workspaceId: string;
    userId: string;
    role: 'ADMIN' | 'MEMBER';
}

export const useUpdateMemberRole = () => {
    const queryClient = useQueryClient();
    const workspaceSlug = useWorkspaceSlug();

    return useMutation({
        mutationFn: async ({ workspaceId, userId, role }: UpdateMemberRoleParams) => {
            const response = await client.api.members[':userId'].$patch({
                param: { userId },
                json: { workspaceId, role },
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error('error' in error ? error.error : 'Failed to update role');
            }

            return response.json();
        },
        onSuccess: (_, { role }) => {
            toast.success(`Member ${role === 'ADMIN' ? 'promoted to admin' : 'demoted to member'}`);
            queryClient.invalidateQueries({ queryKey: ['workspace', workspaceSlug] });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });
};
