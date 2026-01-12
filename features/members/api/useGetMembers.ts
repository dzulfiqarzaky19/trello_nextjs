import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { InferResponseType } from 'hono';
import { useWorkspaceSlug } from '@/features/workspaces/hooks/useWorkspaceSlug';

type ResponseType = InferResponseType<typeof client.api.members.$get, 200>;

export const useGetMembers = () => {
    const workspaceSlug = useWorkspaceSlug();

    return useQuery<ResponseType, Error>({
        queryKey: ['members', workspaceSlug],
        queryFn: async () => {
            const response = await client.api.members.$get({
                query: { workspaceId: workspaceSlug },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch members');
            }

            return await response.json();
        },
        enabled: !!workspaceSlug,
    });
};
