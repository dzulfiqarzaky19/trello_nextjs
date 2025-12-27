import { client } from '@/lib/rpc';
import { useMutation } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';

type RequestType = InferRequestType<typeof client.api.settings.profile.$put>;
type ResponseType = InferResponseType<typeof client.api.settings.profile.$put>;

export const useProfile = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.settings.profile.$put({ json });
      return response.json();
    },
  });

  return mutation;
};
