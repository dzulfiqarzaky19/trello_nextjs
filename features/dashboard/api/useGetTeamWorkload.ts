'use client';
import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/rpc';

export const useGetTeamWorkload = () => {
  return useQuery({
    queryKey: ['dashboard', 'team-workload'],
    queryFn: async () => {
      const response = await client.api.dashboard['team-workload'].$get();

      if (!response.ok) {
        throw new Error('Failed to fetch team workload');
      }

      return await response.json();
    },
  });
};
