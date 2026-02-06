import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { sessionMiddleware } from '@/lib/session-middleware';
import { createColumnSchema, updateColumnSchema } from '../schema';
import { ColumnService } from './services';

const app = new Hono()
  .get(
    '/',
    sessionMiddleware,
    zValidator('query', z.object({ projectId: z.string() })),
    async (c) => {
      const user = c.get('user');
      const { projectId } = c.req.valid('query');

      const result = await ColumnService.list(user.id, projectId);

      if (!result.ok) {
        return c.json({ error: result.error }, result.status);
      }

      return c.json({ data: result.data });
    }
  )
  .post(
    '/',
    sessionMiddleware,
    zValidator('json', createColumnSchema),
    async (c) => {
      const user = c.get('user');
      const input = c.req.valid('json');

      const result = await ColumnService.create(user.id, input);

      if (!result.ok) {
        return c.json({ error: result.error }, result.status);
      }

      return c.json({ data: result.data });
    }
  )
  .patch(
    '/:columnId',
    sessionMiddleware,
    zValidator('param', z.object({ columnId: z.string() })),
    zValidator('json', updateColumnSchema),
    async (c) => {
      const user = c.get('user');
      const { columnId } = c.req.valid('param');
      const input = c.req.valid('json');

      const result = await ColumnService.update(user.id, columnId, input);

      if (!result.ok) {
        return c.json({ error: result.error }, result.status);
      }

      return c.json({ data: result.data });
    }
  )
  .delete(
    '/:columnId',
    sessionMiddleware,
    zValidator('param', z.object({ columnId: z.string() })),
    async (c) => {
      const user = c.get('user');
      const { columnId } = c.req.valid('param');

      const result = await ColumnService.delete(user.id, columnId);

      if (!result.ok) {
        return c.json({ error: result.error }, result.status);
      }

      return c.json({ data: result.data });
    }
  );

export default app;
