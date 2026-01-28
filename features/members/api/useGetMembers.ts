import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { InferResponseType } from 'hono';
import { useWorkspaceSlug } from '@/features/workspaces/hooks/useWorkspaceSlug';

type ResponseType = InferResponseType<typeof client.api.members.$get, 200>;

export const useGetMembers = (workspaceId?: string) => {
  const workspaceSlug = useWorkspaceSlug();
  const idToUse = workspaceId || workspaceSlug;

  return useQuery<ResponseType, Error>({
    queryKey: ['members', idToUse],
    queryFn: async () => {
      const response = await client.api.members.$get({
        query: { workspaceId: idToUse },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch members');
      }

      return await response.json();
    },
    enabled: !!idToUse,
  });
};
