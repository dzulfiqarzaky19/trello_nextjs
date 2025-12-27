import { client } from '@/lib/rpc';
import { useMutation } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

type RequestType = InferRequestType<typeof client.api.auth.register.$post>;
type ResponseType = InferResponseType<typeof client.api.auth.register.$post>;

export const useRegister = () => {
  const router = useRouter();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth.register.$post({ json });
      return response.json();
    },
    onSuccess: (data) => {
      if ('error' in data) {
        toast.error(data.error);
        return;
      }

      if (typeof data.response === 'string') {
        toast.success(data.response);
        router.push(`/sign-in?message=${encodeURIComponent(data.response)}`);
        return;
      }

      toast.success('Account created! Logging in...');
      router.push('/');
      router.refresh();
    },
    onError: () => {
      toast.error('Something went wrong');
    },
  });

  return mutation;
};
