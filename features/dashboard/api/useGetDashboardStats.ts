'use client';
import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/rpc';

export const useGetDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const response = await client.api.dashboard.stats.$get();

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }

      return await response.json();
    },
  });
};
