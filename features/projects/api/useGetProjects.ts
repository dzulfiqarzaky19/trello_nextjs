import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { useWorkspaceSlug } from '@/features/workspaces/hooks/useWorkspaceSlug';

export const useGetProjects = () => {
    const workspaceSlug = useWorkspaceSlug();

    const query = useQuery({
        queryKey: ['projects', workspaceSlug],
        queryFn: async () => {
            const response = await client.api.projects.$get({
                query: { workspaceId: workspaceSlug },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch projects');
            }

            const { data } = await response.json();
            return data;
        },
        enabled: !!workspaceSlug,
    });

    return query;
};
