'use client'
import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/rpc';

export const useGetDashboard = () => {
    return useQuery({
        queryKey: ['dashboard'],
        queryFn: async () => {
            const response = await client.api.dashboard.$get();

            if (!response.ok) {
                throw new Error('Failed to fetch dashboard data');
            }

            return await response.json();
        },
    });
};
