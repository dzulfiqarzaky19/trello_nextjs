import { client } from '@/lib/rpc';
import { useMutation } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';

type RequestType = InferRequestType<typeof client.api.auth.logout.$post>;
type ResponseType = InferResponseType<typeof client.api.auth.logout.$post>;

export const useLogout = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async () => {
      const response = await client.api.auth.logout.$post();
      return response.json();
    },
  });

  return mutation;
};
