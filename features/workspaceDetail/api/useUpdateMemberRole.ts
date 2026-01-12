import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { toast } from 'sonner';

interface UpdateMemberRoleParams {
    workspaceId: string;
    workspaceSlug: string;
    userId: string;
    role: 'ADMIN' | 'MEMBER';
}

export const useUpdateMemberRole = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ workspaceId, userId, role }: UpdateMemberRoleParams) => {
            const response = await client.api.workspaces[':workspaceId'].members[':userId'].$patch({
                param: { workspaceId, userId },
                json: { role },
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error('error' in error ? error.error : 'Failed to update role');
            }

            return response.json();
        },
        onSuccess: (_, { workspaceSlug, role }) => {
            toast.success(`Member ${role === 'ADMIN' ? 'promoted to admin' : 'demoted to member'}`);
            queryClient.invalidateQueries({ queryKey: ['workspaceDetail', workspaceSlug] });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });
};

