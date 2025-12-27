import { client } from '@/lib/rpc';
import { useMutation } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type RequestType = InferRequestType<typeof client.api.auth.login.$post>;
type ResponseType = InferResponseType<typeof client.api.auth.login.$post>;

export const useLogin = () => {
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth.login.$post({ json });
      return response.json();
    },
    onSuccess: (data) => {
      if ('error' in data) {
        toast.error(data.error);
        return;
      }

      toast.success('Signed in successfully!');
      router.push('/');
      router.refresh();
    },
    onError: () => {
      toast.error('Something went wrong');
    },
  });

  return mutation;
};
