import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { IUserSearchResponse } from '../schema';

const FIVE_MINS_CACHE_TIME = 1000 * 60 * 5;

export const useSearchUsers = (query: string) => {
  return useQuery({
    queryKey: ['users', 'search', query],
    queryFn: async (): Promise<IUserSearchResponse> => {
      const response = await client.api.users.search.$get({
        query: { q: query },
      });

      if (!response.ok) {
        throw new Error('Failed to search users');
      }

      return response.json();
    },
    enabled: query.length >= 2,
    staleTime: FIVE_MINS_CACHE_TIME,
  });
};
