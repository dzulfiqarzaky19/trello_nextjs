import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { sessionMiddleware } from '@/lib/session-middleware';
import { createSupabaseServer } from '@/lib/supabase/server';
import { workspaceDetailSchema } from '../schema';

const app = new Hono().get(
  '/:workspaceId',
  sessionMiddleware,
  zValidator('param', z.object({ workspaceId: z.string() })),
  async (c) => {
    const supabase = await createSupabaseServer();
    const user = c.get('user');
    const { workspaceId } = c.req.valid('param');

    let query = supabase.from('workspaces').select(
      `
        *,
        user:user_id (
          id,
          full_name,
          avatar_url,
          email,
          role
        ),
        members (
          user_id,
          role,
          profiles:user_id (
            id,
            full_name,
            avatar_url,
            email
          )
        ),
        projects (*)
      `
    );

    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        workspaceId
      );

    if (isUuid) {
      query = query.eq('id', workspaceId);
    } else {
      query = query.eq('slug', workspaceId);
    }

    const { data, error } = await query.single();

    if (error) {
      return c.json({ error: error.message }, 500);
    }

    if (!data) {
      return c.json({ error: 'Workspace not found' }, 404);
    }

    const currentMember = data.members.find((m: any) => m.user_id === user.id);

    if (!currentMember) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const isAdmin = currentMember.role === 'ADMIN';

    const result = workspaceDetailSchema.safeParse({
      ...data,
      isAdmin,
      currentUserId: user.id,
    });

    if (!result.success) {
      console.log('Validation Error:', result.error);
      return c.json({ error: 'Data validation failed' }, 500);
    }

    return c.json({ data: result.data });
  }
)
  .post(
    '/:workspaceId/members',
    sessionMiddleware,
    zValidator('param', z.object({ workspaceId: z.string() })),
    zValidator(
      'json',
      z.object({
        userId: z.string().uuid(),
        role: z.enum(['ADMIN', 'MEMBER']).default('MEMBER'),
      })
    ),
    async (c) => {
      const supabase = await createSupabaseServer();
      const currentUser = c.get('user');
      const { workspaceId } = c.req.valid('param');
      const { userId, role } = c.req.valid('json');

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
    '/:workspaceId/members/:userId',
    sessionMiddleware,
    zValidator(
      'param',
      z.object({ workspaceId: z.string(), userId: z.string() })
    ),
    zValidator('json', z.object({ role: z.enum(['ADMIN', 'MEMBER']) })),
    async (c) => {
      const supabase = await createSupabaseServer();
      const currentUser = c.get('user');
      const { workspaceId, userId } = c.req.valid('param');
      const { role } = c.req.valid('json');

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
    '/:workspaceId/members/:userId',
    sessionMiddleware,
    zValidator(
      'param',
      z.object({ workspaceId: z.string(), userId: z.string() })
    ),
    async (c) => {
      const supabase = await createSupabaseServer();
      const currentUser = c.get('user');
      const { workspaceId, userId } = c.req.valid('param');

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
