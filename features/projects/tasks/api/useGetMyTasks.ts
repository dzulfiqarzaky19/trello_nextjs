import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { InferResponseType } from 'hono';

type ResponseType = InferResponseType<
  (typeof client.api.tasks)['user-tasks']['$get'],
  200
>;

export const useGetMyTasks = () => {
  return useQuery<ResponseType, Error>({
    queryKey: ['my-tasks'],
    queryFn: async () => {
      const response = await client.api.tasks['user-tasks'].$get();

      if (!response.ok) {
        throw new Error('Failed to fetch user tasks');
      }

      return await response.json();
    },
  });
};
