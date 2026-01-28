'use client';
import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/rpc';

export const useGetRecentActivity = () => {
  return useQuery({
    queryKey: ['dashboard', 'recent-activity'],
    queryFn: async () => {
      const response = await client.api.dashboard['recent-activity'].$get();

      if (!response.ok) {
        throw new Error('Failed to fetch recent activity');
      }

      return await response.json();
    },
  });
};
