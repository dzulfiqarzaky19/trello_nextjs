import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { sessionMiddleware } from '@/lib/session-middleware';
import { MemberService } from './services';
import {
  addMemberSchema,
  updateMemberRoleSchema,
  removeMemberSchema,
} from '../schema';

const app = new Hono()
  .get(
    '/',
    sessionMiddleware,
    zValidator('query', z.object({ workspaceId: z.string() })),
    async (c) => {
      const user = c.get('user');
      const { workspaceId } = c.req.valid('query');

      const result = await MemberService.list(workspaceId, user.id);

      if (!result.ok) {
        return c.json({ error: result.error }, result.status);
      }

      return c.json({ data: result.data });
    }
  )
  .post(
    '/',
    sessionMiddleware,
    zValidator('json', addMemberSchema),
    async (c) => {
      const user = c.get('user');
      const { workspaceId, userId, role } = c.req.valid('json');

      const result = await MemberService.add(
        { workspaceId, userId, role },
        user.id
      );

      if (!result.ok) {
        return c.json({ error: result.error }, result.status);
      }

      return c.json({ success: true });
    }
  )
  .patch(
    '/:userId',
    sessionMiddleware,
    zValidator('param', z.object({ userId: z.string() })),
    zValidator('json', updateMemberRoleSchema),
    async (c) => {
      const user = c.get('user');
      const { userId } = c.req.valid('param');
      const { workspaceId, role } = c.req.valid('json');

      const result = await MemberService.updateRole(
        { workspaceId, targetUserId: userId, role },
        user.id
      );

      if (!result.ok) {
        return c.json({ error: result.error }, result.status);
      }

      return c.json({ success: true });
    }
  )
  .delete(
    '/:userId',
    sessionMiddleware,
    zValidator('param', z.object({ userId: z.string() })),
    zValidator('json', removeMemberSchema),
    async (c) => {
      const user = c.get('user');
      const { userId } = c.req.valid('param');
      const { workspaceId } = c.req.valid('json');

      const result = await MemberService.remove(
        { workspaceId, targetUserId: userId },
        user.id
      );

      if (!result.ok) {
        return c.json({ error: result.error }, result.status);
      }

      return c.json({ success: true });
    }
  );

export default app;
