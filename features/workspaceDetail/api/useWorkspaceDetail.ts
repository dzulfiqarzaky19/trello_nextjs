import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { InferResponseType } from 'hono';

type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[':workspaceId']['$get'],
  200
>;

export const useWorkspaceDetail = (workspaceId: string) => {
  const query = useQuery<ResponseType, Error>({
    queryKey: ['workspace', workspaceId],
    queryFn: async () => {
      const response = await client.api.workspaces[':workspaceId'].$get({
        param: { workspaceId },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch workspace details');
      }

      return await response.json();
    },
  });

  return query;
};
