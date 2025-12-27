import { client } from '@/lib/rpc';
import { useMutation } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';

type RequestType = InferRequestType<typeof client.api.settings.security.$post>;
type ResponseType = InferResponseType<
  typeof client.api.settings.security.$post
>;

export const useSecurity = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.settings.security.$post({ json });
      return response.json();
    },
  });

  return mutation;
};
