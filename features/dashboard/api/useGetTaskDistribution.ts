'use client';
import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/rpc';

export const useGetTaskDistribution = () => {
  return useQuery({
    queryKey: ['dashboard', 'task-distribution'],
    queryFn: async () => {
      const response = await client.api.dashboard['task-distribution'].$get();

      if (!response.ok) {
        throw new Error('Failed to fetch task distribution');
      }

      return await response.json();
    },
  });
};
