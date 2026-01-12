import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { toast } from 'sonner';

interface AddMemberParams {
    workspaceId: string;
    userId: string;
    role?: 'ADMIN' | 'MEMBER';
}

export const useAddMember = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ workspaceId, userId, role = 'MEMBER' }: AddMemberParams) => {
            const response = await client.api.workspaces[':workspaceId'].members.$post({
                param: { workspaceId },
                json: { userId, role },
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error('error' in error ? error.error : 'Failed to add member');
            }

            return response.json();
        },
        onSuccess: (_, { workspaceId }) => {
            toast.success('Member added successfully');
            queryClient.invalidateQueries({ queryKey: ['workspaceDetail', workspaceId] });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });
};
