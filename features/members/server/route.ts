import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { sessionMiddleware } from '@/lib/session-middleware';
import { createSupabaseServer } from '@/lib/supabase/server';

const app = new Hono()
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

            // Check if current user is admin
            const { data: currentMember } = await supabase
                .from('members')
                .select('role')
                .eq('workspace_id', workspaceId)
                .eq('user_id', currentUser.id)
                .single();

            if (!currentMember || currentMember.role !== 'ADMIN') {
                return c.json({ error: 'Only admins can add members' }, 403);
            }

            // Check if user exists
            const { data: userToAdd } = await supabase
                .from('profiles')
                .select('id')
                .eq('id', userId)
                .single();

            if (!userToAdd) {
                return c.json({ error: 'User not found' }, 404);
            }

            // Check if already a member
            const { data: existingMember } = await supabase
                .from('members')
                .select('user_id')
                .eq('workspace_id', workspaceId)
                .eq('user_id', userId)
                .single();

            if (existingMember) {
                return c.json({ error: 'User is already a member' }, 400);
            }

            // Add member
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

            // Check if current user is admin
            const { data: currentMember } = await supabase
                .from('members')
                .select('role')
                .eq('workspace_id', workspaceId)
                .eq('user_id', currentUser.id)
                .single();

            if (!currentMember || currentMember.role !== 'ADMIN') {
                return c.json({ error: 'Only admins can update member roles' }, 403);
            }

            // Prevent changing own role
            if (userId === currentUser.id) {
                return c.json({ error: 'Cannot change your own role' }, 400);
            }

            // Update role
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

            // Check if current user is admin
            const { data: currentMember } = await supabase
                .from('members')
                .select('role')
                .eq('workspace_id', workspaceId)
                .eq('user_id', currentUser.id)
                .single();

            if (!currentMember || currentMember.role !== 'ADMIN') {
                return c.json({ error: 'Only admins can remove members' }, 403);
            }

            // Prevent removing self
            if (userId === currentUser.id) {
                return c.json({ error: 'Cannot remove yourself' }, 400);
            }

            // Remove member
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
