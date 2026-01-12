import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { InferResponseType } from 'hono';

type GetWorkspacesResponse = InferResponseType<
  typeof client.api.workspaces.$get,
  200
>;

type WorkspacesList = GetWorkspacesResponse['workspaces'];

export const useGetWorkspaces = () => {
  return useQuery<WorkspacesList, Error>({
    queryKey: ['workspaces'],
    queryFn: async () => {
      const response = await client.api.workspaces.$get();
      if (!response.ok) throw new Error('Failed to fetch');

      const data = await response.json();

      return data.workspaces;
    },
  });
};
