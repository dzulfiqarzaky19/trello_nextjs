import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { sessionMiddleware } from '@/lib/session-middleware';
import { createTaskSchema, updateTaskSchema } from '../schema';
import { TaskService } from './services';

const app = new Hono()
  .get(
    '/user-tasks',
    sessionMiddleware,
    async (c) => {
      const user = c.get('user');
      const result = await TaskService.getTasksByUser(user.id);

      if (!result.ok) {
        return c.json({ error: result.error }, result.status);
      }

      return c.json({ data: result.data });
    }
  )
  .post(
    '/',
    sessionMiddleware,
    zValidator('json', createTaskSchema),
    async (c) => {
      const user = c.get('user');
      const json = c.req.valid('json');

      const result = await TaskService.create(user.id, json);

      if (!result.ok) {
        return c.json({ error: result.error }, result.status);
      }

      return c.json({ data: result.data });
    }
  )
  .get(
    '/:taskId',
    sessionMiddleware,
    zValidator('param', z.object({ taskId: z.string() })),
    async (c) => {
      const user = c.get('user');
      const { taskId } = c.req.valid('param');

      const result = await TaskService.getById(user.id, taskId);

      if (!result.ok) {
        return c.json({ error: result.error }, result.status);
      }

      return c.json({ data: result.data });
    }
  )
  .patch(
    '/:taskId',
    sessionMiddleware,
    zValidator('param', z.object({ taskId: z.string() })),
    zValidator('json', updateTaskSchema),
    async (c) => {
      const user = c.get('user');
      const { taskId } = c.req.valid('param');
      const json = c.req.valid('json');

      const result = await TaskService.update(user.id, taskId, json);

      if (!result.ok) {
        return c.json({ error: result.error }, result.status);
      }

      return c.json({ data: result.data });
    }
  )
  .delete(
    '/:taskId',
    sessionMiddleware,
    zValidator('param', z.object({ taskId: z.string() })),
    async (c) => {
      const user = c.get('user');
      const { taskId } = c.req.valid('param');

      const result = await TaskService.delete(user.id, taskId);

      if (!result.ok) {
        return c.json({ error: result.error }, result.status);
      }

      return c.json({ data: result.data });
    }
  );

export default app;
