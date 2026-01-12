import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createSupabaseBrowser } from '@/lib/supabase/client';
import { toast } from 'sonner';

export const useProjectRealtime = (projectId: string) => {
    const queryClient = useQueryClient();
    const supabase = createSupabaseBrowser();

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            console.log('Realtime Auth Check:', user?.id ? `Logged in as ${user.id}` : 'No active session');
        };
        checkAuth();

        // Channel for tasks
        const tasksChannel = supabase
            .channel('tasks-realtime')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'tasks',
                    filter: `project_id=eq.${projectId}`,
                },
                (payload) => {
                    console.log('Task Change received!', payload);
                    queryClient.invalidateQueries({ queryKey: ['columns', projectId] });
                }
            )
            .subscribe((status) => {
                console.log('Tasks Realtime Status:', status);
                if (status === 'SUBSCRIBED') {
                    console.log('Successfully subscribed in realtime to tasks');
                }
            });

        // Channel for columns
        const columnsChannel = supabase
            .channel('columns-realtime')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'columns',
                    filter: `project_id=eq.${projectId}`,
                },
                (payload) => {
                    console.log('Column Change received!', payload);
                    console.log('Invalidating query for:', ['columns', projectId]);
                    queryClient.invalidateQueries({ queryKey: ['columns', projectId] });
                }
            )
            .subscribe((status) => {
                console.log('Columns Realtime Status:', status);
            });

        return () => {
            supabase.removeChannel(tasksChannel);
            supabase.removeChannel(columnsChannel);
        };
    }, [projectId, queryClient, supabase]);
};
