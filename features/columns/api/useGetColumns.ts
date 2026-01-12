import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { useProjectId } from '@/features/projects/hooks/useProjectId';

export const useGetColumns = () => {
  const projectId = useProjectId();

  const query = useQuery({
    queryKey: ['columns', projectId],
    queryFn: async () => {
      const response = await client.api.columns.$get({
        query: { projectId },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch columns');
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
