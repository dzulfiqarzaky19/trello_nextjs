import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

type ResponseType = InferResponseType<typeof client.api.projects[':projectId']['columns']['$post'], 200>;
type RequestType = InferRequestType<typeof client.api.projects[':projectId']['columns']['$post']>;

export const useCreateColumn = ({ projectId }: { projectId: string }) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ param, json }) => {
            const response = await client.api.projects[':projectId']['columns'].$post({
                param,
                json,
            });

            if (!response.ok) {
                throw new Error('Failed to create column');
            }

            return await response.json();
        },
        onSuccess: () => {
            toast.success('Column created');
            queryClient.invalidateQueries({ queryKey: ['project', projectId] });
        },
        onError: () => {
            toast.error('Failed to create column');
        },
    });

    return mutation;
};
