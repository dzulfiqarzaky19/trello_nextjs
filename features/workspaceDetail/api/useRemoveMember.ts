import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { toast } from 'sonner';

interface RemoveMemberParams {
    workspaceId: string;
    userId: string;
}

export const useRemoveMember = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ workspaceId, userId }: RemoveMemberParams) => {
            const response = await client.api.workspaces[':workspaceId'].members[':userId'].$delete({
                param: { workspaceId, userId },
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error('error' in error ? error.error : 'Failed to remove member');
            }

            return response.json();
        },
        onSuccess: (_, { workspaceId }) => {
            toast.success('Member removed from workspace');
            queryClient.invalidateQueries({ queryKey: ['workspaceDetail', workspaceId] });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });
};
