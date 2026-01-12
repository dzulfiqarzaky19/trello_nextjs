import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { sessionMiddleware } from '@/lib/session-middleware';
import { createSupabaseServer } from '@/lib/supabase/server';

const app = new Hono()
    .get(
        '/',
        sessionMiddleware,
        zValidator('query', z.object({ workspaceId: z.string() })),
        async (c) => {
            const supabase = await createSupabaseServer();
            const currentUser = c.get('user');
            const { workspaceId } = c.req.valid('query');

            const isUuid =
                /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
                    workspaceId
                );

            let workspaceUuid = workspaceId;

            if (!isUuid) {
                const { data: workspace } = await supabase
                    .from('workspaces')
                    .select('id')
                    .eq('slug', workspaceId)
                    .single();

                if (!workspace) {
                    return c.json({ error: 'Workspace not found' }, 404);
                }
                workspaceUuid = workspace.id;
            }

            const { data: currentMember } = await supabase
                .from('members')
                .select('role')
                .eq('workspace_id', workspaceUuid)
                .eq('user_id', currentUser.id)
                .single();

            if (!currentMember) {
                return c.json({ error: 'Unauthorized' }, 401);
            }

            const { data: members, error } = await supabase
                .from('members')
                .select(`
                    user_id,
                    role,
                    profiles:user_id (
                        id,
                        full_name,
                        avatar_url,
                        email
                    )
                `)
                .eq('workspace_id', workspaceUuid);

            if (error) {
                return c.json({ error: error.message }, 500);
            }

            return c.json({
                data: {
                    members: members || [],
                    isAdmin: currentMember.role === 'ADMIN',
                    currentUserId: currentUser.id,
                    workspaceId: workspaceUuid,
                },
            });
        }
    )
    .post(
        '/',
        sessionMiddleware,
        zValidator(
            'json',
            z.object({
                workspaceId: z.string(),
                userId: z.string().uuid(),
                role: z.enum(['ADMIN', 'MEMBER']).default('MEMBER'),
            })
        ),
        async (c) => {
            const supabase = await createSupabaseServer();
            const currentUser = c.get('user');
            const { workspaceId, userId, role } = c.req.valid('json');

            const { data: currentMember } = await supabase
                .from('members')
                .select('role')
                .eq('workspace_id', workspaceId)
                .eq('user_id', currentUser.id)
                .single();

            if (!currentMember || currentMember.role !== 'ADMIN') {
                return c.json({ error: 'Only admins can add members' }, 403);
            }

            const { data: userToAdd } = await supabase
                .from('profiles')
                .select('id')
                .eq('id', userId)
                .single();

            if (!userToAdd) {
                return c.json({ error: 'User not found' }, 404);
            }

            const { data: existingMember } = await supabase
                .from('members')
                .select('user_id')
                .eq('workspace_id', workspaceId)
                .eq('user_id', userId)
                .single();

            if (existingMember) {
                return c.json({ error: 'User is already a member' }, 400);
            }

            const { error } = await supabase.from('members').insert({
                workspace_id: workspaceId,
                user_id: userId,
                role,
            });

            if (error) {
                return c.json({ error: error.message }, 500);
            }

            return c.json({ success: true });
        }
    )
    .patch(
        '/:userId',
        sessionMiddleware,
        zValidator('param', z.object({ userId: z.string() })),
        zValidator(
            'json',
            z.object({
                workspaceId: z.string(),
                role: z.enum(['ADMIN', 'MEMBER']),
            })
        ),
        async (c) => {
            const supabase = await createSupabaseServer();
            const currentUser = c.get('user');
            const { userId } = c.req.valid('param');
            const { workspaceId, role } = c.req.valid('json');

            const { data: currentMember } = await supabase
                .from('members')
                .select('role')
                .eq('workspace_id', workspaceId)
                .eq('user_id', currentUser.id)
                .single();

            if (!currentMember || currentMember.role !== 'ADMIN') {
                return c.json({ error: 'Only admins can update member roles' }, 403);
            }

            if (userId === currentUser.id) {
                return c.json({ error: 'Cannot change your own role' }, 400);
            }

            const { error } = await supabase
                .from('members')
                .update({ role })
                .eq('workspace_id', workspaceId)
                .eq('user_id', userId);

            if (error) {
                return c.json({ error: error.message }, 500);
            }

            return c.json({ success: true });
        }
    )
    .delete(
        '/:userId',
        sessionMiddleware,
        zValidator('param', z.object({ userId: z.string() })),
        zValidator('json', z.object({ workspaceId: z.string() })),
        async (c) => {
            const supabase = await createSupabaseServer();
            const currentUser = c.get('user');
            const { userId } = c.req.valid('param');
            const { workspaceId } = c.req.valid('json');

            const { data: currentMember } = await supabase
                .from('members')
                .select('role')
                .eq('workspace_id', workspaceId)
                .eq('user_id', currentUser.id)
                .single();

            if (!currentMember || currentMember.role !== 'ADMIN') {
                return c.json({ error: 'Only admins can remove members' }, 403);
            }

            if (userId === currentUser.id) {
                return c.json({ error: 'Cannot remove yourself' }, 400);
            }

            const { error } = await supabase
                .from('members')
                .delete()
                .eq('workspace_id', workspaceId)
                .eq('user_id', userId);

            if (error) {
                return c.json({ error: error.message }, 500);
            }

            return c.json({ success: true });
        }
    );

export default app;
