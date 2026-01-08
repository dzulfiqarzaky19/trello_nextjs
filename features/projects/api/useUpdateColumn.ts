import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

type ResponseType = InferResponseType<typeof client.api.projects[':projectId']['columns'][':columnId']['$patch'], 200>;
type RequestType = InferRequestType<typeof client.api.projects[':projectId']['columns'][':columnId']['$patch']>;

export const useUpdateColumn = ({ projectId }: { projectId: string }) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ param, json }) => {
            const response = await client.api.projects[':projectId']['columns'][':columnId'].$patch({
                param,
                json,
            });

            if (!response.ok) {
                const errorData = await response.json() as { error?: string };
                throw new Error(errorData.error || 'Failed to update column');
            }

            return await response.json();
        },
        onSuccess: () => {
            toast.success('Column updated');
            queryClient.invalidateQueries({ queryKey: ['project', projectId] });
        },
        onError: (e) => {
            toast.error(e.message);
        },
    });

    return mutation;
};
