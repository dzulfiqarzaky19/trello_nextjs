import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { sessionMiddleware } from '@/lib/session-middleware';
import { UserService } from './services';

const app = new Hono().get(
  '/search',
  sessionMiddleware,
  zValidator('query', z.object({ q: z.string().min(2) })),
  async (c) => {
    const user = c.get('user');
    const { q } = c.req.valid('query');

    const result = await UserService.search(q, user.id);

    if (!result.ok) {
      return c.json({ error: result.error }, result.status);
    }

    return c.json(result.data);
  }
);

export default app;
