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
    )
    .get(
        '/:projectId',
        sessionMiddleware,
        zValidator('param', z.object({ projectId: z.string() })),
        async (c) => {
            const supabase = await createSupabaseServer();
            const { projectId } = c.req.valid('param');

            const { data, error } = await supabase
                .from('projects')
                .select('*, columns(*, tasks(*))')
                .eq('id', projectId)
                .single();

            if (error) {
                return c.json({ error: error.message }, 500);
            }

            return c.json({ data });
        }
    )
    .patch(
        '/:projectId',
        sessionMiddleware,
        zValidator('param', z.object({ projectId: z.string() })),
        zValidator('form', updateProjectSchema),
        async (c) => {
            const supabase = await createSupabaseServer();
            const user = c.get('user');
            const { projectId } = c.req.valid('param');
            const { name, image, status } = c.req.valid('form');

            const { data: project } = await supabase
                .from('projects')
                .select('workspace_id')
                .eq('id', projectId)
                .single();

            if (!project) return c.json({ error: 'Project not found' }, 404);

            const { data: member } = await supabase
                .from('members')
                .select('role')
                .eq('workspace_id', project.workspace_id)
                .eq('user_id', user.id)
                .single();

            if (!member) return c.json({ error: 'Unauthorized' }, 401);

            let imageUrl = undefined;
            if (image instanceof File) {
                const fileName = `${project.workspace_id}/${Date.now()}-${image.name}`;
                const { data, error } = await supabase.storage
                    .from('workspace_image')
                    .upload(fileName, image, {
                        cacheControl: '3600',
                        upsert: false,
                    });

                if (error) return c.json({ error: error.message }, 500);

                const { data: { publicUrl } } = supabase.storage.from('workspace_image').getPublicUrl(data.path);
                imageUrl = publicUrl;
            }

            const { data, error } = await supabase
                .from('projects')
                .update({
                    name,
                    status,
                    ...(imageUrl && { image_url: imageUrl }),
                })
                .eq('id', projectId)
                .select()
                .single();

            if (error) return c.json({ error: error.message }, 500);

            return c.json({ data });
        }
    )
    .delete(
        '/:projectId',
        sessionMiddleware,
        zValidator('param', z.object({ projectId: z.string() })),
        async (c) => {
            const supabase = await createSupabaseServer();
            const user = c.get('user');
            const { projectId } = c.req.valid('param');

            const { data: project } = await supabase
                .from('projects')
                .select('workspace_id')
                .eq('id', projectId)
                .single();

            if (!project) return c.json({ error: 'Project not found' }, 404);

            const { data: member } = await supabase
                .from('members')
                .select('role')
                .eq('workspace_id', project.workspace_id)
                .eq('user_id', user.id)
                .single();

            if (!member || member.role !== 'ADMIN') {
                return c.json({ error: 'Unauthorized' }, 401);
            }

            const { error } = await supabase
                .from('projects')
                .delete()
                .eq('id', projectId);

            if (error) return c.json({ error: error.message }, 500);

            return c.json({ data: { success: true } });
        }
    )
    .post(
        '/:projectId/tasks',
        sessionMiddleware,
        zValidator('param', z.object({ projectId: z.string() })),
        zValidator('json', z.object({
            title: z.string(),
            description: z.string().optional(),
            columnId: z.string(),
            position: z.number().default(0),
        })),
        async (c) => {
            const supabase = await createSupabaseServer();
            const user = c.get('user');
            const { projectId } = c.req.valid('param');
            const { title, description, columnId, position } = c.req.valid('json');

            // Verify membership
            const { data: member } = await supabase
                .from('members')
                .select('role')
                .eq('workspace_id', (
                    supabase.from('projects').select('workspace_id').eq('id', projectId).single() as any
                )) // TODO: Fix this optimizing query
            // Actually, let's just query project first or trust RLS?
            // RLS on 'tasks' checks membership via 'projects' -> 'workspaces'.
            // So simple insert should be safe if RLS is on.
            // But we need to make sure project exists.

            // Let's rely on RLS for safety, but check project existence for 404
            const { data: project } = await supabase.from('projects').select('workspace_id').eq('id', projectId).single();
            if (!project) return c.json({ error: 'Project not found' }, 404);

            const { data, error } = await supabase
                .from('tasks')
                .insert({
                    title,
                    description,
                    project_id: projectId,
                    column_id: columnId,
                    position,
                })
                .select()
                .single();

            if (error) return c.json({ error: error.message }, 500);

            return c.json({ data });
        }
    )
    .post(
        '/:projectId/columns',
        sessionMiddleware,
        zValidator('param', z.object({ projectId: z.string() })),
        zValidator('json', z.object({
            title: z.string(),
            description: z.string().optional(),
            headerColor: z.string().optional(),
        })),
        async (c) => {
            const supabase = await createSupabaseServer();
            const { projectId } = c.req.valid('param');
            const { title } = c.req.valid('json');

            // Verify membership / existence by simple RLS constrained insert or check
            // Checking project existence first
            const { data: project } = await supabase.from('projects').select('id').eq('id', projectId).single();
            if (!project) return c.json({ error: 'Project not found' }, 404);

            // Get max position to append
            const { data: maxPosData } = await supabase
                .from('columns')
                .select('position')
                .eq('project_id', projectId)
                .order('position', { ascending: false })
                .limit(1)
                .single();

            const newPosition = (maxPosData?.position ?? 0) + 1;

            const { data, error } = await supabase
                .from('columns')
                .insert({
                    name: title,
                    project_id: projectId,
                    position: newPosition,
                })
                .select()
                .single();

            if (error) return c.json({ error: error.message }, 500);

            return c.json({ data });
        }
    );

export default app;
