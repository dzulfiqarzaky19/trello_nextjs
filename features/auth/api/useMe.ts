import { client } from '@/lib/rpc';

import { useQuery } from '@tanstack/react-query';

import { InferResponseType } from 'hono';

type ResponseType = InferResponseType<typeof client.api.auth.me.$get, 200>;

export const useMe = () => {
  const query = useQuery<ResponseType, Error>({
    queryKey: ['me'],

    queryFn: async () => {
      const response = await client.api.auth.me.$get();

      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }

      const { user, profile } = await response.json();

      return { user, profile };
    },
  });

  return query;
};
