import { client } from '@/lib/rpc';

import { useQuery } from '@tanstack/react-query';

import { InferResponseType } from 'hono';

type ResponseType = InferResponseType<typeof client.api.auth.me.$get>;

export const useMe = () => {
  const query = useQuery<ResponseType, Error>({
    queryKey: ['me'],

    queryFn: async () => {
      const response = await client.api.auth.me.$get();

      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }

      return await response.json();
    },
  });

  return query;
};
