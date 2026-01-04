import { client } from '@/lib/rpc';
import { useQuery } from '@tanstack/react-query';
import { InferResponseType } from 'hono';

type ResponseType = InferResponseType<(typeof client.api.auth)[':id']['$get']>;

export const useUserDetail = (id: string) => {
  const query = useQuery<ResponseType, Error>({
    queryKey: ['user', id],
    queryFn: async () => {
      const response = await client.api.auth[':id'].$get({
        param: { id },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }

      return await response.json();
    },
    enabled: !!id,
  });

  return query;
};
