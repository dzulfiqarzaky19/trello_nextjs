import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { sessionMiddleware } from '@/lib/session-middleware';
import { createProjectSchema, updateProjectSchema } from '../schema';
import { ProjectService } from './services';

const app = new Hono()
  .get(
    '/',
    sessionMiddleware,
    zValidator('query', z.object({ workspaceId: z.string().optional() })),
    async (c) => {
      const user = c.get('user');
      const { workspaceId } = c.req.valid('query');

      const result = await ProjectService.list(user.id, workspaceId);

      if (!result.ok) {
        return c.json({ error: result.error }, result.status);
      }

      return c.json({ data: result.data });
    }
  )
  .post(
    '/',
    sessionMiddleware,
    zValidator('form', createProjectSchema),
    async (c) => {
      const user = c.get('user');
      const input = c.req.valid('form');

      const result = await ProjectService.create({
        ...input,
        userId: user.id,
      });

      if (!result.ok) {
        return c.json({ error: result.error }, result.status);
      }

      return c.json({ data: result.data });
    }
  )
  .get(
    '/:projectId',
    sessionMiddleware,
    zValidator('param', z.object({ projectId: z.string() })),
    async (c) => {
      const user = c.get('user');
      const { projectId } = c.req.valid('param');

      const result = await ProjectService.getById(projectId, user.id);

      if (!result.ok) {
        return c.json({ error: result.error }, result.status);
      }

      return c.json({ data: result.data });
    }
  )
  .patch(
    '/:projectId',
    sessionMiddleware,
    zValidator('param', z.object({ projectId: z.string() })),
    zValidator('form', updateProjectSchema),
    async (c) => {
      const user = c.get('user');
      const { projectId } = c.req.valid('param');
      const input = c.req.valid('form');

      const result = await ProjectService.update(projectId, user.id, input);

      if (!result.ok) {
        return c.json({ error: result.error }, result.status);
      }

      return c.json({ data: result.data });
    }
  )
  .delete(
    '/:projectId',
    sessionMiddleware,
    zValidator('param', z.object({ projectId: z.string() })),
    async (c) => {
      const user = c.get('user');
      const { projectId } = c.req.valid('param');

      const result = await ProjectService.delete(projectId, user.id);

      if (!result.ok) {
        return c.json({ error: result.error }, result.status);
      }

      return c.json({ data: result.data });
    }
  );

export default app;
