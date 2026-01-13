import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createSupabaseBrowser } from '@/lib/supabase/client';
import { useProjectId } from './useProjectId';
import { RealtimeChannel } from '@supabase/supabase-js';

export const useProjectRealtime = () => {
    const queryClient = useQueryClient();
    const supabase = createSupabaseBrowser();
    const projectId = useProjectId();


    useEffect(() => {
        let tasksChannel: RealtimeChannel;
        let columnsChannel: RealtimeChannel;

        const setupRealtime = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                console.log('No session found, skipping realtime subscription');
                return;
            }


            tasksChannel = supabase
                .channel(`tasks-realtime-${projectId}`)
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'tasks',
                        filter: `project_id=eq.${projectId}`,
                    },
                    () => {
                        queryClient.invalidateQueries({ queryKey: ['columns', projectId] });
                    }
                )
                .subscribe();

            columnsChannel = supabase
                .channel(`columns-realtime-${projectId}`)
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'columns',
                        filter: `project_id=eq.${projectId}`,
                    },
                    () => {
                        queryClient.invalidateQueries({ queryKey: ['columns', projectId] });
                    }
                )
                .subscribe();
        };

        setupRealtime();

        return () => {
            if (tasksChannel) supabase.removeChannel(tasksChannel);
            if (columnsChannel) supabase.removeChannel(columnsChannel);
        };
    }, [projectId, queryClient, supabase]);
};
