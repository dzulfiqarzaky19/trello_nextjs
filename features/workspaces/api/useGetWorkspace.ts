import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { InferResponseType } from 'hono';
import { useWorkspaceSlug } from '../hooks/useWorkspaceSlug';

type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[':workspaceId']['$get'],
  200
>;

export const useGetWorkspace = () => {
  const workspaceSlug = useWorkspaceSlug();

  const query = useQuery<ResponseType, Error>({
    queryKey: ['workspace', workspaceSlug],
    queryFn: async () => {
      const response = await client.api.workspaces[':workspaceId'].$get({
        param: { workspaceId: workspaceSlug },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch workspace details');
      }

      return await response.json();
    },
  });

  return query;
};
