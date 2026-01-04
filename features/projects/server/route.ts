import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { sessionMiddleware } from '@/lib/session-middleware';
import { createSupabaseServer } from '@/lib/supabase/server';
import { createProjectSchema, updateProjectSchema } from '../schema';

const app = new Hono()
    .get(
        '/',
        sessionMiddleware,
        zValidator('query', z.object({ workspaceId: z.string().optional() })),
        async (c) => {
            const supabase = await createSupabaseServer();
            const user = c.get('user');
            const { workspaceId } = c.req.valid('query');

            let query = supabase.from('projects').select('*');

            if (workspaceId) {
                query = query.eq('workspace_id', workspaceId);
            } else {
                // If no workspaceId filter, we could potentially filter by user membership in workspaces
                // But for now, returning all projects user has access to requires a complex join logic
                // For simplification, allow fetching only by workspaceId context usually
                // Or fetch all workspaces user is member of, then projects in those.

                const { data: userMemberWorkspaces } = await supabase
                    .from('members')
                    .select('workspace_id')
                    .eq('user_id', user.id);

                const workspaceIds = userMemberWorkspaces?.map(m => m.workspace_id) || [];

                if (workspaceIds.length === 0) {
                    return c.json({ data: [] });
                }

                query = query.in('workspace_id', workspaceIds);
            }

            const { data, error } = await query;

            if (error) {
                return c.json({ error: error.message }, 500);
            }

            return c.json({ data });
        }
    )
    .post(
        '/',
        sessionMiddleware,
        zValidator('form', createProjectSchema),
        async (c) => {
            const supabase = await createSupabaseServer();
            const user = c.get('user');
            const { name, workspace_id, image, status } = c.req.valid('form');

            // Verify membership
            const { data: member } = await supabase
                .from('members')
                .select('role')
                .eq('workspace_id', workspace_id)
                .eq('user_id', user.id)
                .single();

            if (!member) {
                return c.json({ error: 'Unauthorized' }, 401);
            }

            let imageUrl = null;
            if (image instanceof File) {
                const fileName = `${workspace_id}/${Date.now()}-${image.name}`;
                const { data, error } = await supabase.storage
                    .from('workspace_image')
                    .upload(fileName, image, {
                        cacheControl: '3600',
                        upsert: false,
                    });

                if (error) return c.json({ error: error.message }, 500);

                const {
                    data: { publicUrl },
                } = supabase.storage.from('workspace_image').getPublicUrl(data.path);

                imageUrl = publicUrl;
            }

            const { data, error } = await supabase
                .from('projects')
                .insert({
                    name,
                    workspace_id,
                    image_url: imageUrl,
                    status: status || 'ACTIVE',
                })
                .select()
                .single();

            if (error) {
                return c.json({ error: error.message }, 500);
            }

            return c.json({ data });
        }
    );

export default app;
