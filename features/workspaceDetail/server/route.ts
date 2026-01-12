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

    const isMember = data.members.some((m: any) => m.user_id === user.id);

    if (!isMember) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const result = workspaceDetailSchema.safeParse(data);

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

      // Check if current user is admin of this workspace
      const { data: currentMember } = await supabase
        .from('members')
        .select('role')
        .eq('workspace_id', workspaceId)
        .eq('user_id', currentUser.id)
        .single();

      if (!currentMember || currentMember.role !== 'ADMIN') {
        return c.json({ error: 'Only admins can add members' }, 403);
      }

      // Check if user to add exists
      const { data: userToAdd } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();

      if (!userToAdd) {
        return c.json({ error: 'User not found' }, 404);
      }

      // Check if user is already a member
      const { data: existingMember } = await supabase
        .from('members')
        .select('user_id')
        .eq('workspace_id', workspaceId)
        .eq('user_id', userId)
        .single();

      if (existingMember) {
        return c.json({ error: 'User is already a member' }, 400);
      }

      // Add the member
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
  );

export default app;
