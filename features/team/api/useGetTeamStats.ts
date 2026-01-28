import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { TeamMember } from '../schema';

export const useGetTeamStats = () => {
  return useQuery<TeamMember[], Error>({
    queryKey: ['team', 'stats'],
    queryFn: async () => {
      const response = await client.api.team.$get();

      if (!response.ok) {
        throw new Error('Failed to fetch team stats');
      }

      const { data } = await response.json();
      return data;
    },
  });
};
